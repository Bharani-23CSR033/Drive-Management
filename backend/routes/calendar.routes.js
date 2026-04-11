const express = require("express");
const { getCalendarEvents } = require("../controllers/drive.controller");

const router = express.Router();

router.get("/events", getCalendarEvents);

module.exports = router;
