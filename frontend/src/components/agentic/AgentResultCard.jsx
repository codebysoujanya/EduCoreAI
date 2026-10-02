const AgentResultCard = ({ result }) => {

  const formatMessage = (message) => {

    if (!message) return null;

    return message
      .trim()
      .split("\n")
      .map((line, index) => {

        const text = line.trim();

        if (!text) {
          return (
            <div
              key={index}
              className="result-space"
            />
          );
        }

        /* SECTION HEADING */

        if (text.endsWith(":")) {
          return (
            <div
              key={index}
              className="result-heading"
            >
              {text}
            </div>
          );
        }

        /* BULLET POINT */

        if (text.startsWith("•")) {
          return (
            <div
              key={index}
              className="result-bullet"
            >
              {text}
            </div>
          );
        }

        /* NUMBERED POINT */

        if (/^\d+\./.test(text)) {
          return (
            <div
              key={index}
              className="result-number"
            >
              {text}
            </div>
          );
        }

        /* NORMAL TEXT */

        return (
          <div
            key={index}
            className="result-line"
          >
            {text}
          </div>
        );

      });

  };


  return (

    <div
      className={`agent-result-card ${
        result.priority || "medium"
      }`}
    >

      {/* =========================
          AGENT HEADER
      ========================= */}

      <div className="result-header">

        <div className="result-agent">

          <div className="result-icon">
            {result.icon || "🤖"}
          </div>

          <div>

            <h3>
              {result.agent || "AI Agent"}
            </h3>

            <span className="result-completed">
              ● Analysis Completed
            </span>

          </div>

        </div>


        <span
          className={`priority ${
            result.priority || "medium"
          }`}
        >
          {result.priority || "medium"}
        </span>

      </div>


      {/* =========================
          RESULT TITLE
      ========================= */}

      <h4>
        {result.title || "Student Analysis"}
      </h4>


      {/* =========================
          AI ANALYSIS
      ========================= */}

      <div className="result-description">

        {formatMessage(result.message)}

      </div>


      {/* =========================
          STUDENT SUGGESTION
      ========================= */}

      <div className="student-suggestion">

        <div className="suggestion-title">
          💡 SUGGESTIONS FOR YOU
        </div>

        <div className="suggestion-content">

          {result.suggestions ? (
            Array.isArray(result.suggestions) ? (
              result.suggestions.map(
                (suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                  >
                    <span>✓</span>
                    <p>{suggestion}</p>
                  </div>
                )
              )
            ) : (
              <p>{result.suggestions}</p>
            )
          ) : (
            <div className="suggestion-item">
              <span>✓</span>
              <p>
                Follow the recommended study
                strategy and maintain consistent
                progress.
              </p>
            </div>
          )}

        </div>

      </div>


      {/* =========================
          ACTION PLAN
      ========================= */}

      <div className="agent-action">

        <span>
          🎯 YOUR NEXT ACTION
        </span>

        <p>
          {result.action ||
            "Start with the most important recommendation and follow it consistently."}
        </p>

      </div>

    </div>

  );

};

export default AgentResultCard;