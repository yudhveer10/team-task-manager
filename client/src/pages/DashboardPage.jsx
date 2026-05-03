import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardApi, projectApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectResponse, dashboardResponse] = await Promise.all([
        projectApi.list(token),
        dashboardApi.get(token),
      ]);
      setProjects(projectResponse.projects);
      setDashboard(dashboardResponse);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreateProject = async (event) => {
    event.preventDefault();

    try {
      await projectApi.create(projectForm, token);
      setProjectForm({ name: "", description: "" });
      loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (loading) {
    return <div className="empty-state">Loading dashboard...</div>;
  }

  const summary = dashboard?.summary || {};
  const recentTasks = (dashboard?.tasks || []).slice(0, 6);
  const workload = (summary.todoTasks || 0) + (summary.inProgressTasks || 0);
  const completionRate = summary.totalTasks
    ? Math.round(((summary.completedTasks || 0) / summary.totalTasks) * 100)
    : 0;

  return (
    <section className="page-stack">
      <div className="hero-card dashboard-hero">
        <div className="hero-card-main">
          <div className="hero-copy-block">
            <p className="eyebrow">Overview</p>
            <h1>Project dashboard</h1>
            <p className="hero-text">
              Keep track of active work, overdue tasks, and team progress across projects.
            </p>
            <div className="hero-tag-row">
              <span className="hero-tag">Live team overview</span>
              <span className="hero-tag">Role-based workflow</span>
              <span className="hero-tag">Railway deployed</span>
            </div>
          </div>
          <div className="hero-orbit">
            <div className="orbit-card">
              <span>Open workload</span>
              <strong>{workload}</strong>
            </div>
            <div className="orbit-card accent-orbit">
              <span>Completed</span>
              <strong>{summary.completedTasks || 0}</strong>
            </div>
          </div>
        </div>
        <div className="hero-inline-stats">
          <div>
            <span className="hero-metric-label">Projects</span>
            <strong>{summary.totalProjects || 0}</strong>
          </div>
          <div>
            <span className="hero-metric-label">Tasks</span>
            <strong>{summary.totalTasks || 0}</strong>
          </div>
          <div>
            <span className="hero-metric-label">Overdue</span>
            <strong>{summary.overdueTasks || 0}</strong>
          </div>
        </div>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <div className="insight-grid">
        <section className="panel insight-panel">
          <div className="section-heading">
            <p className="eyebrow">Focus</p>
            <h2>Execution snapshot</h2>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="progress-meta">
            <div>
              <span className="progress-label">Completion rate</span>
              <strong>{completionRate}%</strong>
            </div>
            <div>
              <span className="progress-label">Open items</span>
              <strong>{workload}</strong>
            </div>
          </div>
          <div className="distribution-grid">
            <article className="distribution-card">
              <span>Todo</span>
              <strong>{summary.todoTasks || 0}</strong>
            </article>
            <article className="distribution-card">
              <span>In progress</span>
              <strong>{summary.inProgressTasks || 0}</strong>
            </article>
            <article className="distribution-card">
              <span>Done</span>
              <strong>{summary.completedTasks || 0}</strong>
            </article>
          </div>
        </section>

        <section className="panel insight-panel">
          <div className="section-heading">
            <p className="eyebrow">Momentum</p>
            <h2>Suggested next moves</h2>
          </div>
          <div className="action-list">
            <div className="action-item">
              <span className="action-dot action-dot-orange" />
              <div>
                <strong>Create a project brief</strong>
                <p className="muted-text">Add a strong description so new members understand goals faster.</p>
              </div>
            </div>
            <div className="action-item">
              <span className="action-dot action-dot-green" />
              <div>
                <strong>Assign owners early</strong>
                <p className="muted-text">Tasks move faster when each item has one visible owner and due date.</p>
              </div>
            </div>
            <div className="action-item">
              <span className="action-dot action-dot-blue" />
              <div>
                <strong>Use the project workspace</strong>
                <p className="muted-text">Open a project to manage team roles, delivery flow, and status updates.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total Projects</span>
          <strong>{summary.totalProjects || 0}</strong>
        </article>
        <article className="stat-card">
          <span>Total Tasks</span>
          <strong>{summary.totalTasks || 0}</strong>
        </article>
        <article className="stat-card">
          <span>In Progress</span>
          <strong>{summary.inProgressTasks || 0}</strong>
        </article>
        <article className="stat-card">
          <span>Overdue</span>
          <strong>{summary.overdueTasks || 0}</strong>
        </article>
      </div>

      <div className="two-column">
        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Workspace</p>
            <h2>Create project</h2>
          </div>
          <form className="form-grid" onSubmit={handleCreateProject}>
            <label className="field">
              <span>Project name</span>
              <input
                value={projectForm.name}
                onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })}
                placeholder="Marketing Website"
                required
              />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                rows="4"
                value={projectForm.description}
                onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })}
                placeholder="Short summary of the project"
              />
            </label>
            <button type="submit" className="primary-button">
              Save project
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Projects</p>
            <h2>Your projects</h2>
          </div>
          <div className="list-stack">
            {projects.length === 0 ? (
              <div className="empty-panel">
                <strong>No projects yet</strong>
                <p className="muted-text">Create your first workspace to invite a team, assign work, and track progress.</p>
              </div>
            ) : (
              projects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="project-spotlight-card">
                  <div className="project-spotlight-copy">
                    <h3>{project.name}</h3>
                    <p className="muted-text">
                      {project.description || "No description added yet"}
                    </p>
                    <div className="project-spotlight-meta">
                      <span className="pill">{project.membershipRole}</span>
                      <span className="muted-text">{project._count.members} members</span>
                    </div>
                  </div>
                  <div className="project-spotlight-stats">
                    <strong>{project._count.tasks}</strong>
                    <span>tasks</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Activity</p>
          <h2>Recent tasks</h2>
        </div>
        <div className="task-grid">
          {recentTasks.length === 0 ? (
            <div className="empty-panel wide-empty-panel">
              <strong>No recent tasks yet</strong>
              <p className="muted-text">Once tasks are created inside a project, they will appear here with status and assignee details.</p>
            </div>
          ) : (
            recentTasks.map((task) => (
              <article key={task.id} className="task-card enhanced-task-card">
                <div className="task-card-top">
                  <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
                  <span className="pill subtle-pill">{task.project.name}</span>
                </div>
                <h3>{task.title}</h3>
                <p className="muted-text">
                  {task.assignee ? `Assigned to ${task.assignee.name}` : "Unassigned"}
                </p>
                <div className="task-card-footer">
                  <span className="muted-text">Open in workspace</span>
                  <span className="task-arrow">↗</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}

export default DashboardPage;
