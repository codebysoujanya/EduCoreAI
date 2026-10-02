import express from "express";

const router = express.Router();

// CREATE ASSESSMENT
router.post("/", async (req, res) => {
  try {
    const { userId, answers = [] } = req.body;

    let score = 0;

    answers.forEach((a) => {
      if (a.correct) score += 10;
      else score -= 2;
    });

    const result = {
      userId,
      score,
      level:
        score > 70 ? "Advanced" : score > 40 ? "Intermediate" : "Beginner",
      recommendation:
        score > 70
          ? "Focus on projects"
          : "Improve basics and practice more",
    };

    res.json({
      success: true,
      assessment: result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL ASSESSMENTS (mock)
router.get("/:userId", async (req, res) => {
  res.json({
    success: true,
    data: [],
    message: "No DB connected yet (placeholder)",
  });
});

export default router;