import {
  CheckCircle2,
  CircleDashed,
  Clock3,
  ListTodo,
  TriangleAlert,
} from "lucide-react";

import StatCard from "./StatCard";

function DashboardStats({ stats }) {
  const cards = [
    {
      label: "Total Tasks",
      value: stats.total_tasks,
      description: "All tasks in your workspace",
      icon: ListTodo,
      className: "total",
    },
    {
      label: "To Do",
      value: stats.todo_tasks,
      description: "Tasks waiting to begin",
      icon: CircleDashed,
      className: "todo",
    },
    {
      label: "In Progress",
      value: stats.in_progress_tasks,
      description: "Tasks currently underway",
      icon: Clock3,
      className: "progress",
    },
    {
      label: "Completed",
      value: stats.completed_tasks,
      description: "Tasks successfully finished",
      icon: CheckCircle2,
      className: "completed",
    },
    {
      label: "Overdue",
      value: stats.overdue_tasks,
      description: "Tasks past their due date",
      icon: TriangleAlert,
      className: "overdue",
    },
  ];

  return (
    <section className="dashboard-stats-section">
      <div className="section-heading">
        <div>
          <span>Workspace overview</span>
          <h2>Your task statistics</h2>
        </div>

        <div className="completion-badge">
          {stats.completion_rate}% completed
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  );
}

export default DashboardStats;