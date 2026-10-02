import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="profile-page">

      {/* Profile Header */}
      <div className="profile-header">

        <div className="profile-info">

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
          />

          <div className="profile-details">

            <h1>{user?.name || "Soujanya G"}</h1>

            <p className="profile-email">
              {user?.email || "student@educore.ai"}
            </p>

            <div className="tags">
              <span>Computer Science</span>
              <span>3rd Year</span>
              <span>AI Learner</span>
            </div>

          </div>

        </div>

        <button className="edit-btn">
          Edit Profile
        </button>

      </div>


      {/* Stats */}
      <div className="stats-grid">

        <div className="stat-card">
          <h2>92%</h2>
          <p>AI Score</p>
        </div>

        <div className="stat-card">
          <h2>25</h2>
          <p>Study Streak</p>
        </div>

        <div className="stat-card">
          <h2>12</h2>
          <p>Courses</p>
        </div>

        <div className="stat-card">
          <h2>8</h2>
          <p>Mentors</p>
        </div>

      </div>


      {/* Learning Progress */}
      <div className="section">

        <div className="section-title">
          <h2>Learning Progress</h2>
          <span>Overall Performance</span>
        </div>

        <div className="progress-card">

          <div className="progress-item">
            <div className="progress-label">
              <span>Frontend Development</span>
              <strong>85%</strong>
            </div>

            <div className="bar">
              <div style={{ width: "85%" }}></div>
            </div>
          </div>


          <div className="progress-item">
            <div className="progress-label">
              <span>Java Programming</span>
              <strong>75%</strong>
            </div>

            <div className="bar">
              <div style={{ width: "75%" }}></div>
            </div>
          </div>


          <div className="progress-item">
            <div className="progress-label">
              <span>Data Structures</span>
              <strong>65%</strong>
            </div>

            <div className="bar">
              <div style={{ width: "65%" }}></div>
            </div>
          </div>

        </div>

      </div>


      {/* Skills */}
      <div className="section">

        <div className="section-title">
          <h2>Skills & Badges</h2>
          <span>Technical Skills</span>
        </div>

        <div className="skills">

          <span>React</span>
          <span>Java</span>
          <span>MongoDB</span>
          <span>Node.js</span>
          <span>AI Fundamentals</span>
          <span>Problem Solving</span>

        </div>

      </div>


      {/* Achievements */}
      <div className="section">

        <div className="section-title">
          <h2>Achievements</h2>
          <span>Your Milestones</span>
        </div>

        <div className="achievement-grid">

          <div className="achievement">
            🏆
            <span>Top Performer</span>
          </div>

          <div className="achievement">
            🔥
            <span>25 Day Streak</span>
          </div>

          <div className="achievement">
            🎯
            <span>Goal Achiever</span>
          </div>

          <div className="achievement">
            🤖
            <span>AI Champion</span>
          </div>

        </div>

      </div>


      {/* Activity */}
      <div className="section">

        <div className="section-title">
          <h2>Recent Activity</h2>
          <span>Latest Updates</span>
        </div>

        <div className="activity-card">

          <p>
            <span>✅</span>
            Completed React Course
          </p>

          <p>
            <span>🤖</span>
            Generated AI Report
          </p>

          <p>
            <span>📅</span>
            Booked Mentor Session
          </p>

          <p>
            <span>📈</span>
            Improved Score by 12%
          </p>

        </div>

      </div>


      {/* Logout */}
      <div className="logout-section">

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}