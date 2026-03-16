import Patient from "../models/patient.model.js";

// ===============================
// GET /patients
// ===============================
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.status(200).json(patients);

  } catch (err) {
    console.error("Get patients error:", err);

    res.status(500).json({
      message: "Failed to fetch patients",
    });
  }
};

// ===============================
// POST /patients
// ===============================
export const addPatient = async (req, res) => {
  try {
    console.log("POST /patients - Request Body:", JSON.stringify(req.body, null, 2));
    const {
      fullName,
      email,
      phone,
    } = req.body;

    // ✅ Basic validation
    if (!fullName || !phone) {
      return res.status(400).json({
        message: "Full name and phone are required",
      });
    }

    // ✅ Check duplicate patient (only if email is provided)
    if (email) {
      const existing = await Patient.findOne({ email });
      if (existing) {
        return res.status(409).json({
          message: "Patient with this email already exists",
        });
      }
    }

    console.log("Attempting Patient.create with body...");
    const newPatient = await Patient.create(req.body);
    console.log("Patient created successfully:", newPatient._id);

    res.status(201).json(newPatient);

  } catch (err) {
    console.error("Add patient error:", err);

    res.status(500).json({
      message: "Failed to add patient",
    });
  }
};

// ===============================
// PUT /patients/:id
// ===============================
export const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json(updatedPatient);

  } catch (err) {
    console.error("Update patient error:", err);

    res.status(500).json({
      message: "Failed to update patient",
    });
  }
};

// ===============================
// DELETE /patients/:id
// ===============================
export const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
    });

  } catch (err) {
    console.error("Delete patient error:", err);

    res.status(500).json({
      message: "Failed to delete patient",
    });
  }
};