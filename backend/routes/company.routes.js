const express = require("express");
const {
  registerCompany,
  loginCompany,
  getCompanyDrives,
  getCompanyApplicants,
  updateCompanyApplicantStatus,
} = require("../controllers/company.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/drives", authMiddleware, authorizeRoles("company"), getCompanyDrives);
router.get("/applicants/:driveId", authMiddleware, authorizeRoles("company"), getCompanyApplicants);
router.put("/applicants/:id", authMiddleware, authorizeRoles("company"), updateCompanyApplicantStatus);

module.exports = router;
