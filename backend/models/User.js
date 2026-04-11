const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["student", "admin", "company"], default: "student" },
    college: { type: String, trim: true, default: "" },
    CGPA: { type: Number, min: 0, max: 10, default: 0 },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    shortlisted: { type: Boolean, default: false },
    otp: { type: String, select: false, default: null },
    otpExpiresAt: { type: Date, select: false, default: null },
    otpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
