import { useMemo, useState } from "react";
import "./AIInsights.css";

const STUDENTS = [
  {
    id: 1,
    name: "Ananya Sharma",
    course: "CSE • Data Science",
    academic: 82,
    attendance: 91,
    emotion: "Motivated",
    risk: "Low",
    trend: "Improving",
    insight:
      "Student is progressing consistently with strong attendance and academic performance.",
    recommendation:
      "Continue the current study routine and encourage advanced learning activities.",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    course: "CSE • Data Science",
    academic: 61,
    attendance: 68,
    emotion: "Stressed",
    risk: "High",
    trend: "Declining",
    insight:
      "Low attendance and declining academic performance indicate a need for mentor intervention.",
    recommendation:
      "Schedule a mentor discussion and create a short-term academic recovery plan.",
  },
  {
    id: 3,
    name: "Priya Nair",
    course: "CSE • Data Science",
    academic: 74,
    attendance: 79,
    emotion: "Confused",
    risk: "Medium",
    trend: "Stable",
    insight:
      "Academic performance is acceptable, but confusion may affect learning consistency.",
    recommendation:
      "Provide subject-wise guidance and identify topics where additional support is required.",
  },
  {
    id: 4,
    name: "Arjun Reddy",
    course: "CSE • Data Science",
    academic: 88,
    attendance: 94,
    emotion: "Happy",
    risk: "Low",
    trend: "Improving",
    insight:
      "Strong academic performance and attendance suggest excellent learning consistency.",
    recommendation:
      "Encourage leadership, peer mentoring and advanced technical challenges.",
  },
  {
    id: 5,
    name: "Meera Joshi",
    course: "CSE • Data Science",
    academic: 67,
    attendance: 73,
    emotion: "Neutral",
    risk: "Medium",
    trend: "Stable",
    insight:
      "Performance is moderate with attendance slightly below the preferred level.",
    recommendation:
      "Monitor attendance and provide regular academic progress feedback.",
  },
  {
    id: 6,
    name: "Vikram Singh",
    course: "CSE • Data Science",
    academic: 55,
    attendance: 62,
    emotion: "Stressed",
    risk: "High",
    trend: "Declining",
    insight:
      "Low academic score combined with poor attendance indicates elevated academic risk.",
    recommendation:
      "Immediate mentor follow-up is recommended with academic and behavioral support.",
  },
  {
    id: 7,
    name: "Sneha Patil",
    course: "CSE • Data Science",
    academic: 79,
    attendance: 86,
    emotion: "Motivated",
    risk: "Low",
    trend: "Improving",
    insight:
      "Student demonstrates positive engagement and a healthy academic trajectory.",
    recommendation:
      "Maintain current performance and encourage participation in projects.",
  },
  {
    id: 8,
    name: "Karan Verma",
    course: "CSE • Data Science",
    academic: 69,
    attendance: 76,
    emotion: "Confused",
    risk: "Medium",
    trend: "Stable",
    insight:
      "The student is maintaining average performance but may require targeted academic guidance.",
    recommendation:
      "Review difficult subjects and provide personalized learning resources.",
  },
];

const AGENTS = [
  {
    id: "academic",
    icon: "📊",
    name: "Academic Risk Agent",
    description:
      "Analyzes academic performance, attendance and learning patterns to identify students requiring support.",
    status: "Active",
  },
  {
    id: "emotion",
    icon: "🧠",
    name: "Cognitive Profiling Agent",
    description:
      "Analyzes emotional and behavioral signals to understand student wellbeing and learning behavior.",
    status: "Active",
  },
  {
    id: "mentor",
    icon: "🤝",
    name: "Mentor Support Agent",
    description:
      "Converts AI findings into practical mentor recommendations and intervention strategies.",
    status: "Active",
  },
];

const LIVE_INSIGHTS = [
  {
    icon: "⚠️",
    tag: "ATTENTION",
    title: "High-risk students detected",
    description:
      "2 students currently require closer academic and mentor monitoring.",
  },
  {
    icon: "📈",
    tag: "PERFORMANCE",
    title: "Academic trend improving",
    description:
      "Several students are showing positive progress in recent assessments.",
  },
  {
    icon: "🧠",
    tag: "WELLBEING",
    title: "Emotional signals monitored",
    description:
      "AI is tracking stress, motivation and engagement indicators.",
  },
];

export default function AIInsights() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alertedStudents, setAlertedStudents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("academic");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(
    "AI intelligence system is monitoring academic, emotional and behavioral signals."
  );

  const filteredStudents = useMemo(() => {
    return STUDENTS.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.course.toLowerCase().includes(search.toLowerCase());

      const matchesRisk =
        riskFilter === "All" || student.risk === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [search, riskFilter]);

  const riskCounts = useMemo(
    () => ({
      All: STUDENTS.length,
      Low: STUDENTS.filter((s) => s.risk === "Low").length,
      Medium: STUDENTS.filter((s) => s.risk === "Medium").length,
      High: STUDENTS.filter((s) => s.risk === "High").length,
    }),
    []
  );

  const highRiskCount = riskCounts.High;

  const healthScore = Math.round(
    STUDENTS.reduce((sum, student) => {
      return sum + (student.academic * 0.6 + student.attendance * 0.4);
    }, 0) / STUDENTS.length
  );

  const generateInsights = () => {
    setGenerating(true);
    setMessage("AI agents are analyzing the latest student intelligence...");

    setTimeout(() => {
      setGenerating(false);
      setMessage(
        "Analysis completed. Academic performance, attendance and emotional signals have been evaluated."
      );
    }, 1200);
  };

  const deepAnalysis = () => {
    setMessage(
      "Deep analysis initiated: AI is correlating academic, attendance, emotional and behavioral indicators."
    );
  };

  const sendMentorAlert = (student) => {
    setAlertedStudents((previous) =>
      previous.includes(student.id)
        ? previous
        : [...previous, student.id]
    );

    setMessage(`Mentor alert sent for ${student.name}.`);
  };

  return (
    <div className="ai-insights-page">

      {/* HERO */}
      <section className="insights-hero">
        <div className="hero-left">
          <div className="hero-status">
            <span className="live-dot"></span>
            EDUCOREAI • AI INTELLIGENCE ENGINE
          </div>

          <div className="hero-title">
            <div className="brain-icon">🧠</div>

            <div>
              <h1>AI Insights</h1>
              <p>
                Intelligent student monitoring powered by academic,
                emotional and behavioral analysis.
              </p>
            </div>
          </div>

          <div className="hero-buttons">
            <button
              className="generate-btn"
              onClick={generateInsights}
              disabled={generating}
            >
              {generating ? "Analyzing..." : "✦ Generate AI Insights"}
            </button>

            <button className="deep-btn" onClick={deepAnalysis}>
              ⌁ Deep Analysis
            </button>
          </div>
        </div>

        <div className="intelligence-score-card">
          <div className="score-header">
            <span>STUDENT INTELLIGENCE HEALTH</span>
            <span className="score-live">● LIVE</span>
          </div>

          <div className="health-score">
            <strong>{healthScore}</strong>
            <span>/100</span>
          </div>

          <div className="health-bar">
            <div style={{ width: `${healthScore}%` }}></div>
          </div>

          <div className="health-footer">
            <span>Overall student health</span>
            <strong>Good</strong>
          </div>

          <div className="score-note">
            Calculated from academic performance, attendance and student
            wellbeing indicators.
          </div>
        </div>
      </section>

      {/* MESSAGE */}
      <div className="insight-message">
        <span>✦</span>
        <p>{message}</p>
      </div>

      {/* OVERVIEW */}
      <section className="overview-section">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">SYSTEM OVERVIEW</span>
            <h2>Student Intelligence Overview</h2>
            <p>
              Real-time summary of the current student population.
            </p>
          </div>

          <span className="updated-label">Updated just now</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">👥</span>
              <span className="stat-trend">LIVE</span>
            </div>
            <strong>{STUDENTS.length}</strong>
            <span>Total Students</span>
            <div className="mini-progress">
              <div style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">⚠️</span>
              <span className="stat-trend">ACTION</span>
            </div>
            <strong>{highRiskCount}</strong>
            <span>High Risk Students</span>
            <div className="mini-progress">
              <div
                style={{
                  width: `${(highRiskCount / STUDENTS.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">📈</span>
              <span className="stat-trend positive">+12%</span>
            </div>
            <strong>78%</strong>
            <span>Academic Health</span>
            <div className="mini-progress">
              <div style={{ width: "78%" }}></div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">🧠</span>
              <span className="stat-trend positive">STABLE</span>
            </div>
            <strong>84%</strong>
            <span>Wellbeing Index</span>
            <div className="mini-progress">
              <div style={{ width: "84%" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE INSIGHTS */}
      <section className="live-section">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">LIVE SIGNALS</span>
            <h2>Latest AI Insights</h2>
            <p>
              Important signals identified by the intelligence engine.
            </p>
          </div>

          <div className="live-indicator">
            <span></span>
            MONITORING
          </div>
        </div>

        <div className="live-list">
          {LIVE_INSIGHTS.map((item, index) => (
            <div
              className={`live-card ${index === 0 ? "primary" : ""}`}
              key={item.title}
            >
              <span className="live-number">0{index + 1}</span>

              <div className="live-icon">{item.icon}</div>

              <div className="live-content">
                <span className="live-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <span className="insight-arrow">›</span>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTIC AI */}
      <section className="agentic-section">
        <div className="agentic-top">
          <div className="agentic-heading">
            <span className="section-kicker">AGENTIC AI</span>

            <div className="agent-title-row">
              <div>
                <h2>AI Agent Intelligence</h2>
                <p>
                  Specialized AI agents work together to analyze students,
                  identify risks and recommend mentor interventions.
                </p>
              </div>

              <span className="agent-count">
                {AGENTS.length} ACTIVE AGENTS
              </span>
            </div>
          </div>

          <div className="system-status">
            <span></span>
            SYSTEM ONLINE
          </div>
        </div>

        <div className="agent-pipeline">
          <div className="pipeline-node active">
            <span>01</span>
            <strong>Student Data</strong>
            <small>Input</small>
          </div>

          <div className="pipeline-line"></div>

          <div className="pipeline-node active">
            <span>02</span>
            <strong>AI Analysis</strong>
            <small>Processing</small>
          </div>

          <div className="pipeline-line"></div>

          <div className="pipeline-node active">
            <span>03</span>
            <strong>Risk Detection</strong>
            <small>Prediction</small>
          </div>

          <div className="pipeline-line"></div>

          <div className="pipeline-node active">
            <span>04</span>
            <strong>Mentor Action</strong>
            <small>Recommendation</small>
          </div>
        </div>

        <div className="agents-grid">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              className={`agent-wrapper ${
                selectedAgent === agent.id ? "agent-selected" : ""
              }`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              <div className="agent-card">
                <div className="agent-card-header">
                  <div className="agent-icon">{agent.icon}</div>

                  <div className="agent-status">
                    <span className="agent-status-dot"></span>
                    {agent.status}
                  </div>
                </div>

                <h3>{agent.name}</h3>
                <p>{agent.description}</p>

                <div className="agent-card-bottom">
                  <span>
                    {selectedAgent === agent.id
                      ? "SELECTED"
                      : "READY TO RUN"}
                  </span>
                  <b>→</b>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="run-agent-area">
          <div className="run-agent-info">
            <div className="orchestration-icon">✦</div>

            <div>
              <h3>AI Orchestration</h3>
              <p>
                Selected agent:{" "}
                <strong>
                  {AGENTS.find((agent) => agent.id === selectedAgent)?.name}
                </strong>
              </p>
            </div>
          </div>

          <button className="run-agent-btn" onClick={generateInsights}>
            {generating ? "Running..." : "▶ Run AI Agent"}
          </button>
        </div>
      </section>

      {/* STUDENT INTELLIGENCE */}
      <section className="student-intelligence-section">
        <div className="student-heading">
          <div>
            <span className="section-kicker">STUDENT MONITORING</span>
            <h2>Student AI Intelligence</h2>
            <p>
              Monitor academic performance, attendance, emotional state and
              AI-predicted risk.
            </p>
          </div>

          <div className="student-summary">
            <strong>{filteredStudents.length}</strong>
            <span>Students Shown</span>
          </div>
        </div>

        <div className="student-controls">
          <div className="student-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>×</button>
            )}
          </div>

          <div className="risk-filters">
            {["All", "Low", "Medium", "High"].map((filter) => (
              <button
                key={filter}
                className={riskFilter === filter ? "active" : ""}
                onClick={() => setRiskFilter(filter)}
              >
                {filter}
                <span>{riskCounts[filter]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="student-intelligence-card">
          <div className="student-table-header">
            <span>STUDENT</span>
            <span>ACADEMIC</span>
            <span>ATTENDANCE</span>
            <span>EMOTIONAL STATE</span>
            <span>AI RISK</span>
            <span>TREND</span>
            <span>ACTION</span>
          </div>

          <div className="student-table-body">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div className="student-row" key={student.id}>
                  <div className="student-profile">
                    <div className={`student-avatar ${student.risk.toLowerCase()}`}>
                      {student.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </div>

                    <div>
                      <strong>{student.name}</strong>
                      <span>{student.course}</span>
                      <small>AI monitored</small>
                    </div>
                  </div>

                  <div className="student-metric">
                    <strong
                      className={
                        student.academic < 60 ? "warning-value" : ""
                      }
                    >
                      {student.academic}%
                    </strong>

                    <small>Academic score</small>

                    <div className="metric-bar">
                      <span
                        style={{
                          width: `${student.academic}%`,
                        }}
                      ></span>
                    </div>
                  </div>

                  <div className="student-metric">
                    <strong
                      className={
                        student.attendance < 75 ? "warning-value" : ""
                      }
                    >
                      {student.attendance}%
                    </strong>

                    <small>Attendance</small>

                    <div className="metric-bar attendance">
                      <span
                        style={{
                          width: `${student.attendance}%`,
                        }}
                      ></span>
                    </div>
                  </div>

                  <div className="emotion-column">
                    <span
                      className={`emotion-badge ${student.emotion.toLowerCase()}`}
                    >
                      {student.emotion === "Motivated" && "⚡"}
                      {student.emotion === "Happy" && "●"}
                      {student.emotion === "Confused" && "?"}
                      {student.emotion === "Stressed" && "!"}
                      {student.emotion === "Neutral" && "•"}
                      {student.emotion}
                    </span>

                    <small>Current signal</small>
                  </div>

                  <div className="risk-column">
                    <span
                      className={`risk-badge ${student.risk.toLowerCase()}`}
                    >
                      <i></i>
                      {student.risk} Risk
                    </span>

                    <small>AI prediction</small>
                  </div>

                  <div className="trend-column">
                    <span
                      className={`trend-badge ${student.trend.toLowerCase()}`}
                    >
                      {student.trend === "Improving" && "↑"}
                      {student.trend === "Declining" && "↓"}
                      {student.trend === "Stable" && "→"}
                      {student.trend}
                    </span>

                    <small>Recent trend</small>
                  </div>

                  <div className="student-actions">
                    <button
                      className="view-student-btn"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View AI Insights <span>→</span>
                    </button>

                    {student.risk !== "Low" && (
                      <button
                        className={`mentor-alert-btn ${
                          alertedStudents.includes(student.id)
                            ? "sent"
                            : ""
                        }`}
                        onClick={() => sendMentorAlert(student)}
                      >
                        {alertedStudents.includes(student.id)
                          ? "✓ Alert Sent"
                          : "⚠ Mentor Alert"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-students">
                <div>🔎</div>
                <h3>No students found</h3>
                <p>
                  Try another student name or change the risk filter.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setRiskFilter("All");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="student-intelligence-footer">
          <div className="student-legend">
            <span>
              <i className="legend-dot low"></i>
              Low Risk
            </span>

            <span>
              <i className="legend-dot medium"></i>
              Medium Risk
            </span>

            <span>
              <i className="legend-dot high"></i>
              High Risk
            </span>
          </div>

          <span className="ai-powered-label">
            AI predictions • Updated in real time
          </span>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section">
        <div className="mission-main">
          <div className="mission-icon">🎯</div>

          <div className="mission-content">
            <h2>Mentor Intervention Mission</h2>

            <p>
              EduCoreAI identifies students who may require additional
              academic or emotional support and helps mentors prioritize
              their interventions.
            </p>

            <div className="mission-actions">
              <button
                onClick={() => {
                  setRiskFilter("High");
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
              >
                View High-Risk Students
              </button>

              <span>AI-assisted prioritization</span>
            </div>
          </div>
        </div>

        <div className="mission-score">
          <span>PRIORITY</span>
          <strong>{highRiskCount}</strong>
          <small>students need attention</small>
        </div>

        <div className="mission-details">
          <div>
            <span>01</span>
            <div>
              <strong>Identify</strong>
              <small>Detect risk signals</small>
            </div>
          </div>

          <div>
            <span>02</span>
            <div>
              <strong>Analyze</strong>
              <small>Understand student needs</small>
            </div>
          </div>

          <div>
            <span>03</span>
            <div>
              <strong>Intervene</strong>
              <small>Support through mentors</small>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITY */}
      <section className="activity-section">
        <div className="activity-heading">
          <div>
            <span className="section-kicker">SYSTEM ACTIVITY</span>
            <h2>AI Activity Timeline</h2>
            <p>Recent intelligence engine activity.</p>
          </div>

          <span className="activity-status">● SYSTEM ACTIVE</span>
        </div>

        <div className="activity-timeline">
          <div className="activity-item">
            <div className="activity-marker">🧠</div>

            <div className="activity-content">
              <div className="activity-meta">
                <span>Just now</span>
                <span>AI ENGINE</span>
              </div>

              <h3>Student intelligence analysis completed</h3>

              <p>
                Academic, attendance and emotional indicators were evaluated.
              </p>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-marker">⚠️</div>

            <div className="activity-content">
              <div className="activity-meta">
                <span>2 min ago</span>
                <span>RISK AGENT</span>
              </div>

              <h3>High-risk students identified</h3>

              <p>
                Two students were flagged for potential mentor intervention.
              </p>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-marker">📈</div>

            <div className="activity-content">
              <div className="activity-meta">
                <span>5 min ago</span>
                <span>ACADEMIC AGENT</span>
              </div>

              <h3>Performance trends updated</h3>

              <p>
                Student academic trends have been refreshed using the latest
                available data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions-section">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">SHORTCUTS</span>
            <h2>Quick Actions</h2>
            <p>Common actions for student intelligence management.</p>
          </div>
        </div>

        <div className="quick-actions-grid">
          <button
            className="quick-action"
            onClick={() => setRiskFilter("High")}
          >
            <span>⚠️</span>
            <div>
              <strong>High-Risk Students</strong>
              <small>Review students needing attention</small>
            </div>
            <b>→</b>
          </button>

          <button
            className="quick-action"
            onClick={generateInsights}
          >
            <span>✦</span>
            <div>
              <strong>Generate Insights</strong>
              <small>Run the AI analysis engine</small>
            </div>
            <b>→</b>
          </button>

          <button
            className="quick-action"
            onClick={() => setRiskFilter("Medium")}
          >
            <span>📊</span>
            <div>
              <strong>Review Medium Risk</strong>
              <small>Monitor students with warning signals</small>
            </div>
            <b>→</b>
          </button>

          <button
            className="quick-action"
            onClick={deepAnalysis}
          >
            <span>🧠</span>
            <div>
              <strong>Deep Analysis</strong>
              <small>Correlate multiple AI signals</small>
            </div>
            <b>→</b>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ai-insights-footer">
        <div className="footer-brand">
          <strong>EDUCOREAI</strong>
          <span>Student Intelligence Platform</span>
        </div>

        <div className="footer-meta">
          <span>AI Monitoring Active</span>
          <i>•</i>
          <span>Academic Risk</span>
          <i>•</i>
          <span>Cognitive Profiling</span>
          <i>•</i>
          <span>Mentor Support</span>
        </div>
      </footer>

      {/* STUDENT MODAL */}
      {selectedStudent && (
        <div
          className="student-modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="student-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-profile">
                <div
                  className={`student-avatar large ${selectedStudent.risk.toLowerCase()}`}
                >
                  {selectedStudent.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>

                <div>
                  <span>AI STUDENT PROFILE</span>
                  <h2>{selectedStudent.name}</h2>
                  <p>{selectedStudent.course}</p>
                </div>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-risk-banner">
              <div>
                <span>AI RISK</span>
                <strong className={selectedStudent.risk.toLowerCase()}>
                  {selectedStudent.risk} Risk
                </strong>
              </div>

              <div>
                <span>EMOTIONAL STATE</span>
                <strong>{selectedStudent.emotion}</strong>
              </div>

              <div>
                <span>TREND</span>
                <strong>{selectedStudent.trend}</strong>
              </div>
            </div>

            <div className="modal-metrics">
              <div>
                <span>Academic Score</span>
                <strong>{selectedStudent.academic}%</strong>

                <div className="modal-progress">
                  <span
                    style={{
                      width: `${selectedStudent.academic}%`,
                    }}
                  ></span>
                </div>
              </div>

              <div>
                <span>Attendance</span>
                <strong>{selectedStudent.attendance}%</strong>

                <div className="modal-progress">
                  <span
                    style={{
                      width: `${selectedStudent.attendance}%`,
                    }}
                  ></span>
                </div>
              </div>
            </div>

            <div className="modal-insight">
              <span>✦ AI INSIGHT</span>
              <p>{selectedStudent.insight}</p>
            </div>

            <div className="modal-recommendation">
              <span>🤝 MENTOR RECOMMENDATION</span>
              <p>{selectedStudent.recommendation}</p>
            </div>

            <div className="modal-actions">
              {selectedStudent.risk !== "Low" && (
                <button
                  onClick={() => sendMentorAlert(selectedStudent)}
                >
                  {alertedStudents.includes(selectedStudent.id)
                    ? "✓ Mentor Alert Sent"
                    : "⚠ Send Mentor Alert"}
                </button>
              )}

              <button onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}