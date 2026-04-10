import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "./dashboard.css";

export default function Dashboard() {
  const { user = {}, balance = 0 } = useSelector((state) => state.auth || {});

  const formatMoney = (amount) => {
    const n = Number(amount ?? 0);
    return n.toLocaleString("en-ZA", { maximumFractionDigits: 0 });
  };

  return (
    <div className="dashboard-view">
      <header className="dashboard-view__header">
        <div>
          <h1 className="dashboard-view__title">NovaBank</h1>
          <p className="dashboard-view__subtitle">
            Welcome back, <span className="accent">{user?.name || "User"}</span>
          </p>
        </div>

        <div className="dashboard-view__actions">
          <Link className="btn btn--outline btn--sm" to="/profile">
            Edit Profile
          </Link>
        </div>
      </header>

      <div className="dashboard-view__grid">
        <section className="card card--hero">
          <div className="card__head">
            <h2 className="card__title">Main Account</h2>
            <span className="pill">Everyday</span>
          </div>

          <p className="dashboard-view__balance">
            <span className="dashboard-view__balance-label">Available</span>
            <span className="dashboard-view__balance-amount">
              R {formatMoney(balance)}
            </span>
          </p>

          <div className="dashboard-view__cta">
            <Link className="btn btn--primary" to="/deposit">
              Top up
            </Link>
            <Link className="btn" to="/withdraw">
              Withdraw
            </Link>
          </div>
        </section>

        

        <section className="card dashboard-view__full">
          <div className="card__head">
            <h2 className="card__title">Savings Plans</h2>
            <span className="pill pill--muted">Coming soon</span>
          </div>
          <p className="text-muted">No savings plans yet (mock).</p>
        </section>
      </div>
    </div>
  );
}
