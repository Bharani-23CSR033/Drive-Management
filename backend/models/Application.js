const mongoose = require("mongoose");
const addJsonTransform = require("../utils/addJsonTransform");

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    drive: { type: mongoose.Schema.Types.ObjectId, ref: "Drive", required: true },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "selected"],
      default: "applied",
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

addJsonTransform(applicationSchema, (ret) => {
  const statusMap = {
    applied: "Applied",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    selected: "Selected",
  };

  ret.driveId = ret.drive?.id || ret.drive?._id?.toString?.() || ret.drive;
  ret.studentId = ret.student?.id || ret.student?._id?.toString?.() || ret.student;
  ret.status = statusMap[ret.status] || ret.status;
});

applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
