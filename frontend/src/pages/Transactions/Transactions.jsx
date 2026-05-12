import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/transactionSlice";
import { fetchAccounts } from "../../features/accountSlice";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import "../../components/ui/styles/card.css";
import "../../components/ui/styles/button.css";
import "./transactions.css";

import { jsPDF } from "jspdf";

const formatCurrency = (value = 0) =>
  `R ${Number(value).toFixed(2)}`;

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

  // FIXED REDUX STATE
  const {
    transactions: items = [],
    isLoading,
    error,
  } = useSelector((state) => state.transactions);

  const {
    accounts = [],
    isLoading: accountsLoading,
  } = useSelector((state) => state.accounts);

  const accountId = accounts?.[0]?._id;

  const [typeFilter, setTypeFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("30");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStatement, setShowStatement] = useState(false);

  // LOAD ACCOUNTS
  useEffect(() => {
    if (!accounts.length && !accountsLoading) {
      dispatch(fetchAccounts());
    }
  }, [dispatch, accounts.length, accountsLoading]);

  // LOAD TRANSACTIONS
  useEffect(() => {
    if (accountId) {
      dispatch(fetchTransactions({ accountId }));
    }
  }, [dispatch, accountId]);

  // NORMALIZE DATA
  const normalizedItems = useMemo(() => {
    return (items || []).map((tx) => ({
      ...tx,
      transactionId: tx.transactionId || tx._id,
      date: tx.date || tx.createdAt,
      balanceAfter: tx.balanceAfter ?? tx.balance ?? 0,
    }));
  }, [items]);

  // FILTERING
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    const rangeDays =
      rangeFilter === "all"
        ? null
        : Number(rangeFilter);

    const search = searchTerm.trim().toLowerCase();

    return normalizedItems
      .filter((transaction) => {
        if (
          typeFilter !== "all" &&
          transaction.type !== typeFilter
        ) {
          return false;
        }

        if (rangeDays) {
          const diffMs =
            now - new Date(transaction.date);

          const diffDays =
            diffMs / (1000 * 60 * 60 * 24);

          if (diffDays > rangeDays) {
            return false;
          }
        }

        if (!search) return true;

        return (
          transaction.transactionId
            ?.toLowerCase()
            .includes(search) ||
          transaction.type
            ?.toLowerCase()
            .includes(search) ||
          String(transaction.amount).includes(search)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      );
  }, [
    normalizedItems,
    typeFilter,
    rangeFilter,
    searchTerm,
  ]);

  // STATS
  const stats = useMemo(() => {
    const totals = filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "deposit") {
          acc.income += Number(transaction.amount);
        }

        if (transaction.type === "withdrawal") {
          acc.outcome += Number(transaction.amount);
        }

        return acc;
      },
      {
        income: 0,
        outcome: 0,
      }
    );

    return {
      count: filteredTransactions.length,
      income: totals.income,
      outcome: totals.outcome,
      net: totals.income - totals.outcome,
    };
  }, [filteredTransactions]);

  // REFRESH
  const handleRefresh = useCallback(() => {
    if (!accountId) return;

    dispatch(fetchTransactions({ accountId }));
  }, [dispatch, accountId]);

  // PDF
  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("NovaBank Statement", 20, 20);

    doc.setFontSize(12);

    doc.text(
      `Account ID: ${accountId || "—"}`,
      20,
      35
    );

    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      20,
      45
    );

    let y = 60;

    doc.text("Date", 20, y);
    doc.text("Type", 70, y);
    doc.text("Amount", 120, y);
    doc.text("Balance", 160, y);

    y += 10;

    filteredTransactions.forEach((tx) => {
      doc.text(formatDate(tx.date), 20, y);

      doc.text(tx.type, 70, y);

      doc.text(
        tx.type === "withdrawal"
          ? `-${formatCurrency(tx.amount)}`
          : formatCurrency(tx.amount),
        120,
        y
      );

      doc.text(
        formatCurrency(tx.balanceAfter),
        160,
        y
      );

      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(
      `statement_${accountId || "account"}_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  }, [filteredTransactions, accountId]);

  return (
    <div className="transactions-page">
      <div className="transactions-shell">

        <Card>
          <header className="transactions-hero">
            <div>
              <p className="transactions-hero__eyebrow">
                Account Activity
              </p>

              <h1 className="transactions-hero__title">
                Transactions
              </h1>

              <p className="transactions-hero__subtitle">
                Track deposits and withdrawals
                with real-time filters.
              </p>
            </div>

            <div className="transactions-hero__actions">
              <Button
                variant="outline"
                onClick={handleRefresh}
              >
                Refresh
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setShowStatement(!showStatement)
                }
              >
                {showStatement
                  ? "Hide Statement"
                  : "View Statement"}
              </Button>

              <Button
                variant="primary"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </Button>
            </div>
          </header>
        </Card>

        {error && (
          <Card>
            <p className="form-error">{error}</p>
          </Card>
        )}

        <Card>
          <div className="transactions-controls">

            <label className="tx-control">
              <span>Type</span>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
              >
                <option value="all">All</option>
                <option value="deposit">
                  Deposits
                </option>
                <option value="withdrawal">
                  Withdrawals
                </option>
              </select>
            </label>

            <label className="tx-control">
              <span>Range</span>

              <select
                value={rangeFilter}
                onChange={(e) =>
                  setRangeFilter(e.target.value)
                }
              >
                <option value="7">
                  Last 7 days
                </option>

                <option value="30">
                  Last 30 days
                </option>

                <option value="90">
                  Last 90 days
                </option>

                <option value="all">
                  All time
                </option>
              </select>
            </label>

            <label className="tx-control tx-control--search">
              <span>Search</span>

              <input
                type="search"
                placeholder="Search by ID, type, amount"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </label>
          </div>
        </Card>

      </div>
    </div>
  );
}