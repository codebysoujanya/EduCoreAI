import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Student from "./pages/Student";
import Mentors from "./pages/Mentors";

import AIInsights from "./pages/AIInsights";
import AiPersonalSuggestion from "./pages/AiPersonalSuggestion";
import AgenticAI from "./pages/AgenticAI";

import Goals from "./pages/Goals";
import FocusTimer from "./pages/FocusTimer";
import Placement from "./pages/Placement";

import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

import "./App.css";

function App() {
  const location = useLocation();

  // Pages where Sidebar should NOT appear
  const hideSidebarRoutes = [
    "/",
    "/login",
    "/register",
  ];

  const showSidebar = !hideSidebarRoutes.includes(
    location.pathname
  );

  return (
    <div className="app-layout">

      {/* MAIN LAYOUT */}
      <div className="main-layout">

        {/* SIDEBAR */}
        {showSidebar && <Sidebar />}

        {/* PAGE CONTENT */}
        <main className="page-content">

          <Routes>

            {/* =========================
                PUBLIC PAGES
            ========================= */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* =========================
                DASHBOARD PAGES
            ========================= */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/student"
              element={<Student />}
            />

            <Route
              path="/mentors"
              element={<Mentors />}
            />

            <Route
              path="/ai-insights"
              element={<AIInsights />}
            />


            {/* =========================
                AI FEATURES
            ========================= */}

            <Route
              path="/ai-suggestions"
              element={<AiPersonalSuggestion />}
            />

            <Route
              path="/agentic-ai"
              element={<AgenticAI />}
            />


            {/* =========================
                STUDENT FEATURES
            ========================= */}

            <Route
              path="/goals"
              element={<Goals />}
            />

            <Route
              path="/focus-timer"
              element={<FocusTimer />}
            />

            <Route
              path="/placement"
              element={<Placement />}
            />


            {/* =========================
                USER PAGES
            ========================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/admin"
              element={<Admin />}
            />

          </Routes>

        </main>
      </div>
    </div>
  );
}

export default App;