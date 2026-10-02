import AISuggestion from "../models/AISuggestion.js";
import { generateSuggestion } from "../utils/aiService.js";

export const getAISuggestion = async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // 1. Get AI response
    const aiResponse = await generateSuggestion(prompt);

    // 2. Save to DB
    const saved = await AISuggestion.create({
      userId: userId || "guest",
      prompt,
      response: aiResponse,
      tags: ["roadmap", "ai-learning"],
    });

    res.json({
      success: true,
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// history
export const getHistory = async (req, res) => {
  const data = await AISuggestion.find().sort({ createdAt: -1 });
  res.json(data);
};