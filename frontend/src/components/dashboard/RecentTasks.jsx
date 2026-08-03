import { CheckCircle2, Clock3, CircleDashed } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentTasks({ tasks }) {
  const navigate = useNavigate();

  const getStatusDetails = (status) => {
    if (status === "COMPLETED") {
      return {
        label: "Completed",
        icon: CheckCircle2,
        className: "completed",
      };
    }

    if (status === "IN_PROGRESS") {
      return {
        label: "In Progress",
        icon: Clock3,
        className: "in-progress",
      };
    }

    return {
      label: "To Do",
      icon: CircleDashed,
      className: "todo",
    };
  };

  const recentTasks = tasks.slice(0, 4);

  return (
    <section className="recent-tasks">
      <div className="section-header">
        <div>
          <span className="section-label">Recent tasks</span>
          <h2>Latest activity</h2>
        </div>

        <button
          className="view-all-btn"
          type="button"
          onClick={() => navigate("/tasks")}
        >
          View All →
        </button>
      </div>

      {recentTasks.length === 0 ? (
        <div className="empty-tasks-state">
          <h3>No tasks yet</h3>
          <p>Create your first task to see it here.</p>
        </div>
      ) : (
        <div className="recent-task-list">
          {recentTasks.map((task) => {
            const status = getStatusDetails(task.status);
            const StatusIcon = status.icon;

            return (
              <article className="recent-task-card" key={task.id}>
                <div className={`recent-task-icon ${status.className}`}>
                  <StatusIcon size={20} />
                </div>

                <div className="recent-task-content">
                  <h3>{task.title}</h3>

                  <p>
                    {task.category_name || "No category"}
                  </p>
                </div>

                <div className="recent-task-meta">
                  <span className={`task-status ${status.className}`}>
                    {status.label}
                  </span>

                  <small>
                    Due: {task.due_date || "No due date"}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RecentTasks;