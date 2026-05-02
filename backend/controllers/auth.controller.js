const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const otpGenerator = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");

const sanitizeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college,
    CGPA: user.CGPA,
    skills: user.skills,
    resumeUrl: user.resumeUrl,
    profilePic: user.profilePic,
    shortlisted: user.shortlisted,
  };
};

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: { user: sanitizeUser(req.user) },
    message: "Current user fetched",
  });
};

const register = async (req, res, next) => {
  let createdUser = null;
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, data: {}, message: "All fields are required" });
    }

    if (!["student", "admin", "company"].includes(role)) {
      return res.status(400).json({ success: false, data: {}, message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, data: {}, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });
    createdUser = user;

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: { token, user: sanitizeUser(user) },
      message: "Registration successful",
    });
  } catch (error) {
    if (createdUser) {
      await User.deleteOne({ _id: createdUser._id });
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, data: {}, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, data: {}, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, data: {}, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      data: { token, user: sanitizeUser(user) },
      message: "Login successful",
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {},
    message: "Logout successful",
  });
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, data: {}, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpiresAt");
    if (!user) {
      return res.status(404).json({ success: false, data: {}, message: "User not found" });
    }

    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpVerified = false;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your OTP for password reset",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    return res.status(200).json({
      success: true,
      data: {},
      message: "OTP sent successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, data: {}, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpiresAt");
    if (!user) {
      return res.status(404).json({ success: false, data: {}, message: "User not found" });
    }

    if (!user.otp || !user.otpExpiresAt || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, data: {}, message: "Invalid or expired OTP" });
    }

    user.otpVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      data: {},
      message: "OTP verified successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, data: {}, message: "Email and new password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpiresAt +password");
    if (!user) {
      return res.status(404).json({ success: false, data: {}, message: "User not found" });
    }

    const otpValid = user.otp && user.otpExpiresAt && user.otp === otp && user.otpExpiresAt > new Date();
    if (!user.otpVerified && !otpValid) {
      return res.status(400).json({ success: false, data: {}, message: "OTP verification required" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      data: {},
      message: "Password reset successful",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
