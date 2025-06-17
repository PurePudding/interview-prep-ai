import Session from "../models/Session.js";
import Question from "../models/Question.js";

// @desc    Add aditional questions to an existing session
// @route   POST /api/questions/add
// @access  Private
export const addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Create new questions
    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    // Tambahkan ke session yang ada
    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(200).json({ success: true, questions: createdQuestions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Pin or unpin questions
// @route   POST /api/questions/:id/pin
// @access  Private
export const tooglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res
        .status(404)
        .json({ sucess: false, message: "Question not found" });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({ sucess: true, message: question });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update question note
// @route   POST /api/questions/:id/note
// @access  Private
export const updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ sucess: false, message: "Question not found" });
    }

    question.note = note || "";
    await question.save(res.status(200).json({ sucessful: true, question }));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
