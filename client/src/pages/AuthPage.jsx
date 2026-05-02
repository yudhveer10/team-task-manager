import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../lib/api";

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { token, login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      <div className="auth-panel">
        <p className="eyebrow">Assignment build</p>
        <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="muted-text">
          Manage projects, invite teammates, assign work, and track delivery in one place.
        </p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isSignup ? "Sign up" : "Login"}</h2>
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

        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? "Please wait..." : isSignup ? "Create account" : "Login"}
        </button>

        <p className="inline-text">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Login" : "Sign up"}
          </Link>
        </p>
      </form>
    </section>
  );
}

export default AuthPage;
