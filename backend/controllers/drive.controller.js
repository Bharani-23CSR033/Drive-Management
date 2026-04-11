const Drive = require("../models/Drive");

const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const buildDriveFilter = (query) => {
  const filter = {};

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  if (query.salary) {
    filter.salary = { $gte: Number(query.salary) };
  }

  if (query.eligibility) {
    filter["eligibility.skills"] = { $elemMatch: { $regex: query.eligibility, $options: "i" } };
  }

  if (query.deadline) {
    filter.deadline = { $lte: new Date(query.deadline) };
  }

  return filter;
};

const getAllDrives = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildDriveFilter(req.query);

    const [drives, total] = await Promise.all([
      Drive.find(filter)
        .populate("company", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Drive.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        drives,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      message: "Drives fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const getDriveById = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id).populate("company", "name email");

    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    return res.status(200).json({
      success: true,
      data: { drive },
      message: "Drive details fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const createDrive = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      company: req.user._id,
    };

    if (typeof req.body.selectionProcess === "string") {
      payload.selectionProcess = req.body.selectionProcess
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    const drive = await Drive.create(payload);

    return res.status(201).json({
      success: true,
      data: { drive },
      message: "Drive created",
    });
  } catch (error) {
    return next(error);
  }
};

const updateDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    if (req.user.role === "company" && String(drive.company) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed for this drive" });
    }

    Object.assign(drive, req.body);
    await drive.save();

    return res.status(200).json({
      success: true,
      data: { drive },
      message: "Drive updated",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ success: false, data: {}, message: "Drive not found" });
    }

    if (req.user.role === "company" && String(drive.company) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed for this drive" });
    }

    await drive.deleteOne();

    return res.status(200).json({
      success: true,
      data: {},
      message: "Drive deleted",
    });
  } catch (error) {
    return next(error);
  }
};

const getCalendarEvents = async (req, res, next) => {
  try {
    const drives = await Drive.find({ status: { $ne: "draft" } })
      .select("title deadline location status")
      .sort({ deadline: 1 });

    const events = drives.map((drive) => ({
      id: drive._id,
      title: drive.title,
      date: drive.deadline,
      location: drive.location,
      status: drive.status,
    }));

    return res.status(200).json({
      success: true,
      data: { events },
      message: "Calendar events fetched",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  getCalendarEvents,
};
