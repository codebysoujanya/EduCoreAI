const AgentCard = ({
  icon = "🤖",
  name = "AI Agent",
  description = "Intelligent analysis and personalized guidance.",
  status = "Online",
  active = false,
  onClick,
}) => {
  const isMonitoring = status
    .toLowerCase()
    .includes("monitor");

  return (
    <button
      type="button"
      className={`agent-card ${
        active ? "agent-active" : ""
      }`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Select ${name}`}
    >

      <div className="agent-card-header">

        <div className="agent-icon-wrapper">

          <div className="agent-icon">
            {icon}
          </div>

          {active && (
            <span className="agent-pulse"></span>
          )}

        </div>

        <span
          className={`agent-status ${
            isMonitoring
              ? "monitoring"
              : "ready"
          }`}
        >
          <span className="agent-status-dot"></span>

          {status}
        </span>

      </div>

      <div className="agent-card-content">

        <h3>{name}</h3>

        <p>{description}</p>

      </div>

      <div className="agent-card-footer">

        <span>
          {active
            ? "Agent selected"
            : "Select agent"}
        </span>

        <span className="agent-arrow">
          →
        </span>

      </div>

      {active && (
        <div className="agent-active-line"></div>
      )}

    </button>
  );
};

export default AgentCard;