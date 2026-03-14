const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    paper: { type: mongoose.Schema.Types.ObjectId, ref: "Paper", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Review content
    summary: { type: String, required: true },
    strengths: { type: String, required: true },
    weaknesses: { type: String, required: true },
    comments: { type: String, default: "" },
    recommendation: {
      type: String,
      enum: ["accept", "minor_revision", "major_revision", "reject"],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    // Blockchain data
    reviewHash: { type: String, default: "" },
    blockchainReviewId: { type: Number, default: null },
    txHash: { type: String, default: "" },
    // Status
    status: {
      type: String,
      enum: ["pending", "submitted", "approved", "rejected"],
      default: "submitted",
    },
    pointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
