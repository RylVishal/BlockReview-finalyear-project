const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    abstract: { type: String, required: true },
    keywords: [{ type: String }],
    authors: [{ type: String }],
    category: {
      type: String,
      enum: ["Computer Science", "Medicine", "Physics", "Biology", "Chemistry", "Mathematics", "Engineering", "Social Sciences", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["submitted", "under_review", "revision_required", "published", "rejected"],
      default: "submitted",
    },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedReviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Blockchain data
    blockchainPaperId: { type: Number, default: null },
    paperHash: { type: String, default: "" },        // IPFS/simulated hash
    metadataHash: { type: String, default: "" },
    txHash: { type: String, default: "" },
    // File storage (simulated IPFS)
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },
    // Stats
    readCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    // Dates
    publishedAt: { type: Date, default: null },
    revisionRequestedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

paperSchema.index({ title: "text", abstract: "text", keywords: "text" });

module.exports = mongoose.model("Paper", paperSchema);
