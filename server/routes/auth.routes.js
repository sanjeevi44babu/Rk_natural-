import express from "express";
import { signup, login, getUsers, updateUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", protect, getUsers);
router.put("/users/:id", protect, updateUser);

export default router;