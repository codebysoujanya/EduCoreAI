import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // SAVE LOGIN DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful!");

      // REDIRECT DASHBOARD
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="brand-content">

          <h1>EduCore AI</h1>

          <p>
            Empowering students with AI-powered learning,
            mentorship, career guidance and skill tracking.
          </p>

          <div className="feature">🚀 Personalized Learning Paths</div>
          <div className="feature">👨‍🏫 Industry Expert Mentors</div>
          <div className="feature">📊 Smart Progress Tracking</div>
          <div className="feature">🎯 Career Growth Roadmaps</div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          <div className="login-badge">Welcome Back</div>

          <h2>Sign In</h2>

          <p className="subtitle">
            Continue your learning journey.
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="University Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

          </form>

          <div className="register-link">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </div>

        </div>

      </div>

    </div>
  );
}