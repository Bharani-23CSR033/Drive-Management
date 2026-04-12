const base = process.env.API_BASE_URL || "http://localhost:5000/api";
const runId = Date.now().toString();
const password = "Pass1234!";

async function call(method, path, { token, body, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };

  if (formData) {
    options.body = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${base}${path}`, options);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { ok: response.ok, status: response.status, data };
}

function logResult(name, result, expectedStatuses) {
  const msg = result?.data?.message || "";
  const pass = expectedStatuses.includes(result.status);
  console.log(`${pass ? "PASS" : "FAIL"} | ${name} | ${result.status} | ${msg}`);
  return pass;
}

async function run() {
  let failed = 0;

  const studentEmail = `student${runId}@example.com`;
  const adminEmail = `admin${runId}@example.com`;
  const companyEmail = `company${runId}@example.com`;

  const studentReg = await call("POST", "/auth/register", {
    body: { name: `Student ${runId}`, email: studentEmail, password, role: "student" },
  });
  if (!logResult("auth.register student", studentReg, [201])) failed += 1;

  const adminReg = await call("POST", "/auth/register", {
    body: { name: `Admin ${runId}`, email: adminEmail, password, role: "admin" },
  });
  if (!logResult("auth.register admin", adminReg, [201])) failed += 1;

  const companyReg = await call("POST", "/company/register", {
    body: { name: `Company ${runId}`, email: companyEmail, password },
  });
  if (!logResult("company.register", companyReg, [201])) failed += 1;

  const studentLogin = await call("POST", "/auth/login", { body: { email: studentEmail, password } });
  if (!logResult("auth.login student", studentLogin, [200])) failed += 1;

  const adminLogin = await call("POST", "/auth/login", { body: { email: adminEmail, password } });
  if (!logResult("auth.login admin", adminLogin, [200])) failed += 1;

  const companyLogin = await call("POST", "/company/login", { body: { email: companyEmail, password } });
  if (!logResult("company.login", companyLogin, [200])) failed += 1;

  if (!studentLogin.data?.data?.token || !adminLogin.data?.data?.token || !companyLogin.data?.data?.token) {
    console.error("Missing one or more auth tokens; stopping test early.");
    process.exit(1);
  }

  const studentToken = studentLogin.data.data.token;
  const adminToken = adminLogin.data.data.token;
  const companyToken = companyLogin.data.data.token;
  const studentId = studentLogin.data.data.user._id;

  const createDrive = await call("POST", "/drives", {
    token: companyToken,
    body: {
      title: `Drive ${runId}`,
      salary: 800000,
      location: "Remote",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      description: "Smoke test drive",
      eligibility: { cgpa: 7, skills: ["Node", "React"], batch: "2026" },
      selectionProcess: ["Aptitude", "Interview"],
      status: "open",
    },
  });
  if (!logResult("drives.create", createDrive, [201])) failed += 1;

  const driveId = createDrive.data?.data?.drive?._id;
  if (!driveId) {
    console.error("Drive id missing; stopping test early.");
    process.exit(1);
  }

  const listDrives = await call("GET", "/drives");
  if (!logResult("drives.list", listDrives, [200])) failed += 1;

  const getDrive = await call("GET", `/drives/${driveId}`);
  if (!logResult("drives.getById", getDrive, [200])) failed += 1;

  const updateDrive = await call("PUT", `/drives/${driveId}`, {
    token: companyToken,
    body: { description: "Updated by smoke test", salary: 850000 },
  });
  if (!logResult("drives.update", updateDrive, [200])) failed += 1;

  const studentProfile = await call("GET", `/student/profile/${studentId}`, { token: studentToken });
  if (!logResult("student.profile.get", studentProfile, [200])) failed += 1;

  const studentUpdate = await call("PUT", `/student/profile/${studentId}`, {
    token: studentToken,
    body: { college: "Smoke Test College", skills: ["Node", "MongoDB"], CGPA: 8.5 },
  });
  if (!logResult("student.profile.update", studentUpdate, [200])) failed += 1;

  const resumeForm = new FormData();
  resumeForm.append("resume", new Blob(["resume content"], { type: "application/pdf" }), "resume.pdf");
  const resumeUpload = await call("POST", "/student/resume/upload", { token: studentToken, formData: resumeForm });
  if (!logResult("student.resume.upload", resumeUpload, [200])) failed += 1;

  const apply = await call("POST", "/applications", {
    token: studentToken,
    body: { driveId },
  });
  if (!logResult("applications.apply", apply, [201])) failed += 1;

  const applicationId = apply.data?.data?.application?._id;
  if (!applicationId) {
    console.error("Application id missing; stopping test early.");
    process.exit(1);
  }

  const studentApps = await call("GET", "/student/applications", { token: studentToken });
  if (!logResult("student.applications.list", studentApps, [200])) failed += 1;

  const companyApps = await call("GET", `/applications/${driveId}`, { token: companyToken });
  if (!logResult("applications.byDrive company", companyApps, [200])) failed += 1;

  const appStatus = await call("PUT", `/applications/${applicationId}/status`, {
    token: companyToken,
    body: { status: "shortlisted" },
  });
  if (!logResult("applications.updateStatus", appStatus, [200])) failed += 1;

  const companyDrives = await call("GET", "/company/drives", { token: companyToken });
  if (!logResult("company.drives.list", companyDrives, [200])) failed += 1;

  const companyApplicants = await call("GET", `/company/applicants/${driveId}`, { token: companyToken });
  if (!logResult("company.applicants.list", companyApplicants, [200])) failed += 1;

  const companyApplicantUpdate = await call("PUT", `/company/applicants/${applicationId}`, {
    token: companyToken,
    body: { status: "selected" },
  });
  if (!logResult("company.applicants.update", companyApplicantUpdate, [200])) failed += 1;

  const feedbackCreate = await call("POST", "/feedback", {
    token: studentToken,
    body: { driveId, rating: 5, text: "Great process" },
  });
  if (!logResult("feedback.create", feedbackCreate, [201])) failed += 1;

  const feedbackList = await call("GET", `/feedback/${driveId}`, { token: adminToken });
  if (!logResult("feedback.list", feedbackList, [200])) failed += 1;

  const adminDashboard = await call("GET", "/admin/dashboard", { token: adminToken });
  if (!logResult("admin.dashboard", adminDashboard, [200])) failed += 1;

  const adminStudents = await call("GET", "/admin/students", { token: adminToken });
  if (!logResult("admin.students.list", adminStudents, [200])) failed += 1;

  const shortlist = await call("PUT", `/admin/students/${studentId}/shortlist`, {
    token: adminToken,
    body: { shortlisted: true },
  });
  if (!logResult("admin.students.shortlist", shortlist, [200])) failed += 1;

  const sendNotification = await call("POST", "/admin/notifications/send", {
    token: adminToken,
    body: { title: "Smoke Notice", message: "Hello student", studentIds: [studentId] },
  });
  if (!logResult("admin.notifications.send", sendNotification, [200])) failed += 1;

  const adminReports = await call("GET", "/admin/reports", { token: adminToken });
  if (!logResult("admin.reports", adminReports, [200])) failed += 1;

  const attendanceGet = await call("GET", `/admin/attendance/${driveId}`, { token: adminToken });
  if (!logResult("admin.attendance.get", attendanceGet, [200])) failed += 1;

  const attendanceMark = await call("POST", `/admin/attendance/${driveId}`, {
    token: adminToken,
    body: { attendance: [{ studentId, status: "present" }] },
  });
  if (!logResult("admin.attendance.mark", attendanceMark, [200])) failed += 1;

  const studentNotifications = await call("GET", "/student/notifications", { token: studentToken });
  if (!logResult("student.notifications.list", studentNotifications, [200])) failed += 1;

  const notificationId = studentNotifications.data?.data?.notifications?.[0]?._id;
  if (notificationId) {
    const markRead = await call("PUT", `/notifications/${notificationId}/read`, { token: studentToken });
    if (!logResult("notifications.markRead", markRead, [200])) failed += 1;
  } else {
    console.log("FAIL | notifications.markRead | skipped | no notification returned");
    failed += 1;
  }

  const notificationsByUser = await call("GET", `/notifications/${studentId}`, { token: studentToken });
  if (!logResult("notifications.byUser", notificationsByUser, [200])) failed += 1;

  const calendarEvents = await call("GET", "/calendar/events");
  if (!logResult("calendar.events", calendarEvents, [200])) failed += 1;

  const deleteDrive = await call("DELETE", `/drives/${driveId}`, { token: companyToken });
  if (!logResult("drives.delete", deleteDrive, [200])) failed += 1;

  const getDeleted = await call("GET", `/drives/${driveId}`);
  if (!logResult("drives.getDeleted", getDeleted, [404])) failed += 1;

  if (failed > 0) {
    console.error(`\nSmoke test finished with ${failed} failing checks.`);
    process.exit(1);
  }

  console.log("\nSmoke test finished successfully with zero failures.");
}

run().catch((error) => {
  console.error("Smoke test crashed:", error.message);
  process.exit(1);
});
