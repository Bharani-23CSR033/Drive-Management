const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    salary: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    eligibility: {
      cgpa: { type: Number, min: 0, max: 10, default: 0 },
      skills: { type: [String], default: [] },
      batch: { type: String, default: "" },
    },
    deadline: { type: Date, required: true },
    description: { type: String, default: "" },
    selectionProcess: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "open", "closed"], default: "open" },
    attendance: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["present", "absent"], required: true },
        markedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drive", driveSchema);
