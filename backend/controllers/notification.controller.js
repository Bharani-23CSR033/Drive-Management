const Notification = require("../models/Notification");

const getNotificationsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (String(req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed" });
    }

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { notifications },
      message: "Notifications fetched",
    });
  } catch (error) {
    return next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, data: {}, message: "Notification not found" });
    }

    if (String(notification.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, data: {}, message: "Not allowed" });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      data: { notification },
      message: "Notification marked as read",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotificationsByUser,
  markNotificationRead,
};
