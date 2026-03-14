const mongoose = require("mongoose");

const pointTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["earned", "spent"], default: "earned" },
    reason: { type: String, required: true },
    relatedPaper: { type: mongoose.Schema.Types.ObjectId, ref: "Paper", default: null },
    relatedReview: { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: null },
    txHash: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PointTransaction", pointTransactionSchema);
