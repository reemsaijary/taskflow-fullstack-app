import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import api from "../api/axios";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/dashboard.css";
import "../styles/tasks.css";

function TasksPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks/");
        setTasks(response.data);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login", { replace: true });
          return;
        }

        setError("Could not load your tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return tasks;
    }

    return tasks.filter((task) => {
      const title = task.title?.toLowerCase() || "";
      const description = task.description?.toLowerCase() || "";
      const category = task.category_name?.toLowerCase() || "";

      return (
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      );
    });
  }, [tasks, searchQuery]);

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

        <main className="tasks-main">
          <section className="tasks-header">
            <div>
              <span className="tasks-eyebrow">Task management</span>
              <h1>My Tasks</h1>
              <p>
                Create, organize, and track everything you need to finish.
              </p>
            </div>

            <button className="create-task-button" type="button">
              <Plus size={19} />
              Create task
            </button>
          </section>

          <section className="tasks-toolbar">
            <label className="tasks-search">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search by title, description, or category..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>

            <div className="tasks-count">
              {filteredTasks.length} task
              {filteredTasks.length === 1 ? "" : "s"}
            </div>
          </section>

          {isLoading && (
            <p className="tasks-message">Loading tasks...</p>
          )}

          {error && (
            <p className="tasks-message error">{error}</p>
          )}

          {!isLoading && !error && filteredTasks.length === 0 && (
            <section className="tasks-empty-state">
              <h2>No tasks found</h2>
              <p>
                Create your first task or try a different search.
              </p>
            </section>
          )}

          {!isLoading && !error && filteredTasks.length > 0 && (
            <section className="tasks-grid">
              {filteredTasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div className="task-card-top">
                    <span className={`task-priority ${task.priority?.toLowerCase()}`}>
                      {task.priority || "No priority"}
                    </span>

                    <span className={`task-card-status ${task.status?.toLowerCase()}`}>
                      {task.status?.replace("_", " ") || "Unknown"}
                    </span>
                  </div>

                  <div className="task-card-content">
                    <p className="task-category">
                      {task.category_name || "No category"}
                    </p>

                    <h2>{task.title}</h2>

                    <p className="task-description">
                      {task.description || "No description provided."}
                    </p>
                  </div>

                  <div className="task-card-footer">
                    <span>
                      Due: {task.due_date || "No due date"}
                    </span>

                    <span>{task.progress ?? 0}% complete</span>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default TasksPage;