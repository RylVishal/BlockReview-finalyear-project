const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const Paper = require("../models/Paper");
const User = require("../models/User");
const Review = require("../models/Review");
const PointTransaction = require("../models/PointTransaction");
const { auth, requireRole } = require("../middleware/auth");

// Setup multer for file uploads (simulated IPFS)
const uploadDir = path.join(__dirname, "../uploads/papers");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Simulate IPFS hash
const generateIPFSHash = (content) => {
  return "Qm" + crypto.createHash("sha256").update(content + Date.now()).digest("hex").substring(0, 44);
};

// POST /api/papers/submit
router.post("/submit", auth, requireRole("publisher", "admin"), upload.single("file"), async (req, res) => {
  try {
    const { title, abstract, keywords, authors, category } = req.body;
    if (!title || !abstract)
      return res.status(400).json({ success: false, message: "Title and abstract required" });

    const paperHash = generateIPFSHash(title + abstract);
    const metadataHash = generateIPFSHash(JSON.stringify({ title, abstract, keywords }));

    const paper = await Paper.create({
      title,
      abstract,
      keywords: keywords ? JSON.parse(keywords) : [],
      authors: authors ? JSON.parse(authors) : [req.user.name],
      category: category || "Other",
      submittedBy: req.user._id,
      paperHash,
      metadataHash,
      fileUrl: req.file ? `/uploads/papers/${req.file.filename}` : "",
      fileName: req.file ? req.file.originalname : "",
      fileSize: req.file ? req.file.size : 0,
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10, "stats.papersSubmitted": 1, "stats.totalEarned": 10 },
    });

    // Record points
    await PointTransaction.create({
      user: req.user._id,
      amount: 10,
      type: "earned",
      reason: "Paper Submitted",
      relatedPaper: paper._id,
    });

    await paper.populate("submittedBy", "name email institution");
    res.status(201).json({ success: true, paper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/papers - public browse
router.get("/", async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = "published"; // Default to published only for public
    }

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { abstract: { $regex: search, $options: "i" } },
        { keywords: { $in: [new RegExp(search, "i")] } },
        { authors: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const papers = await Paper.find(query)
      .populate("submittedBy", "name email institution")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Paper.countDocuments(query);

    res.json({ success: true, papers, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/papers/all - admin/reviewer view all statuses
router.get("/all", auth, requireRole("admin", "reviewer"), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const papers = await Paper.find(query)
      .populate("submittedBy", "name email institution")
      .populate("assignedReviewers", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Paper.countDocuments(query);
    res.json({ success: true, papers, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/papers/my - publisher's own papers
router.get("/my", auth, requireRole("publisher", "admin"), async (req, res) => {
  try {
    const papers = await Paper.find({ submittedBy: req.user._id })
      .populate("assignedReviewers", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, papers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/papers/assigned - reviewer's assigned papers
router.get("/assigned", auth, requireRole("reviewer", "admin"), async (req, res) => {
  try {
    const papers = await Paper.find({ assignedReviewers: req.user._id })
      .populate("submittedBy", "name email institution")
      .sort({ createdAt: -1 });
    res.json({ success: true, papers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/papers/:id
router.get("/:id", async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate("submittedBy", "name email institution")
      .populate("assignedReviewers", "name email");
    if (!paper) return res.status(404).json({ success: false, message: "Paper not found" });

    // Increment read count for published papers
    if (paper.status === "published") {
      await Paper.findByIdAndUpdate(req.params.id, { $inc: { readCount: 1 } });
    }

    res.json({ success: true, paper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/papers/:id/status - admin update status
router.put("/:id/status", auth, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ success: false, message: "Paper not found" });

    const oldStatus = paper.status;
    paper.status = status;
    if (status === "published") paper.publishedAt = new Date();
    if (status === "revision_required") paper.revisionRequestedAt = new Date();
    await paper.save();

    // Award bonus points when published
    if (status === "published" && oldStatus !== "published") {
      await User.findByIdAndUpdate(paper.submittedBy, {
        $inc: { points: 50, "stats.papersPublished": 1, "stats.totalEarned": 50 },
      });
      await PointTransaction.create({
        user: paper.submittedBy,
        amount: 50,
        type: "earned",
        reason: "Paper Published",
        relatedPaper: paper._id,
      });
    }

    res.json({ success: true, paper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/papers/:id/assign - assign reviewer
router.put("/:id/assign", auth, requireRole("admin"), async (req, res) => {
  try {
    const { reviewerId } = req.body;
    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { assignedReviewers: reviewerId }, status: "under_review" },
      { new: true }
    ).populate("assignedReviewers", "name email");
    res.json({ success: true, paper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/papers/:id/download
router.get("/:id/download", async (req, res) => {
  try {
    await Paper.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    const paper = await Paper.findById(req.params.id);
    res.json({ success: true, fileUrl: paper.fileUrl, paperHash: paper.paperHash });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
