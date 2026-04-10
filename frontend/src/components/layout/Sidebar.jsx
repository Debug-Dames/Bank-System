import { NavLink } from "react-router-dom";
import "../layout/styles/sidebar.css";

// width + height set directly on every SVG — never rely on CSS alone for SVG sizing
const Icons = {
  Dashboard: (
    <svg
      width="18"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  ),
  Cards: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="12" height="8" rx="2" />
      <line x1="2" y1="7" x2="14" y2="7" />
      <line x1="5" y1="10.5" x2="8.5" y2="10.5" />
    </svg>
  ),
  Deposit: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="5" x2="8" y2="11" />
      <polyline points="5.5,8.5 8,11 10.5,8.5" />
    </svg>
  ),
  Withdraw: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="11" x2="8" y2="5" />
      <polyline points="5.5,7.5 8,5 10.5,7.5" />
    </svg>
  ),
  Transactions: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="4.5" x2="14" y2="4.5" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="11.5" x2="9" y2="11.5" />
    </svg>
  ),
  Profile: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" />
    </svg>
  ),
};

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: Icons.Dashboard },
  { to: "/cards", label: "Cards", icon: Icons.Cards },
  { to: "/deposit", label: "Deposit", icon: Icons.Deposit },
  { to: "/withdraw", label: "Withdraw", icon: Icons.Withdraw },
  { to: "/transactions", label: "Transactions", icon: Icons.Transactions },
  { to: "/profile", label: "Profile", icon: Icons.Profile },
];

const MOCK_ACCOUNT = { id: "OB — 0041 — 2025" };

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop — mobile only */}
      {open && (
        <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar${open ? " sidebar--open" : ""}`}>
        <span className="sidebar__section-label">Menu</span>

        <nav className="sidebar__nav">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link${isActive ? " sidebar__link--active" : ""}`
              }
            >
              <span className="sidebar__link-icon" aria-hidden="true">
                {icon}
              </span>
              <span className="sidebar__link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <span className="sidebar__account-label">Account</span>
          <span className="sidebar__account-id">{MOCK_ACCOUNT.id}</span>
        </div>
      </aside>
    </>
  );
}

