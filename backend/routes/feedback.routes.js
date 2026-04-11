const express = require("express");
const { submitFeedback, getFeedbackByDrive } = require("../controllers/feedback.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("student"), submitFeedback);
router.get("/:driveId", authMiddleware, authorizeRoles("admin"), getFeedbackByDrive);

module.exports = router;
