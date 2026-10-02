import "../styles/mentors.css";

export default function MentorCard({ mentor }) {
  return (
    <div className="mentor-card">
      <div className="mentor-top">
        <div className="avatar">{mentor.name[0]}</div>
        <div>
          <h3>{mentor.name}</h3>
          <p>{mentor.role}</p>
        </div>
      </div>

      <div className="mentor-info">
        <span>⭐ {mentor.rating}</span>
        <span>{mentor.experience}</span>
      </div>

      {/* SKILLS */}
      <div className="skills">
        {(mentor.skills || []).map((skill, i) => (
          <span key={i}>{skill}</span>
        ))}
      </div>

      {/* SESSIONS */}
      <div className="sessions">
        <h4>Session Types</h4>
        {(mentor.sessions || []).map((s, i) => (
          <div key={i} className="session-badge">
            {s}
          </div>
        ))}
      </div>

      <button className="btn">View Profile</button>
    </div>
  );
}