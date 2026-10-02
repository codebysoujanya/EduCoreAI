import { useState } from "react";
import "./Student.css";

const calculateRisk = (data) => {
  let score = 0;

  if (data.emotion === "Stressed") {
    score += 30;
  }

  if (data.emotion === "Confused") {
    score += 25;
  }

  if (data.attendance && Number(data.attendance) < 75) {
    score += 30;
  } else if (
    data.attendance &&
    Number(data.attendance) < 85
  ) {
    score += 15;
  }

  if (
    data.academicScore &&
    Number(data.academicScore) < 60
  ) {
    score += 20;
  } else if (
    data.academicScore &&
    Number(data.academicScore) < 75
  ) {
    score += 10;
  }

  return Math.min(score, 100);
};

const getRiskInfo = (risk) => {
  if (risk >= 70) {
    return {
      level: "High Risk",
      icon: "🔴",
      className: "high",
      description:
        "Immediate academic attention is recommended.",
    };
  }

  if (risk >= 40) {
    return {
      level: "Moderate Risk",
      icon: "🟡",
      className: "moderate",
      description:
        "Some areas of your academic performance need improvement.",
    };
  }

  return {
    level: "Low Risk",
    icon: "🟢",
    className: "low",
    description:
      "Your current academic condition looks stable.",
  };
};

const getAgentInfo = (analysis) => {
  const text = `${analysis?.agentName || ""} ${
    analysis?.analysis || ""
  } ${analysis?.reply || ""}`.toLowerCase();

  if (
    text.includes("focus") ||
    text.includes("concentration")
  ) {
    return {
      icon: "🧠",
      name: "Focus Agent",
      description:
        "Analyzes concentration and productivity difficulties.",
    };
  }

  if (
    text.includes("placement") ||
    text.includes("interview")
  ) {
    return {
      icon: "🏆",
      name: "Placement Agent",
      description:
        "Provides placement preparation and interview guidance.",
    };
  }

  if (
    text.includes("career") ||
    text.includes("skill")
  ) {
    return {
      icon: "💼",
      name: "Career Agent",
      description:
        "Analyzes career goals and recommends relevant skills.",
    };
  }

  if (
    text.includes("study") ||
    text.includes("schedule") ||
    text.includes("exam")
  ) {
    return {
      icon: "📚",
      name: "Study Planner Agent",
      description:
        "Creates personalized study strategies and exam preparation guidance.",
    };
  }

  return {
    icon: "🎯",
    name: "Academic Risk Agent",
    description:
      "Analyzes academic performance and identifies potential academic risks.",
  };
};

const getSuggestions = (risk, form) => {
  const suggestions = [];

  if (
    form.attendance &&
    Number(form.attendance) < 75
  ) {
    suggestions.push(
      "Improve your attendance and maintain regular class participation."
    );
  }

  if (
    form.academicScore &&
    Number(form.academicScore) < 60
  ) {
    suggestions.push(
      "Give extra study time to your weakest subjects."
    );
  }

  if (
    form.emotion === "Stressed" ||
    form.emotion === "Confused"
  ) {
    suggestions.push(
      "Use short focused study sessions and take regular breaks."
    );
  }

  suggestions.push(
    "Follow a consistent daily study schedule."
  );

  suggestions.push(
    "Practice questions regularly and review your mistakes."
  );

  if (risk < 40) {
    return [
      "Continue your current study routine.",
      "Maintain good attendance.",
      "Revise important topics regularly.",
      "Track your academic progress every week.",
    ];
  }

  return suggestions.slice(0, 5);
};

export default function Student() {
  const [form, setForm] = useState({
    name: "",
    academicScore: "",
    attendance: "",
    emotion: "",
    behavior: "",
    personality: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [riskPreview, setRiskPreview] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const riskInfo = getRiskInfo(riskPreview);

  const handleChange = (e) => {
    const updated = {
      ...form,
      [e.target.name]: e.target.value,
    };

    setForm(updated);

    setRiskPreview(
      calculateRisk(updated)
    );

    setSuccess(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setErrorMessage(
        "Please enter student name."
      );
      return;
    }

    if (!form.academicScore) {
      setErrorMessage(
        "Please enter academic score."
      );
      return;
    }

    if (!form.attendance) {
      setErrorMessage(
        "Please enter attendance."
      );
      return;
    }

    setLoading(true);
    setSuccess(false);
    setAnalysis(null);
    setErrorMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/agents/student-analysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            academicScore: Number(
              form.academicScore
            ),
            attendance: Number(
              form.attendance
            ),
            riskScore: riskPreview,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "AI analysis failed"
        );
      }

      setAnalysis(data.data);
      setSuccess(true);
    } catch (error) {
      console.error(
        "❌ Student AI Analysis Error:",
        error
      );

      /*
       * Local fallback for development/testing.
       * The page can still demonstrate the complete
       * student intelligence flow if the backend
       * endpoint is temporarily unavailable.
       */

      setAnalysis({
        riskScore: riskPreview,
        riskLevel: riskInfo.level,
        agentName:
          "Academic Risk Agent",
        analysis:
          riskPreview >= 40
            ? "The student's current profile shows some areas that require academic attention. Attendance, academic performance and learning behaviour should be monitored regularly."
            : "The student's current academic profile appears stable. Maintaining consistent study habits and attendance can help continue this performance.",
        reply:
          riskPreview >= 40
            ? "The student may benefit from improving attendance, focusing on weaker subjects and following a structured study routine."
            : "The student should continue the current study routine and regularly monitor academic progress.",
      });

      setErrorMessage(
        "Backend analysis unavailable. Showing local AI analysis for testing."
      );
    } finally {
      setLoading(false);
    }
  };

  const agentInfo = getAgentInfo(
    analysis
  );

  const finalRisk =
    analysis?.riskScore !== undefined
      ? Number(analysis.riskScore)
      : riskPreview;

  const finalRiskInfo =
    getRiskInfo(finalRisk);

  const suggestions = getSuggestions(
    finalRisk,
    form
  );

  const analysisText =
    analysis?.analysis ||
    analysis?.reply ||
    "No detailed analysis was returned.";

  return (
    <div className="student-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="student-hero">

        <div className="student-hero-content">

          <div className="student-hero-icon">
            🎓
          </div>

          <div>
            <span className="student-eyebrow">
              EDUCORE AI • STUDENT INTELLIGENCE
            </span>

            <h1>
              Student Intelligence Dashboard
            </h1>

            <p>
              Understand academic performance,
              identify risks and receive
              personalized AI guidance.
            </p>
          </div>

        </div>

        <div className="hero-risk">

          <span>
            LIVE RISK PREVIEW
          </span>

          <strong>
            {riskPreview}%
          </strong>

          <small>
            {riskInfo.level}
          </small>

        </div>

      </section>


      {/* =========================
          SUCCESS / ERROR
      ========================= */}

      {success && (
        <div className="success">
          ✅ AI Analysis Completed Successfully
        </div>
      )}

      {errorMessage && (
        <div className="student-error">
          ⚠️ {errorMessage}
        </div>
      )}


      {/* =========================
          PROFILE + RISK
      ========================= */}

      <div className="student-overview-grid">

        {/* PROFILE */}

        <section className="student-card">

          <div className="card-title-row">

            <div className="card-title-icon">
              👤
            </div>

            <div>
              <h2>
                Student Profile
              </h2>

              <p>
                Basic student information
              </p>
            </div>

          </div>

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              Personality
            </label>

            <input
              name="personality"
              placeholder="Introvert / Extrovert"
              value={form.personality}
              onChange={handleChange}
            />

          </div>

        </section>


        {/* RISK */}

        <section className="student-card">

          <div className="card-title-row">

            <div className="card-title-icon">
              🎯
            </div>

            <div>
              <h2>
                Academic Risk
              </h2>

              <p>
                Real-time risk estimation
              </p>
            </div>

          </div>

          <div className="risk-overview">

            <div
              className={`risk-circle ${riskInfo.className}`}
            >
              <strong>
                {riskPreview}%
              </strong>

              <span>
                Risk
              </span>
            </div>

            <div className="risk-text">

              <h3>
                {riskInfo.icon}{" "}
                {riskInfo.level}
              </h3>

              <p>
                {riskInfo.description}
              </p>

            </div>

          </div>

          <div className="risk-progress">

            <div
              className={`risk-progress-fill ${riskInfo.className}`}
              style={{
                width: `${riskPreview}%`,
              }}
            />

          </div>

        </section>

      </div>


      {/* =========================
          ACADEMIC DATA
      ========================= */}

      <section className="student-card academic-section">

        <div className="card-title-row">

          <div className="card-title-icon">
            📊
          </div>

          <div>
            <h2>
              Academic Performance
            </h2>

            <p>
              Enter the student's current
              academic information
            </p>
          </div>

        </div>


        <div className="academic-grid">

          <div className="form-group">

            <label>
              Academic Score (%)
            </label>

            <input
              type="number"
              name="academicScore"
              placeholder="Enter score"
              value={form.academicScore}
              onChange={handleChange}
              min="0"
              max="100"
            />

            <div className="mini-progress">

              <div
                style={{
                  width: `${Math.min(
                    Number(
                      form.academicScore
                    ) || 0,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Attendance (%)
            </label>

            <input
              type="number"
              name="attendance"
              placeholder="Enter attendance"
              value={form.attendance}
              onChange={handleChange}
              min="0"
              max="100"
            />

            <div className="mini-progress">

              <div
                style={{
                  width: `${Math.min(
                    Number(
                      form.attendance
                    ) || 0,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Current Emotion
            </label>

            <select
              name="emotion"
              value={form.emotion}
              onChange={handleChange}
            >

              <option value="">
                Select Emotion
              </option>

              <option value="Happy">
                Happy
              </option>

              <option value="Neutral">
                Neutral
              </option>

              <option value="Motivated">
                Motivated
              </option>

              <option value="Confused">
                Confused
              </option>

              <option value="Stressed">
                Stressed
              </option>

            </select>

          </div>

        </div>

      </section>


      {/* =========================
          BEHAVIOR + NOTES
      ========================= */}

      <div className="student-two-column">

        <section className="student-card">

          <div className="card-title-row">

            <div className="card-title-icon">
              🧠
            </div>

            <div>
              <h2>
                Behavior & Learning Pattern
              </h2>

              <p>
                Describe the student's learning
                behaviour
              </p>
            </div>

          </div>

          <div className="form-group">

            <label>
              Student Behavior
            </label>

            <textarea
              name="behavior"
              value={form.behavior}
              onChange={handleChange}
              placeholder="Example: Finds it difficult to concentrate, participates actively in class..."
              rows="6"
            />

          </div>

        </section>


        <section className="student-card">

          <div className="card-title-row">

            <div className="card-title-icon">
              📝
            </div>

            <div>
              <h2>
                AI Notes
              </h2>

              <p>
                Additional observations
              </p>
            </div>

          </div>

          <div className="form-group">

            <label>
              Additional Information
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Enter academic concerns, goals or other useful information..."
              rows="6"
            />

          </div>

        </section>

      </div>


      {/* =========================
          AI ACTION
      ========================= */}

      <section className="ai-action-section">

        <div className="ai-action-content">

          <span>
            🤖 AGENTIC AI
          </span>

          <h2>
            Ready to understand the student?
          </h2>

          <p>
            AI agents will analyze the student
            profile and generate personalized
            guidance.
          </p>

        </div>

        <button
          className="run-ai-button"
          onClick={handleSubmit}
          disabled={loading}
        >

          {loading ? (
            <>
              <span className="button-loader" />
              AI Agents Analyzing...
            </>
          ) : (
            <>
              🚀 Run AI Analysis
            </>
          )}

        </button>

      </section>


      {/* =========================
          AI RESULTS
      ========================= */}

      {analysis && (

        <section className="ai-results">

          {/* RESULT HEADER */}

          <div className="ai-result-header">

            <div>

              <span>
                AI-POWERED RESULT
              </span>

              <h2>
                🤖 Agentic AI Student Analysis
              </h2>

              <p>
                Personalized insights generated
                from the student's information.
              </p>

            </div>

            <div className="result-risk">

              <small>
                Risk Score
              </small>

              <strong>
                {finalRisk}%
              </strong>

              <span
                className={
                  finalRiskInfo.className
                }
              >
                {finalRiskInfo.level}
              </span>

            </div>

          </div>


          {/* AI ANALYSIS */}

          <div className="result-card">

            <div className="result-card-header">

              <div className="result-card-icon">
                🔍
              </div>

              <div>

                <h3>
                  AI Analysis
                </h3>

                <p>
                  Understanding the student's
                  current situation
                </p>

              </div>

            </div>

            <div className="analysis-text">
              {analysisText}
            </div>

          </div>


          {/* AGENT */}

          <div className="result-card agent-result">

            <div className="result-card-header">

              <div className="result-card-icon">
                {agentInfo.icon}
              </div>

              <div>

                <h3>
                  Agentic AI
                </h3>

                <p>
                  Specialized agent activated
                </p>

              </div>

            </div>

            <div className="agent-detection">

              <div>

                <span>
                  DETECTED AGENT
                </span>

                <h3>
                  {agentInfo.icon}{" "}
                  {analysis?.agentName ||
                    agentInfo.name}
                </h3>

                <p>
                  {agentInfo.description}
                </p>

              </div>

              <div className="agent-status">
                ✓ Analysis Completed
              </div>

            </div>

          </div>


          {/* SUGGESTIONS */}

          <div className="result-card">

            <div className="result-card-header">

              <div className="result-card-icon">
                💡
              </div>

              <div>

                <h3>
                  Personalized Suggestions
                </h3>

                <p>
                  Recommended improvements
                  for the student
                </p>

              </div>

            </div>

            <div className="suggestions-list">

              {suggestions.map(
                (suggestion, index) => (

                  <div
                    className="suggestion-item"
                    key={index}
                  >

                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <p>
                      {suggestion}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>


          {/* NEXT ACTION */}

          <div className="next-action-card">

            <div className="next-action-icon">
              🎯
            </div>

            <div>

              <span>
                RECOMMENDED ACTION
              </span>

              <h3>
                Start improving one area today
              </h3>

              <p>
                Begin with your weakest area,
                complete one focused study session,
                and monitor your progress regularly.
              </p>

            </div>

          </div>


          {/* MENTOR SUPPORT */}

          <div className="mentor-support-card">

            <div className="mentor-support-icon">
              👨‍🏫
            </div>

            <div className="mentor-support-content">

              <span>
                NEED FURTHER GUIDANCE?
              </span>

              <h2>
                Connect with a Mentor
              </h2>

              <p>
                If you need additional academic
                or career support, connect with a
                mentor for personalized guidance.
              </p>

            </div>

            <a
              href="/mentors"
              className="mentor-support-button"
            >
              Find a Mentor →
            </a>

          </div>

        </section>

      )}

    </div>
  );
}