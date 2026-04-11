const express = require("express");
const {
  getNotificationsByUser,
  markNotificationRead,
} = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/:userId", authMiddleware, getNotificationsByUser);
router.put("/:id/read", authMiddleware, markNotificationRead);

module.exports = router;
