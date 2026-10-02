import express from "express";

const router = express.Router();

const chatDB = new Map();

// CHAT WITH AI
router.post("/", async (req, res) => {
  try {
    const { userId = "default", message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    if (!chatDB.has(userId)) chatDB.set(userId, []);

    const history = chatDB.get(userId);

    const userMsg = { role: "user", message };

    const aiMsg = {
      role: "assistant",
      message: `AI Suggestion: Focus on ${message} and build projects.`,
    };

    history.push(userMsg);
    history.push(aiMsg);

    res.json({
      success: true,
      reply: aiMsg,
      history,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET CHAT HISTORY
router.get("/:userId", (req, res) => {
  const history = chatDB.get(req.params.userId) || [];

  res.json({
    success: true,
    history,
  });
});

export default router;