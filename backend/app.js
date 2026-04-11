const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const driveRoutes = require("./routes/drive.routes");
const applicationRoutes = require("./routes/application.routes");
const adminRoutes = require("./routes/admin.routes");
const companyRoutes = require("./routes/company.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const notificationRoutes = require("./routes/notification.routes");
const calendarRoutes = require("./routes/calendar.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    data: {},
    message: "API is working",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/calendar", calendarRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
