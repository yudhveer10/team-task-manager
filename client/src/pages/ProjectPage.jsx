import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectApi, taskApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function ProjectPage() {
  const { projectId } = useParams();
  const { token, user } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
  });
  const [memberForm, setMemberForm] = useState({
    email: "",
    role: "MEMBER",
  });

  const loadProject = async () => {
    try {
      const response = await projectApi.detail(projectId, token);
      setProject(response.project);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId, token]);

  const currentMembership = project?.members.find((member) => member.userId === user?.id);
  const isAdmin = currentMembership?.role === "ADMIN";
  const groupedTasks = project
    ? {
        TODO: project.tasks.filter((task) => task.status === "TODO"),
        IN_PROGRESS: project.tasks.filter((task) => task.status === "IN_PROGRESS"),
        DONE: project.tasks.filter((task) => task.status === "DONE"),
      }
    : { TODO: [], IN_PROGRESS: [], DONE: [] };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    try {
      await taskApi.create(
        projectId,
        {
          ...taskForm,
          assigneeId: taskForm.assigneeId || null,
          dueDate: taskForm.dueDate || null,
        },
        token
      );
      setTaskForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        assigneeId: "",
      });
      loadProject();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.update(projectId, taskId, { status }, token);
      loadProject();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.delete(projectId, taskId, token);
      loadProject();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleInviteMember = async (event) => {
    event.preventDefault();
    try {
      await projectApi.addMember(projectId, memberForm, token);
      setMemberForm({ email: "", role: "MEMBER" });
      loadProject();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleRoleUpdate = async (memberId, role) => {
    try {
      await projectApi.updateMemberRole(projectId, memberId, { role }, token);
      loadProject();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await projectApi.removeMember(projectId, memberId, token);
      loadProject();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!project) {
    return <div className="empty-state">{error || "Loading project..."}</div>;
  }

  return (
    <section className="page-stack">
      <div className="project-header project-hero">
        <div className="project-hero-copy">
          <Link to="/dashboard" className="text-link">
            Back to dashboard
          </Link>
          <h1>{project.name}</h1>
          <p className="muted-text">{project.description || "No description provided."}</p>
        </div>
        <div className="project-hero-stats">
          <div className="mini-stat">
            <span>Members</span>
            <strong>{project.members.length}</strong>
          </div>
          <div className="mini-stat">
            <span>Tasks</span>
            <strong>{project.tasks.length}</strong>
          </div>
          <div className="mini-stat">
            <span>Your role</span>
            <strong>{currentMembership?.role || "MEMBER"}</strong>
          </div>
        </div>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <div className="two-column">
        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Execution</p>
            <h2>Create task</h2>
          </div>
          <form className="form-grid" onSubmit={handleCreateTask}>
            <label className="field">
              <span>Title</span>
              <input
                value={taskForm.title}
                onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                rows="4"
                value={taskForm.description}
                onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
              />
            </label>
            <label className="field">
              <span>Priority</span>
              <select
                value={taskForm.priority}
                onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>
            <label className="field">
              <span>Due date</span>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
              />
            </label>
            <label className="field">
              <span>Assign to</span>
              <select
                value={taskForm.assigneeId}
                onChange={(event) => setTaskForm({ ...taskForm, assigneeId: event.target.value })}
              >
                <option value="">Unassigned</option>
                {project.members.map((member) => (
                  <option key={member.id} value={member.userId}>
                    {member.user.name} ({member.role})
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="primary-button">
              Create task
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Team</p>
            <h2>Team members</h2>
          </div>
          {isAdmin && (
            <form className="inline-form" onSubmit={handleInviteMember}>
              <input
                type="email"
                value={memberForm.email}
                onChange={(event) => setMemberForm({ ...memberForm, email: event.target.value })}
                placeholder="member@example.com"
                required
              />
              <select
                value={memberForm.role}
                onChange={(event) => setMemberForm({ ...memberForm, role: event.target.value })}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" className="primary-button">
                Invite
              </button>
            </form>
          )}

          <div className="list-stack">
            {project.members.map((member) => (
              <article key={member.id} className="list-card static-card">
                <div>
                  <h3>{member.user.name}</h3>
                  <p className="muted-text">{member.user.email}</p>
                </div>
                <div className="member-actions">
                  <span className="pill">{member.role}</span>
                  {isAdmin && member.user.id !== project.ownerId && (
                    <>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          handleRoleUpdate(
                            member.id,
                            member.role === "ADMIN" ? "MEMBER" : "ADMIN"
                          )
                        }
                      >
                        Toggle role
                      </button>
                      <button
                        type="button"
                        className="ghost-button danger-button"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Workflow</p>
          <h2>Task board</h2>
        </div>
        <div className="kanban-grid">
          {[
            { key: "TODO", label: "Todo" },
            { key: "IN_PROGRESS", label: "In Progress" },
            { key: "DONE", label: "Done" },
          ].map((column) => (
            <section key={column.key} className="kanban-column">
              <div className="kanban-column-header">
                <div>
                  <span className="pill subtle-pill">{column.label}</span>
                </div>
                <strong>{groupedTasks[column.key].length}</strong>
              </div>

              <div className="kanban-card-stack">
                {groupedTasks[column.key].length === 0 ? (
                  <div className="kanban-empty">
                    <span>No tasks here yet</span>
                  </div>
                ) : (
                  groupedTasks[column.key].map((task) => (
                    <article key={task.id} className="kanban-task-card">
                      <div className="task-card-top">
                        <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
                        <span className="pill subtle-pill">{task.priority}</span>
                      </div>
                      <h3>{task.title}</h3>
                      <p className="muted-text">{task.description || "No description"}</p>
                      <div className="kanban-task-meta">
                        <span>{task.assignee ? task.assignee.name : "Unassigned"}</span>
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</span>
                      </div>
                      <div className="kanban-task-actions">
                        <select
                          value={task.status}
                          onChange={(event) => handleStatusChange(task.id, event.target.value)}
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                        {isAdmin && (
                          <button
                            type="button"
                            className="ghost-button danger-button"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </section>
    </section>
  );
}

export default ProjectPage;
