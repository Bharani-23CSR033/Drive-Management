const User = require("../models/User");
const Application = require("../models/Application");
const Drive = require("../models/Drive");
const Notification = require("../models/Notification");
const { uploadFileBuffer } = require("../config/cloudinary");

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (String(req.user._id) !== String(id) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed" });
    }

    const student = await User.findById(id).select("-password -otp -otpExpiresAt");
    if (!student) {
      return res.status(404).json({ success: false, data: {}, message: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      data: { student },
      message: "Student profile fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const updateStudentProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (String(req.user._id) !== String(id) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed" });
    }

    const allowedFields = ["name", "college", "CGPA", "skills", "profilePic"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const student = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password -otp -otpExpiresAt");
    if (!student) {
      return res.status(404).json({ success: false, data: {}, message: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      data: { student },
      message: "Student profile updated",
    });
  } catch (error) {
    return next(error);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, data: {}, message: "Resume file is required" });
    }

    let resumeUrl = "";
    try {
      resumeUrl = await uploadFileBuffer({
        buffer: req.file.buffer,
        folder: "drive-management/resumes",
        resourceType: "raw",
        mimeType: req.file.mimetype,
      });
    } catch (error) {
      resumeUrl = `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${Date.now()}-${req.file.originalname}`;
    }

    const student = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl },
      { new: true }
    ).select("-password -otp -otpExpiresAt");

    return res.status(200).json({
      success: true,
      data: { resumeUrl, student },
      message: "Resume uploaded successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const [appliedCount, shortlistedCount, rejectedCount, upcoming] = await Promise.all([
      Application.countDocuments({ student: studentId }),
      Application.countDocuments({ student: studentId, status: "shortlisted" }),
      Application.countDocuments({ student: studentId, status: "rejected" }),
      Drive.countDocuments({ deadline: { $gte: new Date() }, status: "open" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          appliedCount,
          shortlistedCount,
          rejectedCount,
          upcoming,
        },
      },
      message: "Student dashboard fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const getStudentApplications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [applications, total] = await Promise.all([
      Application.find({ student: req.user._id })
        .populate("drive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ student: req.user._id }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      message: "Student applications fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const getStudentNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { notifications },
      message: "Student notifications fetched",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  getStudentDashboard,
  getStudentApplications,
  getStudentNotifications,
};
