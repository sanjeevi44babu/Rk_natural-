import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String },
    patientAge: { type: Number },
    patientGender: { type: String },
    physiotherapistId: { type: String },
    physiotherapistName: { type: String },
    doctorId: { type: String },
    doctorName: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number },
    status: {
      type: String,
      enum: ["upcoming", "in-progress", "completed", "cancelled"],
      default: "upcoming",
    },
    type: { type: String },
    roomNumber: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);