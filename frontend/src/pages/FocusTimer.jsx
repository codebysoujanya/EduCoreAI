import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./FocusTimer.css";

const FOCUS_TIME = 1500;

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(FOCUS_TIME);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState([]);

  // TIMER
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setSessions((old) => [
            ...old,
            {
              session: old.length + 1,
              score: 60 + Math.floor(Math.random() * 40),
            },
          ]);

          setRunning(false);
          return FOCUS_TIME;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  // AI INSIGHT
  const aiInsight = useMemo(() => {
    if (sessions.length >= 5) {
      return "🔥 Excellent consistency!";
    }

    if (sessions.length >= 2) {
      return "📈 Good progress, keep going!";
    }

    return "🧠 Start daily focus sessions.";
  }, [sessions.length]);

  // LEADERBOARD
  const leaderboard = useMemo(
    () => [
      {
        name: "You",
        score: sessions.length * 10,
      },
      {
        name: "Arjun",
        score: 80,
      },
      {
        name: "Meera",
        score: 75,
      },
      {
        name: "Ravi",
        score: 70,
      },
    ],
    [sessions.length]
  );

  return (
    <div className="focus-page">

      {/* HEADER */}
      <div className="focus-header">

        <div className="focus-title">

          <div className="focus-icon">
            🎯
          </div>

          <div>
            <h1>Focus Timer</h1>

            <p>
              Student productivity and intelligent focus tracking
            </p>
          </div>

        </div>

        <div className="focus-status">
          <span></span>
          FOCUS SYSTEM ACTIVE
        </div>

      </div>


      {/* TIMER + AI */}
      <section className="focus-top-grid">

        <div className="focus-card timer-card">

          <div className="card-heading">
            <div>
              <h2>⏱ Focus Session</h2>

              <p>
                Stay focused and complete your study session
              </p>
            </div>

            <span className="session-badge">
              25 MIN
            </span>
          </div>


          <div className="timer-display">
            {Math.floor(seconds / 60)}:
            {String(seconds % 60).padStart(2, "0")}
          </div>


          <div className="timer-state">
            {running ? "● Session in progress" : "● Ready to focus"}
          </div>


          <div className="btn-row">

            <button
              className="start-btn"
              onClick={() => setRunning(!running)}
            >
              {running ? "⏸ Pause" : "▶ Start"}
            </button>

            <button
              className="reset-btn"
              onClick={() => {
                setRunning(false);
                setSeconds(FOCUS_TIME);
              }}
            >
              ↻ Reset
            </button>

          </div>

        </div>


        <div className="focus-card ai-card">

          <div className="ai-heading">

            <div className="ai-icon">
              🧠
            </div>

            <div>
              <h2>AI Mentor Insight</h2>

              <span>
                PERSONALIZED ANALYSIS
              </span>
            </div>

          </div>

          <div className="ai-message">
            {aiInsight}
          </div>

          <p>
            Your focus performance is continuously monitored
            to provide better study recommendations.
          </p>

        </div>

      </section>


      {/* STATS */}
      <section className="focus-stats">

        <div className="focus-stat-card">

          <div className="stat-icon blue-icon">
            📊
          </div>

          <div>
            <span>FOCUS SESSIONS</span>
            <h3>{sessions.length}</h3>
          </div>

        </div>


        <div className="focus-stat-card">

          <div className="stat-icon purple-icon">
            🏆
          </div>

          <div>
            <span>PRODUCTIVITY SCORE</span>
            <h3>{sessions.length * 10}</h3>
          </div>

        </div>


        <div className="focus-stat-card">

          <div className="stat-icon orange-icon">
            🔥
          </div>

          <div>
            <span>CURRENT STATUS</span>

            <h3>
              {sessions.length > 3
                ? "High Performer"
                : "Growing"}
            </h3>
          </div>

        </div>

      </section>


      {/* PERFORMANCE ANALYTICS */}
      <section className="focus-card analytics-card">

        <div className="analytics-header">

          <div>
            <h2>📈 Performance Analytics</h2>

            <p>
              Track your focus performance across completed sessions
            </p>
          </div>

          <span className="analytics-badge">
            LIVE DATA
          </span>

        </div>


        <div className="focus-chart">

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={sessions}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 20,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#263653"
              />

              <XAxis
                dataKey="session"
                stroke="#94a3b8"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
                label={{
                  value: "Session",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#64748b",
                }}
              />

              <YAxis
                stroke="#94a3b8"
                domain={[0, 100]}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#111c31",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#ffffff",
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#3b82f6",
                }}
                activeDot={{
                  r: 7,
                }}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </section>


      {/* BOTTOM GRID */}
      <section className="focus-bottom-grid">

        {/* LEADERBOARD */}
        <div className="focus-card leaderboard-card">

          <div className="card-heading">

            <div>
              <h2>🏆 Leaderboard</h2>

              <p>
                Compare productivity scores
              </p>
            </div>

          </div>


          <div className="leaderboard-list">

            {leaderboard.map((user, i) => (

              <div
                key={i}
                className={`leaderboard-row ${
                  i === 0 ? "current-user" : ""
                }`}
              >

                <div className="leaderboard-user">

                  <span className="rank">
                    {i + 1}
                  </span>

                  <span>
                    {user.name}
                  </span>

                </div>

                <strong>
                  {user.score}
                </strong>

              </div>

            ))}

          </div>

        </div>


        {/* MENTOR VIEW */}
        <div className="focus-card mentor-card">

          <div className="mentor-heading">

            <div className="mentor-icon">
              👨‍🏫
            </div>

            <div>
              <h2>Mentor View</h2>

              <span>
                STUDENT PERFORMANCE
              </span>
            </div>

          </div>


          <div className="mentor-status">

            <div className="status-dot"></div>

            <p>
              Student is currently{" "}
              <b>
                {sessions.length > 3
                  ? "performing well 🚀"
                  : "improving 📈"}
              </b>
            </p>

          </div>


          <p className="mentor-description">
            Continue regular focus sessions to build
            consistency and improve study productivity.
          </p>

        </div>

      </section>

    </div>
  );
}