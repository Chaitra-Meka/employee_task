
import Header from "../components/Header";
import type { DashboardSummary, Task } from "../types";

interface DashboardProps {
  summary: DashboardSummary;
  tasks: Task[];
  onStatusChange: (id: number, status: Task["status"]) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function formatDate(date: string): string {
  if (!date) return "No due date";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: Task["status"]): string {
  switch (status) {
    case "Completed":
      return "status-completed";
    case "In Progress":
      return "status-progress";
    default:
      return "status-pending";
  }
}

function getPriorityClass(priority: Task["priority"]): string {
  switch (priority) {
    case "High":
      return "priority-high";
    case "Medium":
      return "priority-medium";
    default:
      return "priority-low";
  }
}

export default function Dashboard({
  summary,
  tasks,
}: DashboardProps) {
  const completionRate =
    summary.total_tasks > 0
      ? Math.round(
          (summary.completed_tasks / summary.total_tasks) * 100,
        )
      : 0;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const recentTasks = [...tasks]
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;

      return (
        new Date(a.due_date).getTime() -
        new Date(b.due_date).getTime()
      );
    })
    .slice(0, 5);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="dashboard-page">
      <Header
        title="Dashboard"
        subtitle="Overview of your employees and tasks"
      />

      <section className="dashboard-welcome">
        <div>
          <p className="welcome-label">COMPANY OVERVIEW</p>
          <h2>Welcome to your workspace!</h2>
          <p>
            Here's what's happening with your team and projects today.
          </p>
          <span className="welcome-date">{today}</span>
        </div>

        <div className="welcome-icon" aria-hidden="true">
          <span>📊</span>
        </div>
      </section>

      <section className="dashboard-stats" aria-label="Company statistics">
        <article className="dashboard-stat-card stat-purple">
          <div className="stat-icon" aria-hidden="true">👥</div>
          <div>
            <p>Total Employees</p>
            <h3>{summary.total_employees}</h3>
            <span>People in your company</span>
          </div>
        </article>

        <article className="dashboard-stat-card stat-blue">
          <div className="stat-icon" aria-hidden="true">📋</div>
          <div>
            <p>Total Tasks</p>
            <h3>{summary.total_tasks}</h3>
            <span>Tasks assigned to your team</span>
          </div>
        </article>

        <article className="dashboard-stat-card stat-green">
          <div className="stat-icon" aria-hidden="true">✓</div>
          <div>
            <p>Completed Tasks</p>
            <h3>{summary.completed_tasks}</h3>
            <span>Successfully completed</span>
          </div>
        </article>

        <article className="dashboard-stat-card stat-orange">
          <div className="stat-icon" aria-hidden="true">⏳</div>
          <div>
            <p>Pending Tasks</p>
            <h3>{summary.pending_tasks}</h3>
            <span>Waiting to be completed</span>
          </div>
        </article>
      </section>

      <section className="dashboard-content-grid">
        <article className="dashboard-panel progress-panel">
          <div className="panel-heading">
            <div>
              <h3>Task Progress</h3>
              <p>Overall team performance</p>
            </div>
            <span className="panel-heading-icon">📈</span>
          </div>

          <div className="progress-percentage">
            <strong>{completionRate}%</strong>
            <span>Completed</span>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Task completion"
            aria-valuenow={completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="progress-breakdown">
            <div>
              <span className="legend-dot completed-dot" />
              <span>Completed</span>
              <strong>{summary.completed_tasks}</strong>
            </div>
            <div>
              <span className="legend-dot progress-dot" />
              <span>In Progress</span>
              <strong>{inProgressTasks}</strong>
            </div>
            <div>
              <span className="legend-dot pending-dot" />
              <span>Pending</span>
              <strong>{summary.pending_tasks}</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-panel team-panel">
          <div className="panel-heading">
            <div>
              <h3>Team Snapshot</h3>
              <p>Current workload overview</p>
            </div>
            <span className="panel-heading-icon">🎯</span>
          </div>

          <div className="team-total">
            <div className="team-total-icon">👨‍💻</div>
            <div>
              <strong>{summary.total_employees}</strong>
              <span>Team members</span>
            </div>
          </div>

          <div className="team-metric">
            <span>Tasks per employee</span>
            <strong>
              {summary.total_employees > 0
                ? (summary.total_tasks / summary.total_employees).toFixed(1)
                : "0"}
            </strong>
          </div>

          <div className="team-metric">
            <span>Tasks in progress</span>
            <strong>{inProgressTasks}</strong>
          </div>

          <div className="team-metric">
            <span>Tasks remaining</span>
            <strong>{summary.pending_tasks}</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-panel recent-tasks-panel">
        <div className="panel-heading">
          <div>
            <h3>Upcoming Tasks</h3>
            <p>Tasks ordered by due date</p>
          </div>
          <span className="task-count">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {recentTasks.length === 0 ? (
          <div className="dashboard-empty">
            <span aria-hidden="true">🗂️</span>
            <h4>No tasks available</h4>
            <p>Create a task and assign it to an employee to see it here.</p>
          </div>
        ) : (
          <div className="recent-tasks-list">
            {recentTasks.map((task) => (
              <article className="recent-task-row" key={task.id}>
                <div className="recent-task-main">
                  <div className="task-avatar" aria-hidden="true">
                    {task.title.charAt(0).toUpperCase()}
                  </div>

                  <div className="recent-task-details">
                    <h4>{task.title}</h4>
                    <p>{task.employee_name || "Unassigned"}</p>
                  </div>
                </div>

                <div className="recent-task-meta">
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>

                  <span className={`task-status-badge ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>

                  <span className="task-due-date">
                    {formatDate(task.due_date)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
