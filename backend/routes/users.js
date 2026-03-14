const express = require("express");
const router = express.Router();
const User = require("../models/User");
const PointTransaction = require("../models/PointTransaction");
const { auth, requireRole } = require("../middleware/auth");

// GET /api/users/reviewers - list all reviewers (for admin)
router.get("/reviewers", auth, requireRole("admin"), async (req, res) => {
  try {
    const reviewers = await User.find({ role: "reviewer" }).select("name email institution expertise points stats");
    res.json({ success: true, reviewers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/points - current user's point history
router.get("/points", auth, async (req, res) => {
  try {
    const transactions = await PointTransaction.find({ user: req.user._id })
      .populate("relatedPaper", "title")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, transactions, totalPoints: req.user.points });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["publisher", "reviewer"] } })
      .select("name role institution points stats")
      .sort({ points: -1 })
      .limit(10);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
