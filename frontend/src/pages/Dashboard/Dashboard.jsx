import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateUser } from "../../features/authSlice";
import "./dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, balance, transactions } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("home");
  const [form, setForm] = useState(() => user ?? {});

  const tabTitle =
    {
      home: "Home",
      cards: "Cards",
      transact: "Transact",
      messages: "Messages",
      profile: "Profile"
    }[activeTab] || "Dashboard";

  const formatMoney = (amount) => {
    const n = Number(amount ?? 0);
    return n.toLocaleString("en-ZA", { maximumFractionDigits: 0 });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(updateUser(form));
    alert("Profile updated");
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar" aria-label="Dashboard navigation">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true" />
            <h2 className="brand-name">NovaBank</h2>
          </div>

          <button
            className={`nav-btn ${activeTab === "home" ? "is-active" : ""}`}
            onClick={() => setActiveTab("home")}
            aria-current={activeTab === "home" ? "page" : undefined}
          >
            Home
          </button>
          <button
            className={`nav-btn ${activeTab === "cards" ? "is-active" : ""}`}
            onClick={() => setActiveTab("cards")}
            aria-current={activeTab === "cards" ? "page" : undefined}
          >
            Cards
          </button>
          <button
            className={`nav-btn ${activeTab === "transact" ? "is-active" : ""}`}
            onClick={() => setActiveTab("transact")}
            aria-current={activeTab === "transact" ? "page" : undefined}
          >
            Transact
          </button>
          <button
            className={`nav-btn ${activeTab === "messages" ? "is-active" : ""}`}
            onClick={() => setActiveTab("messages")}
            aria-current={activeTab === "messages" ? "page" : undefined}
          >
            Messages
          </button>
          <button
            className={`nav-btn ${activeTab === "profile" ? "is-active" : ""}`}
            onClick={() => setActiveTab("profile")}
            aria-current={activeTab === "profile" ? "page" : undefined}
          >
            Profile
          </button>
        </aside>

        {/* Content */}
        <main className="content" aria-label="Dashboard content">
          <header className="topbar">
            <div className="topbar-left">
              <h1 className="page-title">{tabTitle}</h1>
              <p className="page-subtitle">
                Welcome back, <span className="accent">{user?.name || "User"}</span>
              </p>
            </div>

            
          </header>

        {/* HOME */}
        {activeTab === "home" && (
          <div className="pane">
            <section className="card card--hero">
              <div className="card-head">
                <h2>Main Account</h2>
                <span className="pill">Everyday</span>
              </div>
              <p className="balance">
                <span className="balance-label">Available</span>
                <span className="balance-amount">R {formatMoney(balance)}</span>
              </p>
              <div className="hero-actions">
                <Link className="action action--primary" to="/deposit">Top up</Link>
                <Link className="action" to="/withdraw">Withdraw</Link>
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Money In / Out</h2>
                <Link className="card-link" to="/transactions">View all</Link>
              </div>
              <div className="tx-list">
                {safeTransactions.map((tx) => (
                  <div key={tx.id} className="tx">
                    <span className={`pill pill--type pill--${String(tx.type).toLowerCase()}`}>
                      {tx.type}
                    </span>
                    <span className="tx-meta">
                      <span className="tx-date">{new Date(tx.date).toLocaleDateString("en-ZA")}</span>
                      <span className="tx-amount">R {formatMoney(tx.amount)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Savings Plans</h2>
                <span className="pill pill--muted">Coming soon</span>
              </div>
              <p className="muted">No savings plans yet (mock).</p>
            </section>
          </div>
        )}

        {/* CARDS */}
        {activeTab === "cards" && (
          <div className="pane">
            <section className="card">
              <div className="card-head">
                <h2>Physical Card</h2>
                <span className="pill">Active</span>
              </div>
              <div className="card-number">**** **** **** 1234</div>
              <p className="muted">Tap-to-pay enabled (mock).</p>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>Virtual Card</h2>
                <span className="pill pill--muted">Online</span>
              </div>
              <div className="card-number">**** **** **** 5678</div>
              <p className="muted">Use for safer online payments (mock).</p>
            </section>
          </div>
        )}

        {/* TRANSACT */}
        {activeTab === "transact" && (
          <div className="pane">
            <section className="card">
              <div className="card-head">
                <h2>Shortcuts</h2>
                <span className="pill">Fast</span>
              </div>
              <div className="grid">
                <Link className="tile tile--primary" to="/deposit">Deposit</Link>
                <Link className="tile" to="/withdraw">Withdraw</Link>
                <button className="tile" type="button">Pay Beneficiary</button>
                <button className="tile" type="button">Send Cash</button>
                <button className="tile" type="button">Transfer Money</button>
                <button className="tile" type="button">Buy Airtime</button>
                <button className="tile" type="button">Buy Data</button>
                <button className="tile" type="button">International Payments</button>
              </div>
            </section>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === "messages" && (
          <div className="pane">
            {safeTransactions.map((tx) => (
              <section key={tx.id} className="card">
                <div className="card-head">
                  <h2>Notification</h2>
                  <span className={`pill pill--muted pill--${String(tx.type).toLowerCase()}`}>{tx.type}</span>
                </div>
                <p>
                  You made a <strong>{tx.type}</strong> of <strong>R {formatMoney(tx.amount)}</strong> on{" "}
                  <strong>{new Date(tx.date).toLocaleDateString("en-ZA")}</strong>.
                </p>
              </section>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="pane">
            <section className="card">
              <div className="card-head">
                <h2>Profile</h2>
                <span className="pill">Secure</span>
              </div>

              <form
                className="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <label className="field">
                  <span>Name</span>
                  <input name="name" value={form.name ?? ""} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" value={form.email ?? ""} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Phone</span>
                  <input name="phone" value={form.phone ?? ""} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Address</span>
                  <input name="address" value={form.address ?? ""} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Update PIN</span>
                  <input type="password" name="pin" placeholder="New PIN" onChange={handleChange} />
                </label>

                <div className="form-actions">
                  <button className="action action--primary" type="submit">Save</button>
                  <button className="action" type="button" onClick={() => setForm(user)}>
                    Reset
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
