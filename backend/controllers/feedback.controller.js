const Feedback = require("../models/Feedback");
const Application = require("../models/Application");

const submitFeedback = async (req, res, next) => {
  try {
    const { driveId, rating, text } = req.body;

    if (!driveId || !rating) {
      return res.status(400).json({ success: false, data: {}, message: "driveId and rating are required" });
    }

    const application = await Application.findOne({ student: req.user._id, drive: driveId });
    if (!application) {
      return res.status(400).json({ success: false, data: {}, message: "You can only give feedback for applied drives" });
    }

    const feedback = await Feedback.create({
      student: req.user._id,
      drive: driveId,
      rating,
      text,
    });

    return res.status(201).json({
      success: true,
      data: { feedback },
      message: "Feedback submitted",
    });
  } catch (error) {
    return next(error);
  }
};

const getFeedbackByDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;

    const feedback = await Feedback.find({ drive: driveId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { feedback },
      message: "Feedback fetched",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitFeedback,
  getFeedbackByDrive,
};
