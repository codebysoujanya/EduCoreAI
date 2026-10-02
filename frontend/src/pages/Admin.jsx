import "./Admin.css";

export default function Admin() {
  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Control Center</h1>
          <p>
            Manage students, mentors, analytics and platform performance
          </p>
        </div>

        <button className="admin-btn">
          + Add Mentor
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <h2>2,458</h2>
          <p>Total Students</p>
        </div>

        <div className="stat-card">
          <h2>186</h2>
          <p>Active Mentors</p>
        </div>

        <div className="stat-card">
          <h2>92%</h2>
          <p>Student Success Rate</p>
        </div>

        <div className="stat-card">
          <h2>1,240</h2>
          <p>AI Reports Generated</p>
        </div>

      </div>

      {/* ADMIN GRID */}
      <div className="admin-grid">

        {/* RECENT STUDENTS */}
        <div className="panel">
          <h3>Recent Students</h3>

          <div className="user-row">
            <span>Soujanya G</span>
            <span className="status active">Active</span>
          </div>

          <div className="user-row">
            <span>Rahul Kumar</span>
            <span className="status learning">Learning</span>
          </div>

          <div className="user-row">
            <span>Ananya Rao</span>
            <span className="status completed">Completed</span>
          </div>
        </div>

        {/* PLATFORM ANALYTICS */}
        <div className="panel">
          <h3>Platform Analytics</h3>

          <div className="analytics-box">

            <div className="analytics-item">
              <h2>78%</h2>
              <p>Engagement Rate</p>
            </div>

            <div className="analytics-item">
              <h2>95%</h2>
              <p>Attendance Rate</p>
            </div>

          </div>
        </div>

      </div>

      {/* SYSTEM OVERVIEW */}
      <div className="panel full-width">

        <div className="panel-heading">
          <div>
            <h3>System Overview</h3>
            <p>
              Overview of EduCore AI platform services and features
            </p>
          </div>
        </div>

        <p className="system-description">
          EduCore AI is actively monitoring student performance,
          mentor engagement, attendance tracking, AI risk analysis,
          personalized learning recommendations and career growth metrics.
        </p>

        {/* FEATURES */}
        <div className="feature-grid">

          <div className="feature-card">
            <span>🤖</span>
            <p>AI Insights</p>
          </div>

          <div className="feature-card">
            <span>📊</span>
            <p>Performance Tracking</p>
          </div>

          <div className="feature-card">
            <span>🎯</span>
            <p>Goal Management</p>
          </div>

          <div className="feature-card">
            <span>👨‍🏫</span>
            <p>Mentor Matching</p>
          </div>

          <div className="feature-card">
            <span>📅</span>
            <p>Session Booking</p>
          </div>

          <div className="feature-card">
            <span>🏆</span>
            <p>Leaderboard</p>
          </div>

        </div>

      </div>

    </div>
  );
}