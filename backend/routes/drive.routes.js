const express = require("express");
const {
  getApplicantsByDrive,
} = require("../controllers/application.controller");
const {
  getAllDrives,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
} = require("../controllers/drive.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", getAllDrives);
router.get("/:driveId/applicants", authMiddleware, authorizeRoles("admin", "company"), getApplicantsByDrive);
router.get("/:id", getDriveById);
router.post("/", authMiddleware, authorizeRoles("admin", "company"), createDrive);
router.put("/:id", authMiddleware, authorizeRoles("admin", "company"), updateDrive);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "company"), deleteDrive);

module.exports = router;
