import express from "express";

const router = express.Router();

// DASHBOARD DATA (STATIC FOR NOW)
router.get("/:userId", async (req, res) => {
  try {
    const data = {
      stats: {
        totalStudents: 120,
        activeMentors: 12,
        aiSuggestions: 540,
        riskStudents: 8,
      },

      recentActivities: [
        "Student completed assessment",
        "AI suggestion generated",
        "Mentor assigned to student",
      ],

      performance: {
        avgScore: 67,
        improvementRate: "12%",
      },
    };

    res.json({
      success: true,
      dashboard: data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;