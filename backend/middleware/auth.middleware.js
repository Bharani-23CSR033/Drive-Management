const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        data: {},
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id).select("-password -otp -otpExpiresAt");
    if (!user) {
      return res.status(401).json({
        success: false,
        data: {},
        message: "Invalid token user",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: {},
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
