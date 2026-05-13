import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AUTH_BASE_URL, authApi } from "../lib/api";

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { token, login } = useAuth();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [providers, setProviders] = useState({ google: false, github: false });

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await authApi.providers();
        setProviders(response.providers);
      } catch (requestError) {
        setProviders({ google: false, github: false });
      }
    };

    const authError = searchParams.get("error");
    if (authError) {
      setError(authError);
    }

    loadProviders();
  }, [searchParams]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = isSignup
        ? await authApi.signup(form)
        : await authApi.login({
            email: form.email,
            password: form.password,
          });

      login(response.token, response.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-panel auth-showcase">
        <div className="auth-showcase-copy">
          <p className="eyebrow">Assignment build</p>
          <h1>{isSignup ? "Lead every sprint with clarity" : "Pick up where your team left off"}</h1>
          <p className="muted-text auth-lead">
            Manage projects, invite teammates, assign work, and track delivery through a focused command center.
          </p>
        </div>

        <div className="showcase-activity-band">
          <div className="activity-chip">
            <span className="activity-dot success-dot" />
            Anyone can join by signing up
          </div>
          <div className="activity-chip">
            <span className="activity-dot warning-dot" />
            Projects, roles, and tasks stay synced
          </div>
        </div>

        <div className="auth-highlight-grid">
          <article className="highlight-card">
            <span className="highlight-kicker">Roles</span>
            <strong>Admin and member access</strong>
            <p>Control who can invite, assign, and manage delivery inside each project.</p>
          </article>
          <article className="highlight-card">
            <span className="highlight-kicker">Flow</span>
            <strong>Track progress visually</strong>
            <p>See what is blocked, in motion, overdue, and completed at a glance.</p>
          </article>
        </div>
      </div>

      <div className="auth-side-stack">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="section-heading">
            <p className="eyebrow">{isSignup ? "Start here" : "Secure access"}</p>
            <h2>{isSignup ? "Create account" : "Login"}</h2>
            <p className="muted-text">
              {isSignup
                ? "Anyone on your team can sign up and begin collaborating right away."
                : "Jump back into your projects, assignments, and progress overview."}
            </p>
          </div>
          {error && <p className="error-banner">{error}</p>}

          {isSignup && (
            <label className="field">
              <span>Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="John Doe"
                required
              />
            </label>
          )}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="john@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Minimum 6 characters"
              required
            />
          </label>

          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? "Please wait..." : isSignup ? "Create account" : "Login"}
          </button>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth-grid">
            <a
              href={providers.google ? `${AUTH_BASE_URL}/api/auth/google` : "#"}
              className={`social-auth-button ${!providers.google ? "social-auth-disabled" : ""}`}
              aria-disabled={!providers.google}
            >
              <span>Google</span>
              <small>{providers.google ? "Continue with Google" : "Connect later in env setup"}</small>
            </a>
            <a
              href={providers.github ? `${AUTH_BASE_URL}/api/auth/github` : "#"}
              className={`social-auth-button ${!providers.github ? "social-auth-disabled" : ""}`}
              aria-disabled={!providers.github}
            >
              <span>GitHub</span>
              <small>{providers.github ? "Continue with GitHub" : "Connect later in env setup"}</small>
            </a>
          </div>

          <p className="inline-text">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link to={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Login" : "Sign up"}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default AuthPage;
