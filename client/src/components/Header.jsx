import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  const isProject = location.pathname.startsWith("/projects/");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-brand-block">
        <Link to="/dashboard" className="brand">
          Team Task Manager
        </Link>
        {user && (
          <span className="topbar-route-chip">
            {isDashboard ? "Control Center" : isProject ? "Project Workspace" : "Workspace"}
          </span>
        )}
      </div>

      <nav className="topbar-nav">
        {user ? (
          <>
            <div className="topbar-user-block">
              <span className="topbar-user-label">Signed in as</span>
              <span className="topbar-user">{user.name}</span>
            </div>
            {location.pathname !== "/dashboard" && (
              <Link to="/dashboard" className="text-link">
                Dashboard
              </Link>
            )}
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <span className="topbar-note">Open signup for new teams</span>
            <Link to="/login" className="text-link">
              Login
            </Link>
            <Link to="/signup" className="primary-button small-button">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
