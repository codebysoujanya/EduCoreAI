import { useState } from "react";
import "./Placement.css";

const categories = [
  {
    key: "academic",
    name: "Academic",
    icon: "📚",
    weight: 20,
    description: "CGPA, subjects and academic consistency",
  },
  {
    key: "attendance",
    name: "Attendance",
    icon: "📅",
    weight: 10,
    description: "Attendance and placement eligibility",
  },
  {
    key: "technical",
    name: "Technical Skills",
    icon: "💻",
    weight: 25,
    description: "Programming, DSA, SQL and technical knowledge",
  },
  {
    key: "projects",
    name: "Projects",
    icon: "🚀",
    weight: 20,
    description: "Real-world projects and implementation",
  },
  {
    key: "communication",
    name: "Communication",
    icon: "🎤",
    weight: 15,
    description: "Speaking, confidence and interview skills",
  },
  {
    key: "resume",
    name: "Resume",
    icon: "📄",
    weight: 10,
    description: "Resume quality and profile presentation",
  },
];

export default function Placement() {
  const [scores, setScores] = useState({
    academic: "",
    attendance: "",
    technical: "",
    projects: "",
    communication: "",
    resume: "",
  });

  const [tasks, setTasks] = useState({
    coding: false,
    project: false,
    resume: false,
    interview: false,
  });

  const updateScore = (key, value) => {
    if (value === "") {
      setScores({
        ...scores,
        [key]: "",
      });
      return;
    }

    let number = Number(value);

    if (number < 0) {
      number = 0;
    }

    if (number > 100) {
      number = 100;
    }

    setScores({
      ...scores,
      [key]: number,
    });
  };

  let readinessScore = 0;

  categories.forEach((category) => {
    const value = Number(scores[category.key]) || 0;
    readinessScore += value * (category.weight / 100);
  });

  readinessScore = Math.round(readinessScore);

  const completedInputs = categories.filter(
    (category) => scores[category.key] !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedInputs / categories.length) * 100
  );

  let strongest = null;
  let weakest = null;

  const enteredCategories = categories.filter(
    (category) => scores[category.key] !== ""
  );

  if (enteredCategories.length > 0) {
    strongest = enteredCategories[0];
    weakest = enteredCategories[0];

    enteredCategories.forEach((category) => {
      const currentValue = Number(scores[category.key]) || 0;
      const strongestValue = Number(scores[strongest.key]) || 0;
      const weakestValue = Number(scores[weakest.key]) || 0;

      if (currentValue > strongestValue) {
        strongest = category;
      }

      if (currentValue < weakestValue) {
        weakest = category;
      }
    });
  }

  let readinessLabel = "Not Assessed";
  let readinessMessage =
    "Enter your placement profile to activate AI analysis.";
  let readinessClass = "neutral";

  if (completedInputs > 0) {
    if (readinessScore >= 85) {
      readinessLabel = "Placement Ready";
      readinessMessage =
        "Your profile shows strong placement readiness. Focus on company-specific preparation.";
      readinessClass = "excellent";
    } else if (readinessScore >= 70) {
      readinessLabel = "Almost Ready";
      readinessMessage =
        "You have a strong foundation. Strengthen your weakest area before interviews.";
      readinessClass = "good";
    } else if (readinessScore >= 50) {
      readinessLabel = "Developing";
      readinessMessage =
        "Your profile has potential. Follow a focused preparation plan.";
      readinessClass = "average";
    } else {
      readinessLabel = "Needs Attention";
      readinessMessage =
        "Build your fundamentals and improve your placement profile step by step.";
      readinessClass = "risk";
    }
  }

  let recommendation =
    "Add your scores to receive a personalized placement action plan.";

  if (weakest) {
    if (weakest.key === "academic") {
      recommendation =
        "Prioritize difficult subjects, maintain your CGPA and clear any pending academic requirements.";
    } else if (weakest.key === "attendance") {
      recommendation =
        "Maintain regular attendance and verify that you meet your college placement eligibility criteria.";
    } else if (weakest.key === "technical") {
      recommendation =
        "Spend daily time on Java, Python, SQL, DSA and coding problems. Technical preparation has the highest impact.";
    } else if (weakest.key === "projects") {
      recommendation =
        "Strengthen your projects and prepare a clear explanation of architecture, technologies and your contribution.";
    } else if (weakest.key === "communication") {
      recommendation =
        "Practice HR questions, self-introduction and mock interviews to improve confidence.";
    } else if (weakest.key === "resume") {
      recommendation =
        "Improve your resume with measurable project results, relevant skills and a clean professional structure.";
    }
  }

  const completedTasks = Object.values(tasks).filter(Boolean).length;

  const taskProgress = Math.round((completedTasks / 4) * 100);

  const toggleTask = (key) => {
    setTasks({
      ...tasks,
      [key]: !tasks[key],
    });
  };

  const resetProfile = () => {
    setScores({
      academic: "",
      attendance: "",
      technical: "",
      projects: "",
      communication: "",
      resume: "",
    });

    setTasks({
      coding: false,
      project: false,
      resume: false,
      interview: false,
    });
  };

  return (
    <div className="placement-page">
      <div className="placement-container">

        <header className="placement-header">
          <div>
            <div className="placement-eyebrow">
              EDUCOREAI • CAREER INTELLIGENCE
            </div>

            <h1>Placement Intelligence</h1>

            <p>
              Analyze your placement readiness, identify weak areas and build
              your personalized career preparation plan.
            </p>
          </div>

          <div className="ai-status">
            <span className="status-dot"></span>
            AI ANALYSIS ACTIVE
          </div>
        </header>

        <section className="hero-grid">

          <div className="readiness-card">
            <div className="card-label">
              OVERALL READINESS
            </div>

            <div className="score-circle">
              <div>
                <strong>{readinessScore}</strong>
                <span>/100</span>
              </div>
            </div>

            <div className={`readiness-badge ${readinessClass}`}>
              {readinessLabel}
            </div>

            <p>{readinessMessage}</p>
          </div>

          <div className="career-snapshot">

            <div className="section-title">
              <div>
                <span className="mini-label">
                  AI CAREER SCAN
                </span>

                <h2>Your Career Snapshot</h2>
              </div>

              <span className="scan-icon">
                ✦
              </span>
            </div>

            <div className="snapshot-grid">

              <div className="snapshot-item">
                <span>Profile Completion</span>

                <strong>
                  {profileCompletion}%
                </strong>
              </div>

              <div className="snapshot-item">
                <span>Strongest Area</span>

                <strong>
                  {strongest ? strongest.name : "Waiting"}
                </strong>
              </div>

              <div className="snapshot-item">
                <span>Focus Area</span>

                <strong>
                  {weakest ? weakest.name : "Waiting"}
                </strong>
              </div>

              <div className="snapshot-item">
                <span>7-Day Progress</span>

                <strong>
                  {taskProgress}%
                </strong>
              </div>

            </div>

            <div className="snapshot-progress">
              <div
                className="snapshot-progress-fill"
                style={{
                  width: `${readinessScore}%`,
                }}
              ></div>
            </div>

            <span className="progress-caption">
              Placement readiness signal
            </span>

          </div>

        </section>

        <section className="section-card">

          <div className="section-heading">

            <div>
              <span className="mini-label">
                01 • PROFILE ANALYSIS
              </span>

              <h2>
                Build Your Placement Profile
              </h2>

              <p>
                Enter scores from 0–100. EduCoreAI will calculate your
                weighted placement readiness.
              </p>
            </div>

            <button
              className="reset-btn"
              onClick={resetProfile}
            >
              Reset
            </button>

          </div>

          <div className="category-grid">

            {categories.map((category) => {
              const value =
                Number(scores[category.key]) || 0;

              return (
                <div
                  className="category-card"
                  key={category.key}
                >

                  <div className="category-top">

                    <div className="category-icon">
                      {category.icon}
                    </div>

                    <div>
                      <h3>
                        {category.name}
                      </h3>

                      <span>
                        {category.weight}% weight
                      </span>
                    </div>

                  </div>

                  <p>
                    {category.description}
                  </p>

                  <div className="score-input-row">

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[category.key]}
                      placeholder="0"
                      onChange={(event) =>
                        updateScore(
                          category.key,
                          event.target.value
                        )
                      }
                    />

                    <span>
                      / 100
                    </span>

                  </div>

                  <div className="mini-progress">

                    <div
                      style={{
                        width: `${value}%`,
                      }}
                    ></div>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        <section className="analysis-grid">

          <div className="section-card focus-card">

            <div className="mini-label">
              02 • AI RECOMMENDATION
            </div>

            <div className="ai-heading">

              <div className="ai-symbol">
                ✦
              </div>

              <div>
                <h2>
                  Next Best Move
                </h2>

                <span>
                  Based on your current placement profile
                </span>
              </div>

            </div>

            <div className="recommendation-box">

              <span className="recommendation-label">
                AI FOCUS
              </span>

              <h3>
                {weakest
                  ? `Improve ${weakest.name}`
                  : "Complete your profile"}
              </h3>

              <p>
                {recommendation}
              </p>

            </div>

            {strongest && (
              <div className="strength-box">

                <span>
                  YOUR CURRENT STRENGTH
                </span>

                <strong>
                  {strongest.icon} {strongest.name}
                </strong>

                <small>
                  Score: {scores[strongest.key]}/100
                </small>

              </div>
            )}

          </div>

          <div className="section-card signal-card">

            <div className="mini-label">
              03 • RECRUITER SIGNAL
            </div>

            <h2>
              Hiring Signals
            </h2>

            <div className="signal-list">

              <div className="signal-row">

                <span className="signal-icon">
                  ⚡
                </span>

                <div>
                  <strong>
                    Technical Depth
                  </strong>

                  <p>
                    {Number(scores.technical) >= 70
                      ? "Strong technical signal"
                      : "Needs technical improvement"}
                  </p>
                </div>

                <span
                  className={
                    Number(scores.technical) >= 70
                      ? "signal-good"
                      : "signal-low"
                  }
                >
                  {Number(scores.technical) >= 70
                    ? "GOOD"
                    : "BUILD"}
                </span>

              </div>

              <div className="signal-row">

                <span className="signal-icon">
                  🚀
                </span>

                <div>
                  <strong>
                    Project Proof
                  </strong>

                  <p>
                    {Number(scores.projects) >= 70
                      ? "Strong practical evidence"
                      : "Add stronger project evidence"}
                  </p>
                </div>

                <span
                  className={
                    Number(scores.projects) >= 70
                      ? "signal-good"
                      : "signal-low"
                  }
                >
                  {Number(scores.projects) >= 70
                    ? "GOOD"
                    : "BUILD"}
                </span>

              </div>

              <div className="signal-row">

                <span className="signal-icon">
                  🎯
                </span>

                <div>
                  <strong>
                    Interview Confidence
                  </strong>

                  <p>
                    {Number(scores.communication) >= 70
                      ? "Interview communication looks strong"
                      : "Practice communication and HR rounds"}
                  </p>
                </div>

                <span
                  className={
                    Number(scores.communication) >= 70
                      ? "signal-good"
                      : "signal-low"
                  }
                >
                  {Number(scores.communication) >= 70
                    ? "GOOD"
                    : "BUILD"}
                </span>

              </div>

            </div>

          </div>

        </section>

        <section className="section-card">

          <div className="section-heading">

            <div>
              <span className="mini-label">
                04 • 7 DAY SPRINT
              </span>

              <h2>
                Placement Flight Plan
              </h2>

              <p>
                Complete these activities to move your profile forward.
              </p>
            </div>

            <div className="task-counter">
              {completedTasks}/4 completed
            </div>

          </div>

          <div className="task-progress">

            <div
              style={{
                width: `${taskProgress}%`,
              }}
            ></div>

          </div>

          <div className="task-grid">

            <button
              className={`task-card ${
                tasks.coding ? "completed" : ""
              }`}
              onClick={() => toggleTask("coding")}
            >

              <span className="task-check">
                {tasks.coding ? "✓" : "01"}
              </span>

              <div>
                <strong>
                  Daily Coding
                </strong>

                <p>
                  Solve 3 DSA or programming problems.
                </p>
              </div>

            </button>

            <button
              className={`task-card ${
                tasks.project ? "completed" : ""
              }`}
              onClick={() => toggleTask("project")}
            >

              <span className="task-check">
                {tasks.project ? "✓" : "02"}
              </span>

              <div>
                <strong>
                  Project Story
                </strong>

                <p>
                  Prepare a 2-minute explanation of your project.
                </p>
              </div>

            </button>

            <button
              className={`task-card ${
                tasks.resume ? "completed" : ""
              }`}
              onClick={() => toggleTask("resume")}
            >

              <span className="task-check">
                {tasks.resume ? "✓" : "03"}
              </span>

              <div>
                <strong>
                  Resume Review
                </strong>

                <p>
                  Improve one section of your placement resume.
                </p>
              </div>

            </button>

            <button
              className={`task-card ${
                tasks.interview ? "completed" : ""
              }`}
              onClick={() => toggleTask("interview")}
            >

              <span className="task-check">
                {tasks.interview ? "✓" : "04"}
              </span>

              <div>
                <strong>
                  Mock Interview
                </strong>

                <p>
                  Practice 5 technical or HR interview questions.
                </p>
              </div>

            </button>

          </div>

        </section>

        <section className="recruiter-card">

          <div>

            <span className="mini-label">
              RECRUITER VIEW
            </span>

            <h2>
              Your Placement Passport
            </h2>

            <p>
              This snapshot represents how your profile currently appears
              from a placement-readiness perspective.
            </p>

          </div>

          <div className="passport-score">

            <strong>
              {readinessScore}
            </strong>

            <span>
              READINESS
            </span>

          </div>

          <div className="passport-tags">

            <span>
              {readinessScore >= 70
                ? "✓ Placement Eligible"
                : "○ Improve Profile"}
            </span>

            <span>
              {Number(scores.technical) >= 70
                ? "✓ Technical Ready"
                : "○ Technical Practice"}
            </span>

            <span>
              {Number(scores.projects) >= 70
                ? "✓ Project Ready"
                : "○ Project Building"}
            </span>

          </div>

        </section>

        <footer className="placement-footer">

          <span>
            EDUCOREAI
          </span>

          <span>
            AI-powered student career intelligence
          </span>

        </footer>

      </div>
    </div>
  );
}