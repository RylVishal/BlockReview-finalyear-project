const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Review = require("../models/Review");
const Paper = require("../models/Paper");
const User = require("../models/User");
const PointTransaction = require("../models/PointTransaction");
const { auth, requireRole } = require("../middleware/auth");

const generateHash = (content) =>
  "Qm" + crypto.createHash("sha256").update(content + Date.now()).digest("hex").substring(0, 44);

// POST /api/reviews - submit a review
router.post("/", auth, requireRole("reviewer", "admin"), async (req, res) => {
  try {
    const { paperId, summary, strengths, weaknesses, comments, recommendation, rating } = req.body;

    const paper = await Paper.findById(paperId);
    if (!paper) return res.status(404).json({ success: false, message: "Paper not found" });
    if (paper.submittedBy.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: "Cannot review your own paper" });

    const existing = await Review.findOne({ paper: paperId, reviewer: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: "Already reviewed this paper" });

    const reviewHash = generateHash(summary + strengths + weaknesses + recommendation);
    const review = await Review.create({
      paper: paperId,
      reviewer: req.user._id,
      summary, strengths, weaknesses, comments, recommendation,
      rating: parseInt(rating),
      reviewHash,
      pointsAwarded: 25,
    });

    // Update paper average rating
    const allReviews = await Review.find({ paper: paperId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Paper.findByIdAndUpdate(paperId, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    // Award points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 25, "stats.reviewsCompleted": 1, "stats.totalEarned": 25 },
    });
    await PointTransaction.create({
      user: req.user._id,
      amount: 25,
      type: "earned",
      reason: "Review Completed",
      relatedPaper: paper._id,
      relatedReview: review._id,
    });

    await review.populate("reviewer", "name email institution");
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/my - reviewer's own reviews
router.get("/my", auth, requireRole("reviewer", "admin"), async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate("paper", "title status category")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/paper/:paperId
router.get("/paper/:paperId", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ paper: req.params.paperId })
      .populate("reviewer", "name email institution")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/stats - reviewer stats
router.get("/stats", auth, requireRole("reviewer", "admin"), async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id });
    const stats = {
      total: reviews.length,
      byRecommendation: {
        accept: reviews.filter((r) => r.recommendation === "accept").length,
        minor_revision: reviews.filter((r) => r.recommendation === "minor_revision").length,
        major_revision: reviews.filter((r) => r.recommendation === "major_revision").length,
        reject: reviews.filter((r) => r.recommendation === "reject").length,
      },
      avgRating: reviews.length
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
        : 0,
      pointsEarned: reviews.length * 25,
    };
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
