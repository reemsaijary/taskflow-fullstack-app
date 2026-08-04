import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import api from "../api/axios";

import CreateTaskModal from "../components/tasks/CreateTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/dashboard.css";
import "../styles/tasks.css";

function TasksPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasksPageData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [tasksResponse, categoriesResponse] =
          await Promise.all([
            api.get("/tasks/"),
            api.get("/categories/"),
          ]);

        setTasks(tasksResponse.data);
        setCategories(categoriesResponse.data);
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

    fetchTasksPageData();
  }, [navigate]);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return tasks.filter((task) => {
      const title = task.title?.toLowerCase() || "";
      const description =
        task.description?.toLowerCase() || "";
      const categoryName =
        task.category_name?.toLowerCase() || "";

      const matchesSearch =
        !normalizedQuery ||
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        categoryName.includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        task.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "ALL" ||
        String(task.category) === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  const filtersAreActive =
    searchQuery.trim() !== "" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    categoryFilter !== "ALL";

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login", { replace: true });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
  };

  const handleTaskCreated = (newTask) => {
    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );
  };

  const handleOpenDeleteModal = (task) => {
    setTaskToDelete(task);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setTaskToDelete(null);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await api.delete(
        `/tasks/${taskToDelete.id}/`
      );

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskToDelete.id
        )
      );

      setTaskToDelete(null);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        navigate("/login", { replace: true });
        return;
      }

      setError("Could not delete the task.");
    } finally {
      setIsDeleting(false);
    }
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
              <span className="tasks-eyebrow">
                Task management
              </span>

              <h1>My Tasks</h1>

              <p>
                Create, organize, and track everything
                you need to finish.
              </p>
            </div>

            <button
              className="create-task-button"
              type="button"
              onClick={() =>
                setIsCreateModalOpen(true)
              }
            >
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
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
              />
            </label>

            <div className="tasks-filters">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                aria-label="Filter tasks by status"
              >
                <option value="ALL">
                  All statuses
                </option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="COMPLETED">
                  Completed
                </option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target.value
                  )
                }
                aria-label="Filter tasks by priority"
              >
                <option value="ALL">
                  All priorities
                </option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">
                  Medium
                </option>
                <option value="HIGH">High</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
                aria-label="Filter tasks by category"
              >
                <option value="ALL">
                  All categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={String(category.id)}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="tasks-toolbar-bottom">
            <div className="tasks-count">
              {filteredTasks.length} task
              {filteredTasks.length === 1
                ? ""
                : "s"}
            </div>

            {filtersAreActive && (
              <button
                className="clear-filters-button"
                type="button"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          {isLoading && (
            <p className="tasks-message">
              Loading tasks...
            </p>
          )}

          {error && (
            <p className="tasks-message error">
              {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            filteredTasks.length === 0 && (
              <section className="tasks-empty-state">
                <h2>No tasks found</h2>

                <p>
                  {filtersAreActive
                    ? "No tasks match your current filters."
                    : "Create your first task to get started."}
                </p>

                {filtersAreActive && (
                  <button
                    className="clear-filters-button empty-state-button"
                    type="button"
                    onClick={handleClearFilters}
                  >
                    Clear filters
                  </button>
                )}
              </section>
            )}

          {!isLoading &&
            !error &&
            filteredTasks.length > 0 && (
              <section className="tasks-grid">
                {filteredTasks.map((task) => (
                  <article
                    className="task-card"
                    key={task.id}
                  >
                    <div className="task-card-top">
                      <span
                        className={`task-priority ${
                          task.priority?.toLowerCase() ||
                          ""
                        }`}
                      >
                        {task.priority ||
                          "No priority"}
                      </span>

                      <div className="task-card-top-actions">
                        <span
                          className={`task-card-status ${
                            task.status?.toLowerCase() ||
                            ""
                          }`}
                        >
                          {task.status
                            ?.replaceAll("_", " ")
                            .toLowerCase() ||
                            "Unknown"}
                        </span>

                        <button
                          className="task-edit-button"
                          type="button"
                          onClick={() =>
                            handleOpenEditModal(task)
                          }
                          aria-label={`Edit ${task.title}`}
                          title="Edit task"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="task-delete-button"
                          type="button"
                          onClick={() =>
                            handleOpenDeleteModal(
                              task
                            )
                          }
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="task-card-content">
                      <p className="task-category">
                        {task.category_name ||
                          "No category"}
                      </p>

                      <h2>{task.title}</h2>

                      <p className="task-description">
                        {task.description ||
                          "No description provided."}
                      </p>
                    </div>

                    <div className="task-progress">
                      <div className="task-progress-heading">
                        <span>Progress</span>
                        <strong>
                          {task.progress ?? 0}%
                        </strong>
                      </div>

                      <div className="task-progress-track">
                        <div
                          className="task-progress-fill"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                task.progress ?? 0,
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="task-card-footer">
                      <span>
                        Due:{" "}
                        {task.due_date ||
                          "No due date"}
                      </span>

                      <span>
                        {task.status === "COMPLETED"
                          ? "Completed"
                          : `${task.progress ?? 0}% complete`}
                      </span>
                    </div>
                  </article>
                ))}
              </section>
            )}
        </main>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        onTaskCreated={handleTaskCreated}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        task={selectedTask}
        onClose={handleCloseEditModal}
        onTaskUpdated={handleTaskUpdated}
      />

      <DeleteTaskModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}

export default TasksPage;