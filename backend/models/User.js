const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["publisher", "reviewer", "public", "admin"], default: "public" },
    walletAddress: { type: String, default: null },
    points: { type: Number, default: 0 },
    institution: { type: String, default: "" },
    bio: { type: String, default: "" },
    expertise: [{ type: String }],
    avatar: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    stats: {
      papersSubmitted: { type: Number, default: 0 },
      papersPublished: { type: Number, default: 0 },
      reviewsCompleted: { type: Number, default: 0 },
      totalEarned: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
