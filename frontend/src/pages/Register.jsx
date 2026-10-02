import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "",
    department: "",
    year: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);

      alert("Registration Successful!");

      // GO TO LOGIN
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <div className="register-left">
        <div className="brand">
          <h1>EduCore AI</h1>

          <p>
            AI-powered student success and mentoring platform designed
            to help students learn, grow and achieve their career goals.
          </p>

          <div className="feature-list">
            <div className="feature">🚀 Personalized AI Learning Paths</div>
            <div className="feature">👨‍🏫 Connect With Industry Mentors</div>
            <div className="feature">📊 Smart Progress Analytics</div>
            <div className="feature">🎯 Career Guidance & Roadmaps</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">

        <form onSubmit={handleSubmit} className="register-card">

          <h2>Create Account</h2>

          <input name="name" placeholder="Full Name" onChange={handleChange} required />

          <input name="email" placeholder="University Email" onChange={handleChange} required />

          <input name="college" placeholder="College / University" onChange={handleChange} required />

          <select name="department" onChange={handleChange} required>
            <option value="">Select Department</option>
            <option>Computer Science</option>
            <option>Information Science</option>
            <option>Electronics</option>
            <option>Mechanical</option>
            <option>Civil</option>
            <option>MBA</option>
          </select>

          <select name="year" onChange={handleChange} required>
            <option value="">Current Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>

          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <button type="submit">Create Account</button>

          <p>
            Already have account? <Link to="/login">Login</Link>
          </p>

        </form>

      </div>

    </div>
  );
}