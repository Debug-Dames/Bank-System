import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../layout/styles/navbar.css";
import "../../components/ui/styles/button.css";

// TODO Sprint 2: replace with useSelector((state) => state.auth.user)
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // TODO Sprint 2: dispatch(logout()) before navigating
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Hamburger button */}
      <button
        className="navbar__hamburger"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        aria-expanded={sidebarOpen}
      >
        <span className={`hamburger-icon${sidebarOpen ? " hamburger-icon--open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Brand */}
      <a href="/dashboard" className="navbar__brand">
        <img
          src="/novaBank-logo.jpg"         
          alt="NovaBank"
          className="navbar__brand-logo"
        />
        {/* <span className="navbar__brand-name">NovaBank</span> */}
      </a>

      {/* Right side */}
      <div className="navbar__nav">
        <div className="navbar__user">
          <span className="navbar__user-name">{user.firstName ?? "Guest"}</span>
          <span className="navbar__user-label">{user.tier ?? "Standard"}</span>
        </div>
        <div className="navbar__sep" aria-hidden="true" />
        <button className="btn btn--outline btn--sm" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}