import express from "express";
import {
  getAppointments,
  addAppointment,
  updateAppointment,
} from "../controllers/appointment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getAppointments);
router.post("/", addAppointment);
router.put("/:id", updateAppointment);

export default router;