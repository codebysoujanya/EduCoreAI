import { useLocation, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaChartLine,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBrain,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaChartLine />,
    },
    {
      name: "Student",
      path: "/student",
      icon: <FaUserGraduate />,
    },
    {
      name: "Mentors",
      path: "/mentors",
      icon: <FaChalkboardTeacher />,
    },
    {
      name: "AI Insights",
      path: "/ai-insights",
      icon: <FaBrain />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUserCircle />,
    },
    {
      name: "Admin",
      path: "/admin",
      icon: <FaUserShield />,
    },
  ];

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">

        <div className="sidebar-logo-icon">
          <FaBrain />
        </div>

        <h2>EduCore AI</h2>

      </div>


      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => {

          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              className={isActive ? "active" : ""}
              onClick={() => navigate(item.path)}
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span className="sidebar-menu-text">
                {item.name}
              </span>

            </button>
          );

        })}

      </nav>

    </aside>
  );
}