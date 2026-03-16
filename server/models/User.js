import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: {
      type: String,
      enum: ["patient", "doctor", "admin", "supervisor", "physiotherapist"],
      default: "patient",
    },
    isApproved: { type: Boolean, default: false },
    specialization: String,
    dateOfBirth: Date,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);