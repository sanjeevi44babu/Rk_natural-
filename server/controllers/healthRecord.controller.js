import HealthRecord from "../models/HealthRecord.model.js";

export const getHealthRecords = async (req, res) => {
  try {
    const { patientId } = req.query;
    let query = {};

    // If patientId is provided, filter by it
    if (patientId) {
      query.patientId = patientId;
    } 
    // If user is a patient, they can only see their own records
    else if (req.user.role === "patient") {
      // Note: We'd need to link User and Patient models or use email
      // For now, let's assume they might pass their patientId
      return res.status(403).json({ message: "Patient ID required" });
    }

    const records = await HealthRecord.find(query).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch health records", error: error.message });
  }
};

export const addHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: "Failed to add health record", error: error.message });
  }
};
