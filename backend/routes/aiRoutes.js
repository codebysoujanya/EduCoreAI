import express from "express";
import OpenAI from "openai";

const router = express.Router();

/* =========================
   AGENTIC AI AGENT DETECTION
========================= */

const detectAgent = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("risk") ||
    text.includes("marks") ||
    text.includes("attendance") ||
    text.includes("academic")
  ) {
    return "Academic Risk Agent";
  }

  if (
    text.includes("study") ||
    text.includes("exam") ||
    text.includes("revision") ||
    text.includes("learn")
  ) {
    return "Study Planner Agent";
  }

  if (
    text.includes("career") ||
    text.includes("job") ||
    text.includes("placement") ||
    text.includes("resume")
  ) {
    return "Career Agent";
  }

  if (
    text.includes("focus") ||
    text.includes("productivity") ||
    text.includes("concentration")
  ) {
    return "Focus Agent";
  }

  return "Personal Mentor";
};


/* =========================
   AGENT SYSTEM PROMPTS
========================= */

const getAgentPrompt = (agent) => {
  switch (agent) {
    case "Academic Risk Agent":
      return `
You are the Academic Risk Agent of EduCore AI.

Your job is to analyze student academic performance,
marks, attendance, weak subjects and academic difficulties.

Give practical suggestions to reduce academic risk.
Keep your response clear and student-friendly.
`;

    case "Study Planner Agent":
      return `
You are the Study Planner Agent of EduCore AI.

Your job is to create effective study plans,
revision schedules, exam preparation strategies
and learning routines for students.

Give practical and easy-to-follow steps.
`;

    case "Career Agent":
      return `
You are the Career Agent of EduCore AI.

Your job is to help students with career planning,
placement preparation, technical skills, resumes,
interviews and job preparation.

Give practical career guidance.
`;

    case "Focus Agent":
      return `
You are the Focus Agent of EduCore AI.

Your job is to help students improve concentration,
productivity, time management and study habits.

Give simple practical techniques.
`;

    default:
      return `
You are the Personal Mentor Agent of EduCore AI.

You are a helpful student mentor AI.
Support students with academics, learning,
career, productivity and personal development.

Give clear, supportive and practical guidance.
`;
  }
};


/* =========================
   CHAT ROUTE
========================= */

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        success: false,
        reply: "AI key missing. Please set OPENAI_API_KEY in .env",
      });
    }

    /* =========================
       SELECT AGENT
    ========================= */

    const agent = detectAgent(message);

    console.log(`🤖 Agent Selected: ${agent}`);

    /* =========================
       OPENAI CLIENT
    ========================= */

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    /* =========================
       AGENTIC AI RESPONSE
    ========================= */

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: getAgentPrompt(agent),
        },

        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      success: true,
      agent: agent,
      reply: response.choices[0].message.content,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      reply: "AI error occurred",
    });
  }
});


export default router;