import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-icon">
          🧠
        </div>

        <span>EduCore AI</span>
      </Link>

      {/* NAVIGATION */}
      <div className="navbar-links">

        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/login"
          className={location.pathname === "/login" ? "active" : ""}
        >
          Login
        </Link>

        <Link
          to="/register"
          className={
            location.pathname === "/register" ? "active" : ""
          }
        >
          Register
        </Link>

      </div>

    </nav>
  );
}