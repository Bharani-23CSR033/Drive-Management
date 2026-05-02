const User = require("../models/User");
const Drive = require("../models/Drive");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalDrives, totalStudents, selectedCount, totalApplications] = await Promise.all([
      Drive.countDocuments(),
      User.countDocuments({ role: "student" }),
      Application.countDocuments({ status: "selected" }),
      Application.countDocuments(),
    ]);

    const placementRate = totalApplications > 0 ? Number(((selectedCount / totalApplications) * 100).toFixed(2)) : 0;

    return res.status(200).json({
      success: true,
      data: { totalDrives, totalStudents, placementRate },
      message: "Admin dashboard fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search, college } = req.query;

    const filter = { role: "student" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (college) {
      filter.college = { $regex: college, $options: "i" };
    }

    const [students, total] = await Promise.all([
      User.find(filter)
        .select("-password -otp -otpExpiresAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    const studentIds = students.map((student) => student._id);
    const counts = await Application.aggregate([
      { $match: { student: { $in: studentIds } } },
      { $group: { _id: "$student", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((entry) => [String(entry._id), entry.count]));

    return res.status(200).json({
      success: true,
      data: {
        students: students.map((student) => ({
          ...student.toJSON(),
          applications: countMap.get(String(student._id)) || 0,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      message: "Students fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const shortlistStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { shortlisted = true } = req.body;

    const student = await User.findOneAndUpdate(
      { _id: id, role: "student" },
      { shortlisted: Boolean(shortlisted) },
      { new: true }
    ).select("-password -otp -otpExpiresAt");

    if (!student) {
      return res.status(404).json({ success: false, data: {}, message: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      data: { student },
      message: "Student shortlist status updated",
    });
  } catch (error) {
    return next(error);
  }
};

const sendNotificationToStudents = async (req, res, next) => {
  try {
    const { title = "Notification", message, studentIds = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, data: {}, message: "Message is required" });
    }

    let targetStudents = [];
    if (studentIds.length > 0) {
      targetStudents = await User.find({ _id: { $in: studentIds }, role: "student" }).select("_id");
    } else {
      targetStudents = await User.find({ role: "student" }).select("_id");
    }

    const payload = targetStudents.map((student) => ({
      user: student._id,
      title,
      message,
      type: "admin",
      metadata: { sentBy: req.user._id },
    }));

    if (payload.length > 0) {
      await Notification.insertMany(payload);
    }

    return res.status(200).json({
      success: true,
      data: { sent: payload.length },
      message: "Notification sent",
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminReports = async (req, res, next) => {
  try {
    const drives = await Drive.find().select("title company deadline status").populate("company", "name");

    const summary = await Application.aggregate([
      {
        $group: {
          _id: "$drive",
          totalApplications: { $sum: 1 },
          shortlisted: {
            $sum: { $cond: [{ $eq: ["$status", "shortlisted"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          selected: {
            $sum: { $cond: [{ $eq: ["$status", "selected"] }, 1, 0] },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: { drives, summary },
      message: "Admin reports fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const getAttendanceByDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;

    const drive = await Drive.findById(driveId).populate("attendance.student", "name email college");
    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    return res.status(200).json({
      success: true,
      data: { attendance: drive.attendance },
      message: "Attendance fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const markAttendanceByDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { attendance = [] } = req.body;

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ success: false, data: {}, message: "Attendance array is required" });
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    const attendanceMap = new Map();
    drive.attendance.forEach((item) => {
      attendanceMap.set(String(item.student), item);
    });

    attendance.forEach((entry) => {
      const studentId = String(entry.studentId);
      const status = entry.status === "present" ? "present" : "absent";

      if (attendanceMap.has(studentId)) {
        const existing = attendanceMap.get(studentId);
        existing.status = status;
        existing.markedAt = new Date();
      } else {
        drive.attendance.push({ student: studentId, status, markedAt: new Date() });
      }
    });

    await drive.save();

    return res.status(200).json({
      success: true,
      data: { attendance: drive.attendance },
      message: "Attendance marked",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllStudents,
  shortlistStudent,
  sendNotificationToStudents,
  getAdminReports,
  getAttendanceByDrive,
  markAttendanceByDrive,
};
