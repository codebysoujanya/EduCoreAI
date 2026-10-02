import Assessment from "../models/Assessment.js";

// CREATE ASSESSMENT
export const createAssessment = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!userId || !answers) {
      return res.status(400).json({ message: "Missing data" });
    }

    // Simple AI scoring logic
    let score = 0;

    answers.forEach((ans) => {
      if (ans.correct === true) score += 10;
      if (ans.skipped === true) score -= 2;
    });

    const finalScore = Math.max(0, score);

    let level = "Beginner";
    if (finalScore > 70) level = "Advanced";
    else if (finalScore > 40) level = "Intermediate";

    const assessment = await Assessment.create({
      userId,
      answers,
      score: finalScore,
      level,
      recommendation:
        level === "Advanced"
          ? "Focus on projects & internships"
          : level === "Intermediate"
          ? "Improve problem solving"
          : "Strengthen fundamentals",
    });

    res.json({
      success: true,
      assessment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET HISTORY
export const getAssessments = async (req, res) => {
  try {
    const data = await Assessment.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};