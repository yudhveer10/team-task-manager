import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <Link to="/dashboard" className="brand">
        Team Task Manager
      </Link>
      <nav className="topbar-nav">
        {user ? (
          <>
            <span className="topbar-user">
              {user.name}
            </span>
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
