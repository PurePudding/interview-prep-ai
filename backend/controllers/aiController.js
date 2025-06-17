import { GoogleGenerativeAI } from "@google/generative-ai";
import { conceptExplainPrompt } from "../utils/prompts.js";
import { questionAnswerPrompt } from "../utils/prompts.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug environment variables
console.log("Environment check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length || 0);

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  console.error("Please check your .env file in the root directory");
  process.exit(1);
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc Generate interview questions and answers using Gemini
// @route POST /api/ai/generate-questions
// @access Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();

    // Debug: Log the raw response
    console.log("Raw API response:", rawText);

    // More robust cleaning
    const cleanedText = rawText
      .replace(/^```(json)?/gm, "") // remove starting ```json or ```
      .replace(/```$/gm, "") // remove ending ```
      .trim();

    try {
      // Parse the cleaned JSON
      const data = JSON.parse(cleanedText);

      // Send successful response
      res.status(200).json(data);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Cleaned text that failed to parse:", cleanedText);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({
      message: "Failed to generate interview questions",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
// @desc Generate explanation for an interview question
// @route POST /api/ai/generate-explanation
// @access Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(question);

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();

    // Clean it: remove ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse the cleaned JSON
    const data = JSON.parse(cleanedText);

    // Send successful response
    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};
