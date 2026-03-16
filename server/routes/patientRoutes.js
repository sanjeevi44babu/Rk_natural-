import express from "express";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.use(protect);
router.get("/", getPatients);
router.post("/", addPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;