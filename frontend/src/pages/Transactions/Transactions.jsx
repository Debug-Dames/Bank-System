import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/authSlice";
import "./transactions.css";

const ACCOUNT_ID = "acc_001";

const formatCurrency = (value) => `R ${value.toFixed(2)}`;

const formatDate = (value) =>
  new Date(value).toLocaleString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Transactions() {
  const dispatch = useDispatch();
  const { status, error, items } = useSelector(
    (state) => state.auth.transactions
  );

  const [typeFilter, setTypeFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTransactions({ accountId: ACCOUNT_ID }));
    }
  }, [dispatch, status]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const rangeDays = rangeFilter === "all" ? null : Number(rangeFilter);
    const search = searchTerm.trim().toLowerCase();

    return (items || [])
      .filter((transaction) => {
        if (typeFilter !== "all" && transaction.type !== typeFilter) {
          return false;
        }
        if (rangeDays) {
          const diffMs = now - new Date(transaction.date);
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays > rangeDays) return false;
        }
        if (!search) return true;
        const idMatch = transaction.transactionId.toLowerCase().includes(search);
        const typeMatch = transaction.type.toLowerCase().includes(search);
        const amountMatch = String(transaction.amount).includes(search);
        return idMatch || typeMatch || amountMatch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [items, typeFilter, rangeFilter, searchTerm]);

  const stats = useMemo(() => {
    const totals = filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "deposit") acc.income += transaction.amount;
        if (transaction.type === "withdrawal") acc.outcome += transaction.amount;
        return acc;
      },
      { income: 0, outcome: 0 }
    );

    return {
      count: filteredTransactions.length,
      income: totals.income,
      outcome: totals.outcome,
      net: totals.income - totals.outcome,
    };
  }, [filteredTransactions]);

  const handleRefresh = () => {
    dispatch(fetchTransactions({ accountId: ACCOUNT_ID }));
  };

  const isLoading = status === "loading";

  return (
    <div className="transactions-page">
      <div className="transactions-shell">
        <header className="transactions-hero">
          <div>
            <p className="transactions-hero__eyebrow">Account Activity</p>
            <h1 className="transactions-hero__title">Transactions</h1>
            <p className="transactions-hero__subtitle">
              Track deposits and withdrawals with real-time filters.
            </p>
          </div>
          <button className="tx-btn tx-btn--ghost" onClick={handleRefresh}>
            Refresh
          </button>
        </header>

        <section className="transactions-controls">
          <label className="tx-control">
            <span>Type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
            </select>
          </label>

          <label className="tx-control">
            <span>Range</span>
            <select
              value={rangeFilter}
              onChange={(e) => setRangeFilter(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </label>

          <label className="tx-control tx-control--search">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search by ID, type, amount"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </section>

        <section className="transactions-stats">
          <div className="tx-stat">
            <p className="tx-stat__label">Transactions</p>
            <p className="tx-stat__value">{stats.count}</p>
          </div>
          <div className="tx-stat">
            <p className="tx-stat__label">Total In</p>
            <p className="tx-stat__value tx-stat__value--in">
              {formatCurrency(stats.income)}
            </p>
          </div>
          <div className="tx-stat">
            <p className="tx-stat__label">Total Out</p>
            <p className="tx-stat__value tx-stat__value--out">
              {formatCurrency(stats.outcome)}
            </p>
          </div>
          <div className="tx-stat tx-stat--accent">
            <p className="tx-stat__label">Net Flow</p>
            <p className="tx-stat__value">
              {formatCurrency(stats.net)}
            </p>
          </div>
        </section>

        <section className="transactions-card">
          <div className="transactions-card__header">
            <span>Activity</span>
            <span>Amount</span>
            <span>Balance After</span>
            <span>Date</span>
          </div>

          {isLoading && (
            <div className="transactions-skeleton">
              {[0, 1, 2, 3].map((item) => (
                <div className="tx-row tx-row--skeleton" key={item}>
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          )}

          {!isLoading && status === "failed" && (
            <div className="transactions-empty transactions-empty--error">
              {error || "Unable to load transactions."}
            </div>
          )}

          {!isLoading &&
            status !== "failed" &&
            filteredTransactions.length === 0 && (
              <div className="transactions-empty">
                No transactions match your filters yet.
              </div>
            )}

          {!isLoading &&
            status !== "failed" &&
            filteredTransactions.map((transaction, index) => (
              <div className="tx-row" style={{ animationDelay: `${index * 40}ms` }} key={transaction.transactionId}>
                <div className="tx-row__meta">
                  <span className={`tx-pill tx-pill--${transaction.type}`}>
                    {transaction.type}
                  </span>
                  <span className="tx-id">{transaction.transactionId}</span>
                </div>
                <span
                  className={`tx-amount tx-amount--${transaction.type}`}
                >
                  {transaction.type === "withdrawal" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </span>
                <span className="tx-balance">
                  {formatCurrency(transaction.balanceAfter)}
                </span>
                <span className="tx-date">{formatDate(transaction.date)}</span>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}
