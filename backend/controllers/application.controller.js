const Application = require("../models/Application");
const Drive = require("../models/Drive");

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const applyToDrive = async (req, res, next) => {
  try {
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({ success: false, data: {}, message: "driveId is required" });
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    if (drive.status !== "open" || new Date(drive.deadline) < new Date()) {
      return res.status(400).json({ success: false, data: {}, message: "Drive is not accepting applications" });
    }

    const exists = await Application.findOne({ student: req.user._id, drive: driveId });
    if (exists) {
      return res.status(409).json({ success: false, data: {}, message: "Already applied to this drive" });
    }

    const application = await Application.create({
      student: req.user._id,
      drive: driveId,
      status: "applied",
      updatedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: { application },
      message: "Application submitted",
    });
  } catch (error) {
    return next(error);
  }
};

const getApplicantsByDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { page, limit, skip } = getPagination(req.query);

    const drive = await Drive.findById(driveId).select("company");
    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    if (req.user.role === "company" && String(drive.company) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed for this drive" });
    }

    const [applications, total] = await Promise.all([
      Application.find({ drive: driveId })
        .populate("student", "name email college CGPA skills resumeUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ drive: driveId }),
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
      message: "Drive applicants fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["shortlisted", "rejected", "selected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, data: {}, message: "Invalid status" });
    }

    const application = await Application.findById(id).populate("drive", "company");
    if (!application) {
      return res.status(404).json({ success: false, data: {}, message: "Application not found" });
    }

    if (req.user.role === "company" && String(application.drive.company) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed for this application" });
    }

    application.status = status;
    application.updatedBy = req.user._id;
    await application.save();

    return res.status(200).json({
      success: true,
      data: { application },
      message: "Application status updated",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  applyToDrive,
  getApplicantsByDrive,
  updateApplicationStatus,
};
