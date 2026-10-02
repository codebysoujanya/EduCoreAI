import Student from "../models/Student.js";
import AISuggestion from "../models/AISuggestion.js";
import Assessment from "../models/Assessment.js";

// DASHBOARD SUMMARY API
export const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;

    const student = await Student.findOne({ userId });
    const suggestions = await AISuggestion.find({ userId }).sort({
      createdAt: -1,
    });
    const assessments = await Assessment.find({ userId }).sort({
      createdAt: -1,
    });

    const totalSuggestions = suggestions.length;
    const avgScore =
      assessments.length > 0
        ? assessments.reduce((a, b) => a + b.score, 0) / assessments.length
        : 0;

    const riskLevel =
      student?.riskScore > 70
        ? "High Risk"
        : student?.riskScore > 40
        ? "Medium Risk"
        : "Low Risk";

    res.json({
      success: true,
      data: {
        student,
        stats: {
          totalSuggestions,
          avgScore,
          riskLevel,
        },
        recentSuggestions: suggestions.slice(0, 5),
        recentAssessments: assessments.slice(0, 5),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};