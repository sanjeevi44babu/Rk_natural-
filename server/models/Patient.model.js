import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, sparse: true },
    phone: { type: String, required: true },
    age: Number,
    gender: String,
    address: String,
    bloodType: String,
    diagnosis: String,
    medicalHistory: String,
    weight: Number,
    height: Number,
    bloodPressure: String,
    temperature: Number,
    allergies: String,
    emergencyContact: String,
    emergencyPhone: String,
    occupation: String,
    maritalStatus: String,
    insuranceId: String,
    assignedDoctorId: String,
    assignedDoctorName: String,
    status: { type: String, default: 'outpatient' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);


export default mongoose.model("Patient", patientSchema);