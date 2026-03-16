import Appointment from "../models/Appointment.model.js";

/**
 * @desc    Get all appointments
 * @route   GET /api/appointments
 * @access  Protected
 */
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

/**
 * @desc    Update appointment
 * @route   PUT /api/appointments/:id
 * @access  Protected
 */
export const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

/**
 * @desc    Add new appointment
 * @route   POST /api/appointments
 * @access  Protected
 */
export const addAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};