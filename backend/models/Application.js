const mongoose = require("mongoose");

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

applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
