const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    drive: { type: mongoose.Schema.Types.ObjectId, ref: "Drive", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
