import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearTransactions, fetchTransactions } from "../../features/authSlice";
import { fetchSavingsPlans } from "../../features/savingsSlice";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "./dashboard.css";

const ACCOUNT_ID = "acc_001";
const FAVORITES_KEY = "novabank.dashboard.favorites";

const FAVORITE_OPTIONS = [
  {
    id: "transfer_money",
    label: "Transfer Money",
    to: "/transact?tab=beneficiary",
    meta: "Pay a beneficiary",
  },
  {
    id: "send_cash",
    label: "Send Cash",
    to: "/transact?tab=sendcash",
    meta: "Send to a phone",
  },
  { id: "buy_airtime", label: "Buy Airtime", to: "/transact?tab=airtime" },
  { id: "buy_data", label: "Buy Data", to: "/transact?tab=data" },
  { id: "buy_electricity", label: "Buy Electricity", to: "/transact?tab=electricity" },
  { id: "deposit", label: "Top up", to: "/deposit" },
  { id: "withdraw", label: "Withdraw", to: "/withdraw" },
  { id: "transactions", label: "View Transactions", to: "/transactions" },
  { id: "cards", label: "Cards", to: "/cards" },
];

function safeParseFavorites(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((id) => typeof id === "string");
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user = {}, balance = 0 } = useSelector((state) => state.auth || {});
  const { status: txStatus, items: txItems = [] } = useSelector(
    (state) => state.auth?.transactions || { status: "idle", items: [] }
  );
  const { plans: savingsPlans = [], status: savingsStatus } = useSelector(
    (state) => state.savings || { plans: [], status: "idle" }
  );

  const [favorites, setFavorites] = useState(() => {
    const stored = safeParseFavorites(localStorage.getItem(FAVORITES_KEY));
    if (stored?.length) return stored;
    return ["transfer_money", "send_cash"];
  });

  useEffect(() => {
    if (txStatus === "idle") {
      dispatch(fetchTransactions({ accountId: ACCOUNT_ID }));
    }
    if (savingsStatus === "idle") {
      dispatch(fetchSavingsPlans());
    }
  }, [dispatch, txStatus, savingsStatus]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const formatMoney = (amount) => {
    const n = Number(amount ?? 0);
    return n.toLocaleString("en-ZA", { maximumFractionDigits: 0 });
  };

  const getPlanProgress = (plan) => {
    const explicit = Number(plan?.progress);
    if (Number.isFinite(explicit)) return Math.min(Math.max(explicit, 0), 100);

    const current = Number(plan?.currentAmount);
    const target = Number(plan?.targetAmount);
    if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0) return 0;
    return Math.min(Math.max((current / target) * 100, 0), 100);
  };

  const recentTransactions = useMemo(() => {
    const list = Array.isArray(txItems) ? txItems : [];
    return list.slice(0, 4);
  }, [txItems]);

  const favoriteItems = useMemo(() => {
    const map = new Map(FAVORITE_OPTIONS.map((o) => [o.id, o]));
    return favorites.map((id) => map.get(id)).filter(Boolean);
  }, [favorites]);

  const addFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((x) => x !== id));
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
        

        <section className="card">
          <div className="card__head dashboard-favs__head">
            <h2 className="card__title">Favorites</h2>
            <details className="dashboard-favs__menu">
              <summary className="btn btn--outline btn--sm">
                Add favorite
              </summary>
              <div className="dashboard-favs__menu-panel" role="menu">
                {FAVORITE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className="dashboard-favs__menu-item"
                    onClick={(e) => {
                      addFavorite(opt.id);
                      e.currentTarget.closest("details")?.removeAttribute("open");
                    }}
                    disabled={favorites.includes(opt.id)}
                    role="menuitem"
                  >
                    <span className="dashboard-favs__menu-label">{opt.label}</span>
                    {opt.meta && <span className="dashboard-favs__menu-meta">{opt.meta}</span>}
                  </button>
                ))}
              </div>
            </details>
          </div>

          {favoriteItems.length === 0 ? (
            <p className="text-muted">Add shortcuts for your daily actions.</p>
          ) : (
            <div className="dashboard-favs__list">
              {favoriteItems.map((fav) => (
                <div key={fav.id} className="dashboard-favs__item">
                  <Link className="dashboard-favs__link" to={fav.to}>
                    <span className="dashboard-favs__label">{fav.label}</span>
                    {fav.meta && <span className="dashboard-favs__meta">{fav.meta}</span>}
                  </Link>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => removeFavorite(fav.id)}
                    aria-label={`Remove ${fav.label} from favorites`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card__head">
            <h2 className="card__title">Recent Activity</h2>
            <div className="dashboard-view__cta">
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  const ok = window.confirm("Clear recent activity? (mock)");
                  if (!ok) return;
                  dispatch(clearTransactions());
                }}
              >
                Clear
              </button>
              <Link className="btn btn--ghost btn--sm" to="/transactions">
                View all
              </Link>
            </div>
          </div>

          {txStatus === "loading" && (
            <div className="dashboard-view__tx-list" aria-busy="true">
              {[0, 1, 2].map((n) => (
                <div className="dashboard-view__tx" key={n}>
                  <span className="text-muted">Loading…</span>
                  <span className="text-muted">—</span>
                </div>
              ))}
            </div>
          )}

          {txStatus !== "loading" && recentTransactions.length === 0 && (
            <p className="text-muted">No transactions yet.</p>
          )}

          {txStatus !== "loading" && recentTransactions.length > 0 && (
            <div className="dashboard-view__tx-list">
              {recentTransactions.map((tx) => (
                <div key={tx.transactionId} className="dashboard-view__tx">
                  <div>
                    <div className="dashboard-view__tx-meta">
                      <span className="pill pill--muted">{tx.type}</span>
                      <span className="dashboard-view__tx-date">
                        {new Date(tx.date).toLocaleDateString("en-ZA", {
                          month: "short",
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-muted">{tx.transactionId}</div>
                  </div>

                  <div className="dashboard-view__tx-amount">
                    R{" "}
                    {Number(tx.amount ?? 0).toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        

        <section className="card dashboard-view__full">
          <div className="card__head">
            <h2 className="card__title">Savings Plans</h2>
            <Link to="/savings" className="link">View all</Link>
          </div>

          {savingsPlans.length === 0 ? (
            <div className="savings-overview__empty">
              <p className="text-muted">No savings plans yet.</p>
              <Link to="/savings" className="btn btn--primary btn--small">
                Create your first plan
              </Link>
            </div>
          ) : (
            <div className="savings-overview">
              {savingsPlans.slice(0, 2).map((plan) => (
                <div key={plan._id} className="savings-plan-summary">
                  {(() => {
                    const progress = getPlanProgress(plan);
                    const currentAmount = Number(plan?.currentAmount ?? 0);
                    const targetAmount = Number(plan?.targetAmount ?? 0);
                    return (
                      <>
                        <div className="savings-plan-summary__header">
                          <h4>{plan.name}</h4>
                          <span className={`status-badge status-${plan.status}`}>
                            {plan.status}
                          </span>
                        </div>

                        <div className="savings-plan-summary__progress">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="progress-text">
                            R {currentAmount.toLocaleString("en-ZA")} / R{" "}
                            {targetAmount.toLocaleString("en-ZA")}
                          </div>
                        </div>

                        <div className="savings-plan-summary__meta">
                          <span>Due: {new Date(plan.deadline).toLocaleDateString('en-ZA')}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ))}

              {savingsPlans.length > 2 && (
                <div className="savings-overview__more">
                  <Link to="/savings" className="link">
                    +{savingsPlans.length - 2} more plans
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
