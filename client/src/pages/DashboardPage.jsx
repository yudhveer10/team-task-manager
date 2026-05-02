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

  return (
    <section className="page-stack">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Project dashboard</h1>
          <p className="muted-text">
            Keep track of active work, overdue tasks, and team progress across projects.
          </p>
        </div>
      </div>

      {error && <p className="error-banner">{error}</p>}

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
          <h2>Create project</h2>
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
          <h2>Your projects</h2>
          <div className="list-stack">
            {projects.length === 0 ? (
              <p className="muted-text">Create your first project to start assigning tasks.</p>
            ) : (
              projects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="list-card">
                  <div>
                    <h3>{project.name}</h3>
                    <p className="muted-text">
                      {project.description || "No description added yet"}
                    </p>
                  </div>
                  <div className="list-card-meta">
                    <span>{project.membershipRole}</span>
                    <span>{project._count.tasks} tasks</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2>Recent tasks</h2>
        <div className="task-grid">
          {(dashboard?.tasks || []).slice(0, 8).map((task) => (
            <article key={task.id} className="task-card">
              <div className="task-card-top">
                <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
                <span className="muted-text">{task.project.name}</span>
              </div>
              <h3>{task.title}</h3>
              <p className="muted-text">
                {task.assignee ? `Assigned to ${task.assignee.name}` : "Unassigned"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default DashboardPage;
