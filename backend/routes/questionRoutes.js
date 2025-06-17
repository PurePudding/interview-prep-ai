import express from "express";
import {
  tooglePinQuestion,
  updateQuestionNote,
  addQuestionsToSession,
} from "../controllers/questionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/pin", protect, tooglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);

export default router;
