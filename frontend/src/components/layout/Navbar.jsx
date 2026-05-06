import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../layout/styles/navbar.css";
import "../../components/ui/styles/button.css";

import { logout } from "../../features/authSlice";

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const firstName = user?.firstName?.trim?.() || "";
  const lastName = user?.lastName?.trim?.() || "";
  const displayName = (firstName || lastName)
    ? `${firstName}${firstName && lastName ? " " : ""}${lastName}`
    : user?.email || "Guest";

  const handleLogout = () => {
    dispatch(logout());
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
          <span className="navbar__user-name">{displayName}</span>
          <span className="navbar__user-label">{user?.tier ?? "Standard"}</span>
        </div>
        <div className="navbar__sep" aria-hidden="true" />
        <button className="btn btn--outline btn--sm" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
