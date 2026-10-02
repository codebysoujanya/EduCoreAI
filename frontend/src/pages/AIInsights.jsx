import { useEffect, useState } from "react";

import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiCrosshair,
  FiDatabase,
  FiEye,
  FiFlag,
  FiLayers,
  FiPlay,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
  FiZap,
  FiX,
} from "react-icons/fi";

import "./AIInsights.css";

/* =========================================================
   AGENTS
   ========================================================= */

const initialAgents = [
  {
    id: 1,
    name: "Academic Agent",
    icon: FiBookOpen,
    description:
      "Analyzes marks, subjects, assignments and academic performance.",
    status: "Active",
    insight:
      "Mathematics performance is improving, but consistency remains below target.",
    category: "Academic",
    risk: "Medium",
  },
  {
    id: 2,
    name: "Learning Agent",
    icon: FiActivity,
    description:
      "Analyzes study patterns, learning behavior and weak learning areas.",
    status: "Active",
    insight:
      "Your strongest focused learning window appears between 7 PM and 9 PM.",
    category: "Learning",
    risk: "Low",
  },
  {
    id: 3,
    name: "Cognitive Agent",
    icon: FiCpu,
    description:
      "Analyzes cognitive profile, strengths, weaknesses and learning patterns.",
    status: "Active",
    insight:
      "Strong analytical reasoning detected. Memory-based learning needs reinforcement.",
    category: "Cognitive",
    risk: "Low",
  },
  {
    id: 4,
    name: "Risk Prediction Agent",
    icon: FiAlertTriangle,
    description:
      "Predicts academic risks and identifies subjects requiring attention.",
    status: "Monitoring",
    insight:
      "Moderate academic risk detected in Mathematics based on recent performance.",
    category: "Risk",
    risk: "High",
  },
  {
    id: 5,
    name: "Career Agent",
    icon: FiBriefcase,
    description:
      "Analyzes career goals, skills, placement readiness and skill gaps.",
    status: "Active",
    insight:
      "Python and communication skills should be strengthened for your target role.",
    category: "Career",
    risk: "Medium",
  },
  {
    id: 6,
    name: "Mentor Agent",
    icon: FiUsers,
    description:
      "Connects AI insights with mentor recommendations and interventions.",
    status: "Active",
    insight:
      "Your mentor should review your Mathematics progress this week.",
    category: "Mentor",
    risk: "Medium",
  },
  {
    id: 7,
    name: "Goal Agent",
    icon: FiTarget,
    description:
      "Tracks goals and evaluates whether the student is progressing on schedule.",
    status: "Active",
    insight:
      "You are currently 78% on track toward your semester learning goal.",
    category: "Goals",
    risk: "Low",
  },
];

/* =========================================================
   PRIORITY INSIGHTS
   ========================================================= */

const insights = [
  {
    priority: "HIGH",
    category: "Academic Risk",
    title: "Mathematics requires immediate attention",
    description:
      "Recent assessment performance indicates that Mathematics needs additional targeted practice.",
    action:
      "Complete 3 focused Mathematics practice sessions this week.",
    agent: "Risk Prediction Agent",
  },
  {
    priority: "MEDIUM",
    category: "Learning Pattern",
    title: "Study consistency decreased this week",
    description:
      "Your completed focused sessions are below your recent weekly average.",
    action:
      "Schedule one 45-minute focused session each day.",
    agent: "Learning Agent",
  },
  {
    priority: "LOW",
    category: "Career Growth",
    title: "Communication development is progressing",
    description:
      "Your career preparation activity shows positive progress in communication development.",
    action:
      "Continue with two communication practice sessions this week.",
    agent: "Career Agent",
  },
];

/* =========================================================
   RISKS
   ========================================================= */

const risks = [
  {
    name: "Mathematics",
    level: "High",
    reason: "Recent performance remains below the target range.",
    recommendation:
      "Complete targeted practice and request mentor review.",
  },
  {
    name: "Attendance",
    level: "Low",
    reason: "Attendance pattern is currently stable.",
    recommendation:
      "Maintain the current attendance level.",
  },
  {
    name: "Assignments",
    level: "Medium",
    reason:
      "Some assignments are approaching their expected completion window.",
    recommendation:
      "Prioritize pending assignments this week.",
  },
  {
    name: "Programming",
    level: "Low",
    reason:
      "Programming activity is showing consistent progress.",
    recommendation:
      "Continue practical coding sessions.",
  },
  {
    name: "Placement Readiness",
    level: "Medium",
    reason:
      "Some target-role competencies remain incomplete.",
    recommendation:
      "Strengthen Python and communication skills.",
  },
];

/* =========================================================
   AGENT ACTIVITIES
   ========================================================= */

const initialActivities = [
  {
    text: "Academic Agent analyzed semester performance",
    time: "2 min ago",
    icon: FiBookOpen,
  },
  {
    text: "Learning Agent identified 3 weak topics",
    time: "15 min ago",
    icon: FiActivity,
  },
  {
    text: "Risk Agent updated academic risk score",
    time: "32 min ago",
    icon: FiAlertTriangle,
  },
  {
    text: "Career Agent identified 2 missing skills",
    time: "1 hour ago",
    icon: FiBriefcase,
  },
  {
    text: "Mentor Agent generated mentor recommendation",
    time: "2 hours ago",
    icon: FiUsers,
  },
];

/* =========================================================
   ACTION PLAN
   ========================================================= */

const initialActionTasks = [
  {
    task: "Complete Mathematics revision",
    priority: "High",
    time: "45 min",
    reason: "Risk Agent detected a performance gap.",
    agent: "Risk Prediction Agent",
    completed: false,
  },
  {
    task: "Practice 20 aptitude questions",
    priority: "Medium",
    time: "30 min",
    reason:
      "Career preparation requires additional aptitude practice.",
    agent: "Career Agent",
    completed: false,
  },
  {
    task: "Finish Python module",
    priority: "Medium",
    time: "60 min",
    reason:
      "Python is an identified target-role skill gap.",
    agent: "Career Agent",
    completed: false,
  },
  {
    task: "Attend mentor session",
    priority: "High",
    time: "30 min",
    reason:
      "Mentor Agent recommends reviewing Mathematics progress.",
    agent: "Mentor Agent",
    completed: false,
  },
];

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function AIInsights() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [lastAnalyzed, setLastAnalyzed] =
    useState("2 minutes ago");

  const [notification, setNotification] =
    useState("");

  const [selectedAgent, setSelectedAgent] =
    useState(null);

  const [tasks, setTasks] =
    useState(initialActionTasks);

  const [agents, setAgents] =
    useState(initialAgents);

  const [activities, setActivities] =
    useState(initialActivities);

  const [analysisCount, setAnalysisCount] =
    useState(0);

  const [intelligenceScore, setIntelligenceScore] =
    useState(82);

  const [metrics, setMetrics] = useState({
    academic: 84,
    learning: 76,
    cognitive: 88,
    career: 71,
    focus: 79,
  });

  const [mentorReviewRequested, setMentorReviewRequested] =
    useState(false);

  /* =======================================================
     NOTIFICATION
  ======================================================= */

  const showNotification = (message) => {
    setNotification(message);
  };

  /* =======================================================
     RUN AI ANALYSIS
  ======================================================= */

  const runAnalysis = () => {
    if (isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setNotification("");

    setAgents((currentAgents) =>
      currentAgents.map((agent) => ({
        ...agent,
        status: "Analyzing",
      }))
    );

    setTimeout(() => {
      const variation =
        analysisCount % 2 === 0 ? 1 : -1;

      setMetrics((current) => ({
        academic: Math.min(
          100,
          Math.max(0, current.academic + variation)
        ),
        learning: Math.min(
          100,
          Math.max(0, current.learning + 2)
        ),
        cognitive: Math.min(
          100,
          Math.max(0, current.cognitive)
        ),
        career: Math.min(
          100,
          Math.max(0, current.career + 1)
        ),
        focus: Math.min(
          100,
          Math.max(0, current.focus + variation)
        ),
      }));

      setIntelligenceScore((currentScore) =>
        Math.min(
          100,
          Math.max(
            0,
            currentScore +
              (variation === 1 ? 1 : 2)
          )
        )
      );

      setAgents((currentAgents) =>
        currentAgents.map((agent) => ({
          ...agent,
          status:
            agent.id === 4
              ? "Monitoring"
              : "Active",
        }))
      );

      setLastAnalyzed("Just now");

      setAnalysisCount(
        (currentCount) =>
          currentCount + 1
      );

      const newActivity = {
        text:
          "Agentic AI completed a full intelligence analysis",
        time: "Just now",
        icon: FiCpu,
      };

      setActivities(
        (currentActivities) =>
          [newActivity, ...currentActivities].slice(
            0,
            5
          )
      );

      setIsAnalyzing(false);

      showNotification(
        "AI analysis completed successfully."
      );
    }, 2200);
  };

  /* =======================================================
     TOGGLE TASK
  ======================================================= */

  const toggleTask = (index) => {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );

    const selectedTask = tasks[index];

    if (selectedTask) {
      const message = selectedTask.completed
        ? `${selectedTask.task} marked incomplete.`
        : `${selectedTask.task} completed.`;

      showNotification(message);
    }
  };

  /* =======================================================
     GENERATE ACTION PLAN
  ======================================================= */

  const generateActionPlan = () => {
    setTasks((currentTasks) => {
      const incomplete =
        currentTasks.filter(
          (task) => !task.completed
        );

      const completed =
        currentTasks.filter(
          (task) => task.completed
        );

      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      const sortedIncomplete =
        [...incomplete].sort(
          (a, b) =>
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
        );

      return [
        ...sortedIncomplete,
        ...completed,
      ];
    });

    setActivities(
      (currentActivities) => [
        {
          text:
            "Agentic AI generated a personalized action plan",
          time: "Just now",
          icon: FiTarget,
        },
        ...currentActivities,
      ].slice(0, 5)
    );

    showNotification(
      "Personalized action plan generated by Agentic AI."
    );
  };

  /* =======================================================
     OPEN AGENT ANALYSIS
  ======================================================= */

  const openAgentAnalysis = (agent) => {
    setSelectedAgent(agent);
  };

  /* =======================================================
     CLOSE AGENT ANALYSIS
  ======================================================= */

  const closeAgentAnalysis = () => {
    setSelectedAgent(null);
  };

  /* =======================================================
     MENTOR REVIEW
  ======================================================= */

  const handleMentorReview = () => {
    setMentorReviewRequested(true);

    setActivities(
      (currentActivities) => [
        {
          text:
            "Mentor review request created from AI recommendation",
          time: "Just now",
          icon: FiUserCheck,
        },
        ...currentActivities,
      ].slice(0, 5)
    );

    showNotification(
      "Mentor review request has been created."
    );
  };

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        selectedAgent
      ) {
        closeAgentAnalysis();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedAgent]);

  /* =======================================================
     AUTO CLEAR NOTIFICATION
  ======================================================= */

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setNotification("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [notification]);

  /* =======================================================
     COMPLETED TASK COUNT
  ======================================================= */

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="ai-insights-page">

      {notification && (
        <div
          className="ai-notification"
          role="status"
          aria-live="polite"
        >
          <FiCheckCircle />
          <span>{notification}</span>
        </div>
      )}

      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="ai-page-header">
        <div className="ai-header-content">

          <div className="ai-title-row">

            <div className="ai-title-icon">
              <FiCpu />
            </div>

            <div>
              <div className="ai-title-line">

                <h1>AI Insights</h1>

                <span className="ai-live-status">
                  <span className="status-dot"></span>
                  AI System Active
                </span>

              </div>

              <p>
                Your intelligent academic and career
                intelligence center
              </p>
            </div>

          </div>

          <div className="ai-header-actions">

            <div className="last-analyzed">

              <FiClock />

              <div>
                <span>Last analyzed</span>

                <strong>
                  {lastAnalyzed}
                </strong>
              </div>

            </div>

            <button
              type="button"
              className="primary-ai-button"
              onClick={runAnalysis}
              disabled={isAnalyzing}
            >

              {isAnalyzing ? (
                <>
                  <FiRefreshCw className="spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FiPlay />
                  Run AI Analysis
                </>
              )}

            </button>

          </div>

        </div>
      </section>

      {/* ===================================================
          INTELLIGENCE OVERVIEW
      =================================================== */}

      <section className="intelligence-overview">

        <div className="section-heading">

          <div>

            <span className="section-eyebrow">
              INTELLIGENCE OVERVIEW
            </span>

            <h2>
              Student Intelligence Score
            </h2>

            <p>
              AI-generated summary of your current
              academic and career readiness.
            </p>

          </div>

          <div className="intelligence-score">

            <div className="score-number">
              {intelligenceScore}
            </div>

            <div className="score-total">
              /100
            </div>

            <span>
              {intelligenceScore >= 85
                ? "Excellent"
                : intelligenceScore >= 75
                ? "Strong"
                : "Developing"}
            </span>

          </div>

        </div>

        <div className="metrics-grid">

          <Metric
            icon={<FiBarChart2 />}
            title="Academic Performance"
            score={metrics.academic}
            status={
              metrics.academic >= 85
                ? "Excellent"
                : "Good"
            }
            text="Performance is trending upward."
          />

          <Metric
            icon={<FiActivity />}
            title="Learning Consistency"
            score={metrics.learning}
            status={
              metrics.learning >= 80
                ? "Excellent"
                : "Good"
            }
            text="Consistency can improve this week."
          />

          <Metric
            icon={<FiCpu />}
            title="Cognitive Readiness"
            score={metrics.cognitive}
            status="Excellent"
            text="Strong analytical learning capability."
          />

          <Metric
            icon={<FiBriefcase />}
            title="Career Readiness"
            score={metrics.career}
            status={
              metrics.career >= 80
                ? "Good"
                : "Needs Attention"
            }
            text="Two target-role skills need development."
          />

          <Metric
            icon={<FiCrosshair />}
            title="Focus & Productivity"
            score={metrics.focus}
            status={
              metrics.focus >= 80
                ? "Excellent"
                : "Good"
            }
            text="Focused sessions are productive."
          />

        </div>

      </section>

      {/* ===================================================
          AGENTIC AI
      =================================================== */}

      <section className="agentic-section">

        <div className="section-heading agent-heading">

          <div>

            <span className="section-eyebrow">
              AGENTIC INTELLIGENCE
            </span>

            <h2>
              Agentic AI Intelligence
            </h2>

            <p>
              Multiple AI agents continuously analyze
              your academic and career journey.
            </p>

          </div>

          <div className="agent-system-badge">
            <FiZap />
            Multi-Agent System
          </div>

        </div>

        <div className="agent-network">

          <div className="network-line"></div>

          <div className="agents-grid">

            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onView={() =>
                  openAgentAnalysis(agent)
                }
              />
            ))}

          </div>

        </div>

      </section>

      {/* ===================================================
          ACTIVITY + PRIORITY
      =================================================== */}

      <section className="two-column-section">

        <div className="panel">

          <PanelHeader
            eyebrow="REAL-TIME MONITORING"
            title="Agent Activity"
            icon={<FiActivity />}
          />

          <div className="activity-list">

            {activities.map(
              (activity, index) => {

                const ActivityIcon =
                  activity.icon;

                return (
                  <div
                    className="activity-item"
                    key={`${activity.text}-${index}`}
                  >

                    <div className="activity-icon">
                      <ActivityIcon />
                    </div>

                    <div className="activity-content">

                      <strong>
                        {activity.text}
                      </strong>

                      <span>
                        {activity.time}
                      </span>

                    </div>

                    <FiCheckCircle
                      className="activity-check"
                    />

                  </div>
                );
              }
            )}

          </div>

        </div>

        <div className="panel">

          <PanelHeader
            eyebrow="AI DETECTION"
            title="Priority Insights"
            icon={<FiFlag />}
          />

          <div className="priority-list">

            {insights.map(
              (insight, index) => (
                <InsightItem
                  insight={insight}
                  key={index}
                />
              )
            )}

          </div>

        </div>

      </section>

      {/* ===================================================
          ACTION PLAN
      =================================================== */}

      <section className="action-plan-section">

        <div className="section-heading">

          <div>

            <span className="section-eyebrow">
              PERSONALIZED EXECUTION
            </span>

            <h2>
              AI Recommended Action Plan
            </h2>

            <p>
              Agentic AI converts detected insights
              into practical next steps.
            </p>

          </div>

          <button
            type="button"
            className="secondary-ai-button"
            onClick={generateActionPlan}
          >
            <FiZap />
            Generate My Action Plan
          </button>

        </div>

        <div className="action-plan-card">

          <div className="action-plan-header">

            <div>

              <span>TODAY</span>

              <h3>
                Your AI-guided priorities
              </h3>

            </div>

            <div className="completion-count">

              {completedTasks}/{tasks.length}

              <small>
                {" "}completed
              </small>

            </div>

          </div>

          <div className="task-list">

            {tasks.map(
              (task, index) => (

                <div
                  className={`action-task ${
                    task.completed
                      ? "task-completed"
                      : ""
                  }`}
                  key={`${task.task}-${index}`}
                >

                  <button
                    type="button"
                    className="task-check"
                    onClick={() =>
                      toggleTask(index)
                    }
                    aria-label={`Mark ${
                      task.task
                    } ${
                      task.completed
                        ? "incomplete"
                        : "complete"
                    }`}
                  >

                    {task.completed && (
                      <FiCheckCircle />
                    )}

                  </button>

                  <div className="task-main">

                    <div className="task-title-row">

                      <strong>
                        {task.task}
                      </strong>

                      <span
                        className={`priority-tag ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                    </div>

                    <div className="task-meta">

                      <span>
                        <FiClock />
                        {task.time}
                      </span>

                      <span>
                        <FiCpu />
                        {task.agent}
                      </span>

                    </div>

                    <p>
                      {task.reason}
                    </p>

                  </div>

                  <FiArrowRight
                    className="task-arrow"
                  />

                </div>

              )
            )}

          </div>

        </div>

      </section>

      {/* ===================================================
          RISK + MENTOR
      =================================================== */}

      <section className="two-column-section">

        <div className="panel">

          <PanelHeader
            eyebrow="PREDICTIVE INTELLIGENCE"
            title="Academic Risk Prediction"
            icon={<FiAlertTriangle />}
          />

          <div className="overall-risk">

            <div>

              <span>
                Overall Academic Risk
              </span>

              <strong>
                MEDIUM
              </strong>

            </div>

            <div className="risk-progress">
              <span></span>
            </div>

            <p>
              Agentic AI has identified areas
              that require monitoring before they
              become larger academic issues.
            </p>

          </div>

          <div className="risk-list">

            {risks.map(
              (risk, index) => (
                <RiskItem
                  risk={risk}
                  key={index}
                />
              )
            )}

          </div>

        </div>

        <div className="panel mentor-panel">

          <PanelHeader
            eyebrow="MENTOR INTELLIGENCE"
            title="Mentor Intelligence"
            icon={<FiUsers />}
          />

          <div className="mentor-summary">

            <div className="mentor-main-number">
              3
            </div>

            <div>

              <strong>
                Students require attention
              </strong>

              <p>
                Agentic AI has generated mentor
                interventions.
              </p>

            </div>

          </div>

          <div className="mentor-stats">

            <div>
              <span>Improving</span>
              <strong>8</strong>
            </div>

            <div>
              <span>At Risk</span>
              <strong>3</strong>
            </div>

            <div>
              <span>Pending Actions</span>
              <strong>5</strong>
            </div>

          </div>

          <div className="mentor-recommendation">

            <div className="recommendation-icon">
              <FiUserCheck />
            </div>

            <div>

              <span>
                AI Recommendation
              </span>

              <strong>
                Student #102
              </strong>

              <p>
                Schedule a Mathematics mentoring
                session based on recent performance
                trends.
              </p>

            </div>

            <button
              type="button"
              className="small-outline-button"
              onClick={handleMentorReview}
              disabled={mentorReviewRequested}
            >

              {mentorReviewRequested
                ? "Review Requested"
                : "Review Student"}

              {!mentorReviewRequested && (
                <FiArrowRight />
              )}

            </button>

          </div>

        </div>

      </section>

      {/* ===================================================
          PREDICTIONS
      =================================================== */}

      <section className="prediction-section">

        <div className="section-heading">

          <div>

            <span className="section-eyebrow">
              FUTURE INTELLIGENCE
            </span>

            <h2>
              AI Predictions
            </h2>

            <p>
              Forecasts generated from available
              academic, learning and career signals.
            </p>

          </div>

          <div className="prediction-label">

            <FiCpu />

            AI Generated

          </div>

        </div>

        <div className="prediction-grid">

          <Prediction
            icon={<FiTrendingUp />}
            title="Academic Prediction"
            value="78–84%"
            text="Expected semester performance based on current learning trends."
          />

          <Prediction
            icon={<FiAlertTriangle />}
            title="Risk Prediction"
            value="Monitor"
            text="Academic risk may increase if Mathematics practice remains below 3 sessions per week."
          />

          <Prediction
            icon={<FiBriefcase />}
            title="Career Prediction"
            value={`${metrics.career}%`}
            text="Estimated current placement readiness based on target competencies."
          />

          <Prediction
            icon={<FiActivity />}
            title="Learning Prediction"
            value="+8–12%"
            text="Improved consistency may increase expected academic performance."
          />

        </div>

      </section>

      {/* ===================================================
          WORKFLOW
      =================================================== */}

      <section className="workflow-section">

        <div className="section-heading centered-heading">

          <span className="section-eyebrow">
            CONTINUOUS INTELLIGENCE LOOP
          </span>

          <h2>
            How Agentic AI Works
          </h2>

          <p>
            EducoreAI continuously converts student
            data into insights, actions and feedback.
          </p>

        </div>

        <div className="workflow">

          <WorkflowStep
            icon={<FiDatabase />}
            text="Student Data"
          />

          <WorkflowArrow />

          <WorkflowStep
            icon={<FiBarChart2 />}
            text="Data Analysis"
          />

          <WorkflowArrow />

          <WorkflowStep
            icon={<FiLayers />}
            text="Multiple AI Agents"
          />

          <WorkflowArrow />

          <WorkflowStep
            icon={<FiEye />}
            text="Insight Detection"
          />

          <WorkflowArrow />

          <WorkflowStep
            icon={<FiAlertTriangle />}
            text="Risk Prediction"
          />

          <WorkflowArrow />

          <WorkflowStep
            icon={<FiTarget />}
            text="Recommendations"
          />

          <WorkflowArrow />

          <WorkflowStep
            icon={<FiUsers />}
            text="Student + Mentor Actions"
          />

          <WorkflowArrow />

          <WorkflowStep
            icon={<FiTrendingUp />}
            text="Progress Feedback"
          />

        </div>

        <div className="feedback-loop">

          <FiRefreshCw />

          <span>
            Agents continuously re-analyze new
            progress data
          </span>

        </div>

      </section>

      {/* ===================================================
          AGENT MODAL
      =================================================== */}

      {selectedAgent && (
        <AgentAnalysisModal
          agent={selectedAgent}
          onClose={closeAgentAnalysis}
        />
      )}

    </div>
  );
}

/* =========================================================
   METRIC COMPONENT
   ========================================================= */

function Metric({
  icon,
  title,
  score,
  status,
  text,
}) {
  return (
    <div className="metric-card">

      <div className="metric-top">

        <div className="metric-icon">
          {icon}
        </div>

        <div className="metric-score">

          <strong>
            {score}
          </strong>

          <span>
            /100
          </span>

        </div>

      </div>

      <h3>
        {title}
      </h3>

      <div className="metric-bar">

        <span
          style={{
            width: `${score}%`,
          }}
        ></span>

      </div>

      <div className="metric-bottom">

        <span>
          {text}
        </span>

        <strong>
          {status}
        </strong>

      </div>

    </div>
  );
}

/* =========================================================
   AGENT CARD
   ========================================================= */

function AgentCard({
  agent,
  onView,
}) {
  const Icon = agent.icon;

  return (
    <div className="agent-card">

      <div className="agent-card-top">

        <div className="agent-icon">
          <Icon />
        </div>

        <span className="agent-status">

          <span></span>

          {agent.status}

        </span>

      </div>

      <div className="agent-card-body">

        <span className="agent-number">
          AGENT{" "}
          {String(agent.id).padStart(2, "0")}
        </span>

        <h3>
          {agent.name}
        </h3>

        <p>
          {agent.description}
        </p>

        <div className="agent-insight">

          <FiZap />

          <span>
            {agent.insight}
          </span>

        </div>

      </div>

      <button
        type="button"
        className="agent-view-button"
        onClick={onView}
      >
        View Analysis
        <FiArrowRight />
      </button>

    </div>
  );
}

/* =========================================================
   PANEL HEADER
   ========================================================= */

function PanelHeader({
  eyebrow,
  title,
  icon,
}) {
  return (
    <div className="panel-header">

      <div className="panel-heading-icon">
        {icon}
      </div>

      <div>

        <span>
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

      </div>

    </div>
  );
}

/* =========================================================
   INSIGHT ITEM
   ========================================================= */

function InsightItem({
  insight,
}) {
  return (
    <div
      className={`insight-item ${insight.priority.toLowerCase()}`}
    >

      <div className="insight-priority">

        <span>
          {insight.priority}
        </span>

      </div>

      <div className="insight-body">

        <div className="insight-category">
          {insight.category}
        </div>

        <h3>
          {insight.title}
        </h3>

        <p>
          {insight.description}
        </p>

        <div className="insight-action">

          <strong>
            Recommended:
          </strong>

          <span>
            {insight.action}
          </span>

        </div>

        <div className="insight-agent">

          <FiCpu />

          {insight.agent}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   RISK ITEM
   ========================================================= */

function RiskItem({
  risk,
}) {
  return (
    <div className="risk-item">

      <div className="risk-title">

        <strong>
          {risk.name}
        </strong>

        <span
          className={`risk-badge ${risk.level.toLowerCase()}`}
        >
          {risk.level}
        </span>

      </div>

      <p>
        {risk.reason}
      </p>

      <div className="risk-recommendation">

        <FiZap />

        <span>
          {risk.recommendation}
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   PREDICTION
   ========================================================= */

function Prediction({
  icon,
  title,
  value,
  text,
}) {
  return (
    <div className="prediction-card">

      <div className="prediction-icon">
        {icon}
      </div>

      <div className="prediction-content">

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   WORKFLOW STEP
   ========================================================= */

function WorkflowStep({
  icon,
  text,
}) {
  return (
    <div className="workflow-step">

      <div className="workflow-icon">
        {icon}
      </div>

      <span>
        {text}
      </span>

    </div>
  );
}

/* =========================================================
   WORKFLOW ARROW
   ========================================================= */

function WorkflowArrow() {
  return (
    <div className="workflow-arrow">
      <FiArrowRight />
    </div>
  );
}

/* =========================================================
   AGENT ANALYSIS MODAL
   ========================================================= */

function AgentAnalysisModal({
  agent,
  onClose,
}) {
  const Icon = agent.icon;

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
      role="presentation"
    >

      <div
        className="agent-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-modal-title"
      >

        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close analysis"
        >
          <FiX />
        </button>

        <div className="modal-agent-header">

          <div className="modal-agent-icon">
            <Icon />
          </div>

          <div>

            <span>
              AGENTIC AI ANALYSIS
            </span>

            <h2 id="agent-modal-title">
              {agent.name}
            </h2>

            <p>
              {agent.description}
            </p>

          </div>

        </div>

        <div className="modal-analysis-grid">

          <div className="modal-data-box">

            <span>
              ANALYSIS
            </span>

            <p>
              The agent analyzed the available
              academic, learning and progress
              signals associated with this area.
            </p>

          </div>

          <div className="modal-data-box">

            <span>
              DATA CONSIDERED
            </span>

            <p>
              Performance trends, recent activity,
              learning behavior and relevant platform
              signals.
            </p>

          </div>

          <div className="modal-data-box">

            <span>
              DETECTED PATTERN
            </span>

            <p>
              {agent.insight}
            </p>

          </div>

          <div className="modal-data-box">

            <span>
              CATEGORY
            </span>

            <strong>
              {agent.category}
            </strong>

          </div>

          <div className="modal-data-box">

            <span>
              RISK LEVEL
            </span>

            <strong
              className={`modal-risk ${agent.risk.toLowerCase()}`}
            >
              {agent.risk}
            </strong>

          </div>

          <div className="modal-data-box">

            <span>
              AGENT STATUS
            </span>

            <strong>
              {agent.status}
            </strong>

          </div>

        </div>

        <div className="reasoning-summary">

          <div className="reasoning-icon">
            <FiCpu />
          </div>

          <div>

            <span>
              AI REASONING SUMMARY
            </span>

            <p>
              The recommendation is based on
              detected patterns in the available
              platform data. This is a concise
              explanation of the signal used by the
              agent and does not expose hidden model
              reasoning.
            </p>

          </div>

        </div>

        <div className="modal-recommendation">

          <span>
            RECOMMENDED ACTION
          </span>

          <strong>
            Review this area and follow the
            personalized action generated by the
            Agentic AI system.
          </strong>

        </div>

        <div className="expected-impact">

          <FiTrendingUp />

          <div>

            <span>
              EXPECTED IMPACT
            </span>

            <p>
              Consistent execution of the recommended
              action can improve progress in this area
              over the next few weeks.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="modal-action-button"
          onClick={onClose}
        >
          <FiCheckCircle />
          Acknowledge Insight
        </button>

      </div>

    </div>
  );
}

export default AIInsights;