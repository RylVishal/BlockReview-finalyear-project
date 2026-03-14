const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "No auth token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "blockreview_secret_key_2024");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied: insufficient role" });
  }
  next();
};

module.exports = { auth, requireRole };
