const bcrypt = require("bcrypt");
const User = require("../models/User");
const Drive = require("../models/Drive");
const Application = require("../models/Application");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const registerCompany = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, data: {}, message: "All fields are required" });
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
      role: "company",
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: { token, user: sanitizeUser(user) },
      message: "Company registration successful",
    });
  } catch (error) {
    return next(error);
  }
};

const loginCompany = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, data: {}, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: "company" }).select("+password");
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
      message: "Company login successful",
    });
  } catch (error) {
    return next(error);
  }
};

const getCompanyDrives = async (req, res, next) => {
  try {
    const drives = await Drive.find({ company: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { drives },
      message: "Company drives fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const getCompanyApplicants = async (req, res, next) => {
  try {
    const { driveId } = req.params;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    if (String(drive.company) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed for this drive" });
    }

    const applications = await Application.find({ drive: driveId })
      .populate("student", "name email college CGPA skills resumeUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { applications },
      message: "Applicants fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const updateCompanyApplicantStatus = async (req, res, next) => {
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

    if (String(application.drive.company) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed for this application" });
    }

    application.status = status;
    application.updatedBy = req.user._id;
    await application.save();

    return res.status(200).json({
      success: true,
      data: { application },
      message: "Applicant status updated",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  getCompanyDrives,
  getCompanyApplicants,
  updateCompanyApplicantStatus,
};
