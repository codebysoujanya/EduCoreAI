import { Link } from "react-router-dom";

import {
  FaRobot,
  FaChalkboardTeacher,
  FaChartLine,
  FaCalendarCheck,
  FaUserGraduate,
  FaBrain,
} from "react-icons/fa";

import "./Home.css";

export default function Home() {
  return (
    <div className="home">

      {/* NAVBAR */}
      <div className="topbar">
        <div className="logo">EduCore AI</div>

        <div className="nav-actions">
          <Link to="/login">Login</Link>

          <Link className="signup" to="/register">
            Get Started
          </Link>

          <Link to="/student">
            Student Dashboard
          </Link>
        </div>
      </div>

      {/* HERO SPLIT SECTION */}
      <section className="hero">

        <div className="hero-left">
          <h1>
            AI-Powered <span>Student & Mentor</span> Platform
          </h1>

          <p>
            Learn smarter, track progress, and connect with expert mentors
            using AI-driven guidance and personalized learning paths.
          </p>

          <div className="cta">
            <Link to="/register" className="primary-btn">
              Start Learning
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>

          <div className="mini-tags">
            <span>🚀 Smart Learning</span>
            <span>📊 Progress Tracking</span>
            <span>👨‍🏫 Expert Mentors</span>
          </div>
        </div>

        <div className="hero-right">

          <div className="glass-card">
            <FaBrain size={40} />
            <h3>AI Study Assistant</h3>
            <p>Get instant answers & learning guidance</p>
          </div>

          <div className="glass-card">
            <FaUserGraduate size={40} />
            <h3>Student Dashboard</h3>
            <p>Track progress & performance</p>
          </div>

          <div className="glass-card">
            <FaChalkboardTeacher size={40} />
            <h3>Mentor Connect</h3>
            <p>Talk to real industry mentors</p>
          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="home-stats">

        <div>
          <h2>10K+</h2>
          <p>Students</p>
        </div>

        <div>
          <h2>500+</h2>
          <p>Mentors</p>
        </div>

        <div>
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>

      </section>

      {/* FEATURES */}
      <section className="features">

        <h2>Platform Features</h2>

        <div className="grid">

          <div className="card">
            <FaRobot className="icon" />
            <h3>AI Learning Assistant</h3>
            <p>
              Personalized study plans powered by AI.
            </p>
          </div>

          <div className="card">
            <FaChartLine className="icon" />
            <h3>Analytics Dashboard</h3>
            <p>
              Track your learning progress visually.
            </p>
          </div>

          <div className="card">
            <FaChalkboardTeacher className="icon" />
            <h3>Mentor Support</h3>
            <p>
              Connect with experienced mentors anytime.
            </p>
          </div>

          <div className="card">
            <FaCalendarCheck className="icon" />
            <h3>Smart Scheduling</h3>
            <p>
              AI builds your daily study timetable.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bottom-cta">

        <h2>
          Start Your AI Learning Journey Today
        </h2>

        <Link to="/register">
          Join EduCore AI →
        </Link>

      </section>

    </div>
  );
}