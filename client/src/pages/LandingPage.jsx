import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <section className="landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-kicker">Team coordination for modern operators</span>
          <h1>Ship projects faster with one calm, collaborative workspace.</h1>
          <p className="landing-lead">
            Plan projects, assign work, track execution, and keep every stakeholder aligned through
            a role-aware task system built for real teams.
          </p>

          <div className="landing-actions">
            <Link to="/signup" className="primary-button landing-primary">
              Start free
            </Link>
            <Link to="/login" className="ghost-button landing-secondary">
              Sign in
            </Link>
          </div>

          <div className="landing-proof-row">
            <span>Google and GitHub sign-in ready</span>
            <span>Task board + team roles</span>
            <span>Railway deployed</span>
          </div>
        </div>

        <div className="landing-preview">
          <div className="landing-preview-window">
            <div className="preview-topline">
              <span className="preview-pill">Roadmap</span>
              <span className="preview-pill">Execution</span>
              <span className="preview-pill">Insights</span>
            </div>
            <div className="landing-preview-grid">
              <article className="landing-widget landing-widget-large">
                <span className="widget-label">Delivery pulse</span>
                <strong>84%</strong>
                <p>Completion across active workspaces this sprint</p>
              </article>
              <article className="landing-widget">
                <span className="widget-label">Teams active</span>
                <strong>12</strong>
              </article>
              <article className="landing-widget">
                <span className="widget-label">Tasks moving</span>
                <strong>37</strong>
              </article>
              <article className="landing-widget landing-widget-board">
                <div className="board-lane">
                  <span>Todo</span>
                  <div className="board-card">Launch copy review</div>
                </div>
                <div className="board-lane">
                  <span>In Progress</span>
                  <div className="board-card">Pricing page build</div>
                </div>
                <div className="board-lane">
                  <span>Done</span>
                  <div className="board-card">Team onboarding flow</div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-feature-strip">
        <article className="landing-feature-card">
          <span className="landing-card-kicker">Structure</span>
          <h3>Projects, tasks, and ownership in one flow</h3>
          <p>Move from idea to execution without switching between scattered tools.</p>
        </article>
        <article className="landing-feature-card">
          <span className="landing-card-kicker">Control</span>
          <h3>Admin and member permissions built in</h3>
          <p>Keep responsibilities clear while still letting contributors update progress fast.</p>
        </article>
        <article className="landing-feature-card">
          <span className="landing-card-kicker">Clarity</span>
          <h3>Dashboards that surface what matters next</h3>
          <p>See workload, overdue items, and momentum at a glance instead of chasing updates.</p>
        </article>
      </section>
    </section>
  );
}

export default LandingPage;
