import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/dashboard.css";

function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`dashboard-page ${
        isSidebarCollapsed ? "sidebar-is-collapsed" : ""
      }`}
    >
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
      />

      <div className="dashboard-content">
        <Navbar
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <span className="dashboard-eyebrow">
                Your productivity hub
              </span>

              <h1>
                Welcome back, <span>Reem</span> 👋
              </h1>

              <p>
                Track your tasks, review your progress, and stay focused
                on what matters most.
              </p>
            </div>

            <button className="hero-action-button" type="button">
              + Create task
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;