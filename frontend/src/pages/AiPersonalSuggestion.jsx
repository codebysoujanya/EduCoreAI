import { useState, useRef, useEffect } from "react";
import "./AiPersonalSuggestion.css";

export default function AiPersonalSuggestion() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text:
        "Hi 👋 I'm your EduCore AI Mentor. I can analyze your academic performance, study habits, goals and placement preparation.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] =
    useState("Personal Mentor");

  const userId = "user_123";

  const chatRef = useRef(null);

  /* =========================
     AUTO SCROLL CHAT
  ========================= */

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  /* =========================
     DETECT AI AGENT
  ========================= */

  const detectAgent = (question) => {
    const text = question.toLowerCase();

    if (
      text.includes("risk") ||
      text.includes("marks") ||
      text.includes("attendance") ||
      text.includes("academic")
    ) {
      return "Academic Risk Agent";
    }

    if (
      text.includes("study") ||
      text.includes("exam") ||
      text.includes("revision") ||
      text.includes("learn")
    ) {
      return "Study Planner Agent";
    }

    if (
      text.includes("career") ||
      text.includes("job") ||
      text.includes("placement") ||
      text.includes("resume")
    ) {
      return "Career Agent";
    }

    if (
      text.includes("focus") ||
      text.includes("productivity") ||
      text.includes("concentration")
    ) {
      return "Focus Agent";
    }

    return "Personal Mentor";
  };

  /* =========================
     TYPEWRITER EFFECT
  ========================= */

  const typeWriter = (text, messageId) => {
    let i = 0;

    const interval = setInterval(() => {
      i++;

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                text: text.slice(0, i),
              }
            : message
        )
      );

      if (i >= text.length) {
        clearInterval(interval);
        setLoading(false);
        setActiveAgent("Personal Mentor");
      }
    }, 20);
  };

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();

    const agent = detectAgent(question);

    setActiveAgent(agent);

    const userMsg = {
      id: Date.now(),
      type: "user",
      text: question,
    };

    const aiMessageId = Date.now() + 1;

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: aiMessageId,
        type: "ai",
        text: "",
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: question,
            userId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      typeWriter(
        data.reply ||
          "I could not generate a response.",
        aiMessageId
      );
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === aiMessageId
            ? {
                ...message,
                text:
                  "⚠️ I couldn't connect to the AI server. Please check that the backend is running.",
              }
            : message
        )
      );

      setLoading(false);
      setActiveAgent("Personal Mentor");
    }
  };

  /* =========================
     QUICK PROMPT
  ========================= */

  const setPrompt = (prompt) => {
    setInput(prompt);
  };

  /* =========================
     VOICE INPUT
  ========================= */

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      setInput(
        event.results[0][0].transcript
      );
    };

    recognition.start();
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="ai-page">

      {/* ================= HEADER ================= */}

      <div className="ai-header">

        <div className="ai-header-left">

          <div className="ai-main-icon">
            🤖
          </div>

          <div>
            <h1>Agentic AI Mentor</h1>

            <p>
              Intelligent student mentoring powered by
              specialized AI agents
            </p>
          </div>

        </div>

        <div className="ai-system-status">
          <span></span>
          AI SYSTEM ONLINE
        </div>

      </div>

      {/* ================= AGENT NETWORK ================= */}

      <section className="agent-panel">

        <div className="agent-panel-header">

          <div>
            <h2>AI Agent Network</h2>

            <p>
              Specialized agents collaborate to support
              your academic and career growth
            </p>
          </div>

          <span>
            5 AGENTS
          </span>

        </div>

        <div className="agent-grid">

          {/* Academic Risk */}

          <div
            className={`agent-item ${
              activeAgent ===
              "Academic Risk Agent"
                ? "active"
                : ""
            }`}
          >

            <div className="agent-item-icon">
              🎯
            </div>

            <div>
              <h3>Academic Risk</h3>
              <p>Performance analysis</p>
            </div>

            <span className="agent-online">
              ●
            </span>

          </div>

          {/* Study Planner */}

          <div
            className={`agent-item ${
              activeAgent ===
              "Study Planner Agent"
                ? "active"
                : ""
            }`}
          >

            <div className="agent-item-icon">
              📚
            </div>

            <div>
              <h3>Study Planner</h3>
              <p>Learning plans</p>
            </div>

            <span className="agent-online">
              ●
            </span>

          </div>

          {/* Career */}

          <div
            className={`agent-item ${
              activeAgent === "Career Agent"
                ? "active"
                : ""
            }`}
          >

            <div className="agent-item-icon">
              🚀
            </div>

            <div>
              <h3>Career Agent</h3>
              <p>Placement guidance</p>
            </div>

            <span className="agent-online">
              ●
            </span>

          </div>

          {/* Focus */}

          <div
            className={`agent-item ${
              activeAgent === "Focus Agent"
                ? "active"
                : ""
            }`}
          >

            <div className="agent-item-icon">
              🧠
            </div>

            <div>
              <h3>Focus Agent</h3>
              <p>Productivity support</p>
            </div>

            <span className="agent-online">
              ●
            </span>

          </div>

          {/* Personal Mentor */}

          <div
            className={`agent-item ${
              activeAgent === "Personal Mentor"
                ? "active"
                : ""
            }`}
          >

            <div className="agent-item-icon">
              💡
            </div>

            <div>
              <h3>Personal Mentor</h3>
              <p>Personalized guidance</p>
            </div>

            <span className="agent-online">
              ●
            </span>

          </div>

        </div>

      </section>

      {/* ================= CHAT ================= */}

      <section className="ai-chat-card">

        {/* CHAT HEADER */}

        <div className="chat-header">

          <div className="chat-agent">

            <div className="chat-avatar">
              🤖
            </div>

            <div>

              <h2>AI Mentor</h2>

              <span>
                ● {activeAgent}
              </span>

            </div>

          </div>

          <div className="chat-badge">
            AGENTIC MODE
          </div>

        </div>

        {/* CHAT AREA */}

        <div
          className="ai-chat"
          ref={chatRef}
        >

          {messages.map((message) => (

            <div
              key={message.id}
              className={`message-row ${message.type}`}
            >

              {message.type === "ai" && (
                <div className="message-avatar">
                  🤖
                </div>
              )}

              <div className="msg">
                {message.text}
              </div>

              {message.type === "user" && (
                <div className="message-avatar user-avatar">
                  👤
                </div>
              )}

            </div>

          ))}

          {/* THINKING DOTS */}

          {loading && (
            <div className="message-row ai">

              <div className="message-avatar">
                🤖
              </div>

              <div className="msg dots">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>
          )}

        </div>

        {/* ================= QUICK PROMPTS ================= */}

        <div className="quick-prompts">

          <button
            onClick={() =>
              setPrompt(
                "Analyze my academic performance and give me suggestions."
              )
            }
          >
            🎯 Academic Risk
          </button>

          <button
            onClick={() =>
              setPrompt(
                "Create a study plan for my upcoming exams."
              )
            }
          >
            📚 Study Plan
          </button>

          <button
            onClick={() =>
              setPrompt(
                "How can I improve my placement readiness?"
              )
            }
          >
            🚀 Placement
          </button>

          <button
            onClick={() =>
              setPrompt(
                "How can I improve my focus and productivity?"
              )
            }
          >
            🧠 Focus
          </button>

        </div>

        {/* ================= INPUT ================= */}

        <div className="ai-input">

          <button
            className="voice-btn"
            onClick={startVoice}
            title="Voice input"
          >
            🎤
          </button>

          <input
            value={input}
            placeholder="Ask your AI mentor anything..."
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "..." : "➤"}
          </button>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="ai-footer">

          <span>
            🔒 Your conversations are used for
            personalized mentoring
          </span>

          <span>
            EduCore AI Agentic System
          </span>

        </div>

      </section>

    </div>
  );
}