import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaBrain,
  FaChartLine,
  FaFire,
  FaTrophy,
  FaUserGraduate,
} from "react-icons/fa";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) return;

    axios
      .get(`http://localhost:5000/api/students/${user.id}`)
      .then((res) => setStudent(res.data.student))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h1>EduCore AI Dashboard</h1>
        <p>Smart Learning Analytics System</p>
      </div>

      {/* HERO */}
      <div className="hero">
        <FaBrain className="hero-icon" />

        <div>
          <h2>AI Powered Learning Intelligence</h2>
          <p>
            Track performance and improve using AI insights
          </p>
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid">

        <div
          className="card blue"
          onClick={() => navigate("/ai-insights")}
        >
          <FaBrain />
          <h3>AI Study Brain</h3>
          <p>Open AI Insights</p>
        </div>

        <div
          className="card red"
          onClick={() => navigate("/goals")}
        >
          <FaChartLine />
          <h3>Goals Tracker</h3>
          <p>Manage your study goals</p>
        </div>

        <div
          className="card yellow"
          onClick={() => navigate("/focus-timer")}
        >
          <FaFire />
          <h3>Focus Timer</h3>
          <p>Pomodoro Study Mode</p>
        </div>

        <div
          className="card green"
          onClick={() => navigate("/placement")}
        >
          <FaTrophy />
          <h3>Placement Score</h3>
          <p>Check readiness level</p>
        </div>

        <div
          className="card purple"
          onClick={() => navigate("/student")}
        >
          <FaUserGraduate />
          <h3>Student Profile</h3>
          <p>View details</p>
        </div>

      </div>

      {/* STATS */}
      <div className="stats">

        <div className="stat-card">
          <h2>{student?.attendance ?? "0"}</h2>
          <p>Study Streak</p>
        </div>

        <div className="stat-card">
          <h2>{student?.riskScore ?? "0"}</h2>
          <p>Risk Score</p>
        </div>

        <div className="stat-card">
          <h2>{student?.personality ?? "Level 1"}</h2>
          <p>Level</p>
        </div>

      </div>

    </div>
  );
}