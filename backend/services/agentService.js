import OpenAI from "openai";

/* =========================
   AGENT CONFIGURATION
========================= */

const agents = {
  academicRisk: {
    name: "Academic Risk Agent",
    icon: "🎯",
    description:
      "Analyzes student performance and identifies academic risks.",
  },

  studyPlanner: {
    name: "Study Planner Agent",
    icon: "📚",
    description:
      "Creates personalized study plans and exam preparation strategies.",
  },

  career: {
    name: "Career Agent",
    icon: "💼",
    description:
      "Provides career, placement, resume and interview guidance.",
  },

  focus: {
    name: "Focus Agent",
    icon: "🧠",
    description:
      "Helps students improve concentration and productivity.",
  },

  placement: {
    name: "Placement Agent",
    icon: "🏆",
    description:
      "Analyzes placement readiness and recommends preparation.",
  },
};

/* =========================
   AGENT DETECTION
========================= */

const detectAgent = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("risk") ||
    text.includes("marks") ||
    text.includes("attendance") ||
    text.includes("academic") ||
    text.includes("weak subject") ||
    text.includes("performance")
  ) {
    return "academicRisk";
  }

  if (
    text.includes("study") ||
    text.includes("exam") ||
    text.includes("revision") ||
    text.includes("learn") ||
    text.includes("timetable") ||
    text.includes("schedule")
  ) {
    return "studyPlanner";
  }

  if (
    text.includes("career") ||
    text.includes("job") ||
    text.includes("resume") ||
    text.includes("career path")
  ) {
    return "career";
  }

  if (
    text.includes("focus") ||
    text.includes("concentration") ||
    text.includes("productivity") ||
    text.includes("distracted") ||
    text.includes("pomodoro")
  ) {
    return "focus";
  }

  if (
    text.includes("placement") ||
    text.includes("interview") ||
    text.includes("company") ||
    text.includes("aptitude")
  ) {
    return "placement";
  }

  return "career";
};

/* =========================
   DEMO AGENT RESPONSES
   WORKS WITHOUT OPENAI API
========================= */

const generateDemoResponse = (agentKey, message) => {
  const text = message.toLowerCase();

  switch (agentKey) {
    case "academicRisk":

      return `
Risk Level: ${
        text.includes("attendance") ||
        text.includes("fail") ||
        text.includes("weak")
          ? "HIGH"
          : "MEDIUM"
      }

Main Problem:
The student may be facing academic performance or attendance difficulties.

Reason:
The provided student request indicates a possible academic concern that requires attention.

Recommended Action:
• Identify weak subjects.
• Improve attendance regularly.
• Follow a daily study schedule.
• Revise important topics every day.
• Meet a mentor if the problem continues.

AI Recommendation:
The student should focus on weak areas and maintain consistent academic progress.
`;

    case "studyPlanner":

      return `
Study Goal:
Improve academic preparation and complete important topics on time.

Recommended Schedule:
• Morning: Revise previous topics.
• Afternoon: Study one difficult subject.
• Evening: Practice questions.
• Night: Quick revision.

Priority Topics:
1. Weak subjects
2. Important exam topics
3. Previous question papers
4. Revision

Study Strategy:
Use focused study sessions of 45–60 minutes followed by short breaks.

Recommended Action:
Start with the most difficult subject and maintain a daily revision routine.
`;

    case "career":

      return `
Career Assessment:
The student should focus on building technical skills along with communication skills.

Skills to Improve:
• Programming
• Problem solving
• Communication
• Resume preparation
• Interview skills

Recommended Activities:
• Build practical projects.
• Practice coding regularly.
• Improve LinkedIn and resume.
• Attend mock interviews.

Career Action Plan:
Choose a target career role and build the required skills step by step.
`;

    case "focus":

      return `
Focus Problem:
The student may be experiencing difficulty maintaining concentration.

Possible Reason:
Distractions, poor time management or inconsistent study habits may affect productivity.

Recommended Technique:
• Use the Pomodoro technique.
• Keep the phone away while studying.
• Study in a quiet environment.
• Set one task at a time.

Daily Action:
Complete at least two focused study sessions every day.

AI Recommendation:
Start with short focused sessions and gradually increase study time.
`;

    case "placement":

      return `
Placement Readiness:
The student should continuously improve technical and interview preparation.

Strengths:
• Ability to learn new skills.
• Opportunity to practice technical concepts.

Weak Areas:
• Aptitude
• Coding
• Communication
• Interview confidence

Recommended Preparation:
• Practice aptitude questions.
• Solve coding problems.
• Prepare common interview questions.
• Build projects.
• Improve resume.

Placement Action Plan:
Practice technical skills daily and attend mock interviews regularly.
`;

    default:
      return `
EduCore AI Agent Analysis

Your request has been analyzed successfully.

Recommendation:
Create a clear goal, follow a structured plan and review your progress regularly.
`;
  }
};

/* =========================
   RUN AGENT
========================= */

export const runAgent = async (
  message,
  requestedAgent = null
) => {
  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  const agentKey =
    requestedAgent && agents[requestedAgent]
      ? requestedAgent
      : detectAgent(message);

  const agent = agents[agentKey];

  console.log(`🤖 Agent Selected: ${agent.name}`);

  /*
   * If a real OpenAI key is available,
   * use OpenAI.
   *
   * If no key is available,
   * automatically use Demo Agent.
   */

  if (
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your_real_key_here" &&
    process.env.OPENAI_API_KEY !== "YOUR_ACTUAL_OPENAI_API_KEY"
  ) {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response =
        await client.chat.completions.create({
          model:
            process.env.AI_MODEL || "gpt-4o-mini",

          messages: [
            {
              role: "system",
              content: `
You are the ${agent.name} of EduCore AI.

${agent.description}

Give clear, practical and student-friendly recommendations.
Do not invent information.
`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        });

      const reply =
        response.choices[0]?.message?.content || "";

      return {
        agent: agentKey,
        agentName: agent.name,
        icon: agent.icon,
        description: agent.description,
        reply,
      };
    } catch (error) {
      console.log(
        "⚠️ OpenAI unavailable. Using Demo Agent."
      );
    }
  }

  /* =========================
     DEMO MODE
  ========================= */

  const reply = generateDemoResponse(
    agentKey,
    message
  );

  return {
    agent: agentKey,
    agentName: agent.name,
    icon: agent.icon,
    description: agent.description,
    reply,
  };
};

/* =========================
   GET AGENTS
========================= */

export const getAgents = () => {
  return Object.entries(agents).map(
    ([id, agent]) => ({
      id,
      name: agent.name,
      icon: agent.icon,
      description: agent.description,
    })
  );
};

/* =========================
   STUDENT DASHBOARD ANALYSIS
========================= */

export const analyzeStudentDashboard = async (
  studentData
) => {
  const {
    name,
    academicScore,
    attendance,
    emotion,
    behavior,
    personality,
    notes,
    riskScore,
  } = studentData;

  let risk = Number(riskScore) || 0;

  if (Number(attendance) < 75) {
    risk += 20;
  }

  if (Number(academicScore) < 60) {
    risk += 20;
  }

  if (emotion === "Stressed") {
    risk += 20;
  }

  if (emotion === "Confused") {
    risk += 15;
  }

  risk = Math.min(risk, 100);

  let riskLevel = "LOW";

  if (risk >= 60) {
    riskLevel = "HIGH";
  } else if (risk >= 30) {
    riskLevel = "MEDIUM";
  }

  const analysis = `
Overall Risk Level: ${riskLevel}

Academic Performance:
${
  academicScore
    ? `The student's academic score is ${academicScore}%.`
    : "Academic score was not provided."
}

Attendance:
${
  attendance
    ? `The student's attendance is ${attendance}%.`
    : "Attendance information was not provided."
}

Emotional Analysis:
${
  emotion
    ? `Current emotion recorded: ${emotion}.`
    : "Emotion information was not provided."
}

Behavior Analysis:
${
  behavior
    ? behavior
    : "Behavior information was not provided."
}

Main Academic Problems:
Focus on weak subjects, attendance and consistent study habits.

Recommended Study Strategy:
Create a daily study schedule and give additional time to difficult subjects.

Immediate Action Plan:
1. Identify weak subjects.
2. Improve attendance.
3. Complete pending academic work.
4. Revise important topics regularly.

Long-term Recommendation:
Maintain consistent study habits and regularly review academic progress with a mentor.

AI Notes:
${notes || "No additional notes provided."}
`;

  return {
    studentName: name || "Student",
    riskScore: risk,
    analysis,
  };
};