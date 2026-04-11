const express = require("express");
const {
  applyToDrive,
  getApplicantsByDrive,
  updateApplicationStatus,
} = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("student"), applyToDrive);
router.get("/:driveId", authMiddleware, authorizeRoles("admin", "company"), getApplicantsByDrive);
router.put("/:id/status", authMiddleware, authorizeRoles("admin", "company"), updateApplicationStatus);

module.exports = router;
