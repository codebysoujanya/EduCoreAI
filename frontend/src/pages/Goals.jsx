import { useState } from "react";
import "./Goals.css";

export default function Goals() {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);

  const addGoal = () => {
    if (goal.trim() === "") return;

    const newGoal = {
      id: Date.now(),
      title: goal,
      progress: 0,
    };

    setGoals((prev) => [...prev, newGoal]);
    setGoal("");
  };

  const increaseProgress = (id) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              progress: Math.min(g.progress + 10, 100),
            }
          : g
      )
    );
  };

  return (
    <div className="goals-page">

      {/* HEADER */}
      <div className="goals-header">

        <div className="goals-title">

          <div className="goals-icon">
            🎯
          </div>

          <div>
            <h1>Goal Tracker</h1>

            <p>
              Plan, track and achieve your learning milestones
            </p>
          </div>

        </div>

        <div className="goals-status">
          <span></span>
          LEARNING GOALS
        </div>

      </div>


      {/* ADD GOAL */}
      <section className="goal-input-card">

        <div className="section-heading">

          <div>
            <h2>Create a New Goal</h2>

            <p>
              Add a learning goal and track your progress
            </p>
          </div>

        </div>

        <div className="goal-input-box">

          <input
            type="text"
            value={goal}
            placeholder="Enter your goal (e.g. Learn React)"
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addGoal();
              }
            }}
          />

          <button onClick={addGoal}>
            + Add Goal
          </button>

        </div>

      </section>


      {/* GOALS */}
      <section className="goals-section">

        <div className="section-heading">

          <div>
            <h2>My Learning Goals</h2>

            <p>
              Monitor your progress and keep moving forward
            </p>
          </div>

          <span className="goal-count">
            {goals.length} GOALS
          </span>

        </div>


        <div className="goal-grid">

          {goals.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🎯
              </div>

              <h3>No goals yet</h3>

              <p>
                Start adding your learning goals to begin
                your journey 🚀
              </p>

            </div>

          ) : (

            goals.map((g) => (

              <div
                className="goal-card"
                key={g.id}
              >

                <div className="goal-card-header">

                  <div className="goal-card-icon">
                    🎯
                  </div>

                  <span className="goal-badge">
                    {g.progress === 100
                      ? "Completed"
                      : "In Progress"}
                  </span>

                </div>


                <h3>
                  {g.title}
                </h3>


                <div className="progress-info">

                  <span>
                    Progress
                  </span>

                  <strong>
                    {g.progress}%
                  </strong>

                </div>


                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${g.progress}%`,
                    }}
                  />

                </div>


                <div className="goal-actions">

                  <span>
                    {g.progress === 100
                      ? "Goal completed 🎉"
                      : `${100 - g.progress}% remaining`}
                  </span>

                  <button
                    onClick={() =>
                      increaseProgress(g.id)
                    }
                    disabled={g.progress === 100}
                  >
                    {g.progress === 100
                      ? "Completed"
                      : "+ Progress"}
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>


      {/* GOAL TIPS */}
      <section className="goal-tips">

        <div className="tip-card">

          <div className="tip-icon">
            💡
          </div>

          <div>
            <h3>Stay Consistent</h3>

            <p>
              Small daily improvements can help you
              achieve your learning goals faster.
            </p>
          </div>

        </div>


        <div className="tip-card">

          <div className="tip-icon">
            📈
          </div>

          <div>
            <h3>Track Your Progress</h3>

            <p>
              Update your goal progress regularly to
              stay motivated and focused.
            </p>
          </div>

        </div>


        <div className="tip-card">

          <div className="tip-icon">
            🏆
          </div>

          <div>
            <h3>Celebrate Milestones</h3>

            <p>
              Completing each milestone brings you
              closer to your bigger learning goals.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}