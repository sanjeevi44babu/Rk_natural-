import express from "express";
import { getHealthRecords, addHealthRecord } from "../controllers/healthRecord.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getHealthRecords);
router.post("/", addHealthRecord);

export default router;
