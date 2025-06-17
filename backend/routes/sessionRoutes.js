import express from "express";
import {
  createSession,
  getSessionById,
  getMySessions,
  deleteSession,
} from "../controllers/sessionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
// Public routes
router.post("/create", protect, createSession); // Create a new session
router.get("/my-sessions", protect, getMySessions); // Get all sessions for the logged-in user
router.get("/:id", protect, getSessionById); // Get session by ID
router.delete("/:id", protect, deleteSession); // Delete session by ID

export default router;
