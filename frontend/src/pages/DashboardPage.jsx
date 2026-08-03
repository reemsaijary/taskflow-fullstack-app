import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import DashboardStats from "../components/dashboard/DashboardStats";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import RecentTasks from "../components/dashboard/RecentTasks";
import "../styles/dashboard.css";

const initialStats = {
  total_tasks: 0,
  todo_tasks: 0,
  in_progress_tasks: 0,
  completed_tasks: 0,
  overdue_tasks: 0,
  due_today: 0,
  completion_rate: 0,
};

function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/dashboard/");
        setStats(response.data);
        const tasksResponse = await api.get("/tasks/");
        setTasks(tasksResponse.data);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login", { replace: true });
          return;
        }

        setError("Could not load dashboard statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-page">
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

          {isLoading && (
            <p className="dashboard-status-message">
              Loading dashboard statistics...
            </p>
          )}

          {error && (
            <p className="dashboard-status-message error">
              {error}
            </p>
          )}

          {!isLoading && !error && (
            <DashboardStats stats={stats} />
          )}

         <RecentTasks tasks={tasks} />
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;