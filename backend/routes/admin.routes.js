const express = require("express");
const {
  getAdminDashboard,
  getAllStudents,
  shortlistStudent,
  sendNotificationToStudents,
  getAdminReports,
  getAttendanceByDrive,
  markAttendanceByDrive,
} = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.use(authMiddleware, authorizeRoles("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/students", getAllStudents);
router.put("/students/:id/shortlist", shortlistStudent);
router.post("/notifications/send", sendNotificationToStudents);
router.get("/reports", getAdminReports);
router.get("/attendance/:driveId", getAttendanceByDrive);
router.post("/attendance/:driveId", markAttendanceByDrive);

module.exports = router;
