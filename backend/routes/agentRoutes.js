import express from "express";

import {
  runAgent,
  getAgents,
  analyzeStudentDashboard,
} from "../services/agentService.js";

const router = express.Router();

/* =========================
   GET AVAILABLE AGENTS
========================= */

router.get("/", (req, res) => {
  try {
    const agents = getAgents();

    res.json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (err) {
    console.error(
      "❌ Agent List Error:",
      err.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to load agents",
    });
  }
});

/* =========================
   RUN AGENTIC AI
========================= */

router.post("/run", async (req, res) => {
  try {
    const {
      message,
      agent,
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result = await runAgent(
      message,
      agent
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(
      "❌ Agentic AI Error:",
      err.message
    );

    res.status(500).json({
      success: false,
      message: "Agentic AI error occurred",
      error: err.message,
    });
  }
});

/* =========================
   STUDENT DASHBOARD ANALYSIS
========================= */

router.post(
  "/student-analysis",
  async (req, res) => {
    try {
      const studentData = req.body;

      const result =
        await analyzeStudentDashboard(
          studentData
        );

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error(
        "❌ Student Analysis Error:",
        err.message
      );

      res.status(500).json({
        success: false,
        message:
          "Student dashboard analysis failed",
        error: err.message,
      });
    }
  }
);

export default router;