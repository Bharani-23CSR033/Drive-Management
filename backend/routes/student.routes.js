const express = require("express");
const multer = require("multer");
const {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  getStudentDashboard,
  getStudentApplications,
  getStudentNotifications,
} = require("../controllers/student.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/profile/:id", authMiddleware, authorizeRoles("student", "admin"), getStudentProfile);
router.put("/profile/:id", authMiddleware, authorizeRoles("student", "admin"), updateStudentProfile);
router.post("/resume/upload", authMiddleware, authorizeRoles("student"), upload.single("resume"), uploadResume);
router.get("/dashboard", authMiddleware, authorizeRoles("student"), getStudentDashboard);
router.get("/applications", authMiddleware, authorizeRoles("student"), getStudentApplications);
router.get("/notifications", authMiddleware, authorizeRoles("student"), getStudentNotifications);

module.exports = router;
