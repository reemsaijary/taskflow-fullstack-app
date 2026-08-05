import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  ListTodo,
  Target,
  TriangleAlert,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../api/axios";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/dashboard.css";
import "../styles/analytics.css";

const STATUS_COLORS = [
  "#f4a900",
  "#3b82f6",
  "#22c55e",
];

const PRIORITY_COLORS = {
  Low: "#22c55e",
  Medium: "#f4a900",
  High: "#ef4444",
};

function AnalyticsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [statistics, setStatistics] = useState({
    total_tasks: 0,
    todo_tasks: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
    overdue_tasks: 0,
    due_today: 0,
    completion_rate: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [statisticsResponse, tasksResponse] =
          await Promise.all([
            api.get("/dashboard/"),
            api.get("/tasks/"),
          ]);

        setStatistics(statisticsResponse.data);
        setTasks(tasksResponse.data);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          navigate("/login", { replace: true });
          return;
        }

        setError("Could not load analytics data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [navigate]);

  const statusChartData = useMemo(
    () => [
      {
        name: "To Do",
        value: statistics.todo_tasks,
      },
      {
        name: "In Progress",
        value: statistics.in_progress_tasks,
      },
      {
        name: "Completed",
        value: statistics.completed_tasks,
      },
    ],
    [statistics]
  );

  const priorityChartData = useMemo(() => {
    const priorityTotals = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };

    tasks.forEach((task) => {
      if (
        Object.prototype.hasOwnProperty.call(
          priorityTotals,
          task.priority
        )
      ) {
        priorityTotals[task.priority] += 1;
      }
    });

    return [
      {
        name: "Low",
        tasks: priorityTotals.LOW,
      },
      {
        name: "Medium",
        tasks: priorityTotals.MEDIUM,
      },
      {
        name: "High",
        tasks: priorityTotals.HIGH,
      },
    ];
  }, [tasks]);

  const completedPercentage = Math.min(
    Math.max(statistics.completion_rate || 0, 0),
    100
  );

  const hasStatusData = statusChartData.some(
    (item) => item.value > 0
  );

  const hasPriorityData = priorityChartData.some(
    (item) => item.tasks > 0
  );

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

        <main className="analytics-main">
          <section className="analytics-header">
            <div>
              <span className="analytics-eyebrow">
                Productivity
              </span>

              <h1>Analytics</h1>

              <p>
                Monitor your task performance and productivity.
              </p>
            </div>

            <div className="analytics-header-rate">
              <span>Completion rate</span>

              <strong>
                {completedPercentage.toFixed(0)}%
              </strong>
            </div>
          </section>

          {isLoading && (
            <p className="analytics-message">
              Loading analytics...
            </p>
          )}

          {error && (
            <p className="analytics-message error">
              {error}
            </p>
          )}

          {!isLoading && !error && (
            <>
              <section className="analytics-summary">
                <article className="analytics-card total">
                  <div className="analytics-card-icon">
                    <BarChart3 size={25} />
                  </div>

                  <div>
                    <span>Total Tasks</span>
                    <strong>
                      {statistics.total_tasks}
                    </strong>
                  </div>
                </article>

                <article className="analytics-card completed">
                  <div className="analytics-card-icon">
                    <CheckCircle2 size={25} />
                  </div>

                  <div>
                    <span>Completed</span>
                    <strong>
                      {statistics.completed_tasks}
                    </strong>
                  </div>
                </article>

                <article className="analytics-card progress">
                  <div className="analytics-card-icon">
                    <Clock3 size={25} />
                  </div>

                  <div>
                    <span>In Progress</span>
                    <strong>
                      {statistics.in_progress_tasks}
                    </strong>
                  </div>
                </article>

                <article className="analytics-card todo">
                  <div className="analytics-card-icon">
                    <ListTodo size={25} />
                  </div>

                  <div>
                    <span>To Do</span>
                    <strong>
                      {statistics.todo_tasks}
                    </strong>
                  </div>
                </article>
              </section>

              <section className="analytics-secondary-summary">
                <article>
                  <div className="analytics-small-icon overdue">
                    <TriangleAlert size={20} />
                  </div>

                  <div>
                    <span>Overdue tasks</span>
                    <strong>
                      {statistics.overdue_tasks}
                    </strong>
                  </div>
                </article>

                <article>
                  <div className="analytics-small-icon due">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <span>Due today</span>
                    <strong>
                      {statistics.due_today}
                    </strong>
                  </div>
                </article>

                <article>
                  <div className="analytics-small-icon rate">
                    <Target size={20} />
                  </div>

                  <div>
                    <span>Completion rate</span>
                    <strong>
                      {completedPercentage.toFixed(0)}%
                    </strong>
                  </div>
                </article>
              </section>

              <section className="analytics-progress-panel">
                <div className="analytics-panel-heading">
                  <div>
                    <span className="analytics-section-eyebrow">
                      Overall performance
                    </span>

                    <h2>Task completion</h2>
                  </div>

                  <strong>
                    {completedPercentage.toFixed(0)}%
                  </strong>
                </div>

                <div className="analytics-progress-track">
                  <div
                    className="analytics-progress-fill"
                    style={{
                      width: `${completedPercentage}%`,
                    }}
                  />
                </div>

                <p>
                  {statistics.completed_tasks} of{" "}
                  {statistics.total_tasks} tasks completed.
                </p>
              </section>

              <section className="analytics-charts-grid">
                <article className="analytics-chart-panel">
                  <div className="analytics-panel-heading">
                    <div>
                      <span className="analytics-section-eyebrow">
                        Status overview
                      </span>

                      <h2>Tasks by status</h2>
                    </div>
                  </div>

                  {hasStatusData ? (
                    <div className="analytics-chart">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <PieChart>
                          <Pie
                            data={statusChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={100}
                            paddingAngle={4}
                            label={({ name, value }) =>
                              `${name}: ${value}`
                            }
                          >
                            {statusChartData.map(
                              (entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={
                                    STATUS_COLORS[
                                      index %
                                        STATUS_COLORS.length
                                    ]
                                  }
                                />
                              )
                            )}
                          </Pie>

                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="analytics-empty-chart">
                      <PieChart
                        width={44}
                        height={44}
                      />

                      <h3>No status data yet</h3>

                      <p>
                        Create tasks to see their status
                        distribution.
                      </p>
                    </div>
                  )}
                </article>

                <article className="analytics-chart-panel">
                  <div className="analytics-panel-heading">
                    <div>
                      <span className="analytics-section-eyebrow">
                        Priority overview
                      </span>

                      <h2>Tasks by priority</h2>
                    </div>
                  </div>

                  {hasPriorityData ? (
                    <div className="analytics-chart">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <BarChart
                          data={priorityChartData}
                          margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                          />

                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                          />

                          <Tooltip />

                          <Bar
                            dataKey="tasks"
                            radius={[10, 10, 0, 0]}
                            maxBarSize={70}
                          >
                            {priorityChartData.map(
                              (entry) => (
                                <Cell
                                  key={entry.name}
                                  fill={
                                    PRIORITY_COLORS[
                                      entry.name
                                    ]
                                  }
                                />
                              )
                            )}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="analytics-empty-chart">
                      <BarChart3 size={44} />

                      <h3>No priority data yet</h3>

                      <p>
                        Create tasks to see their priority
                        distribution.
                      </p>
                    </div>
                  )}
                </article>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AnalyticsPage;