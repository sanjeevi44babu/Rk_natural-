import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorName: String,
    physiotherapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    physiotherapistName: String,
    date: {
      type: String,
      required: true,
    },
    bloodPressure: String,
    temperature: Number,
    weight: Number,
    heartRate: Number,
    notes: String,
    diagnosis: String,
    prescription: String,
  },
  { timestamps: true }
);

export default mongoose.model("HealthRecord", healthRecordSchema);
