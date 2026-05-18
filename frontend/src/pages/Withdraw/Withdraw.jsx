import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  setSelectedAccount,
  updateAccountBalance,
} from "../../features/accountSlice";
import { withdrawMoney, clearStatus } from "../../features/transactionSlice";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "../../components/ui/styles/alert.css";
import "./withdraw.css";

const PRESETS = [500, 1000, 2500, 5000];

// ── Number ticker ────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!target) return;

    let start = null;

    const step = (ts) => {
      if (!start) start = ts;

      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(target * eased);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

// ── Button label states ──────────────────────────────────────
const LABEL = {
  idle: "Confirm Withdrawal",
  loading: "Authorising...",
  confirm: "Confirmed",
};

export default function Withdraw() {
  const dispatch = useDispatch();

  // ✅ FROM TRANSACTION SLICE (source of truth)
  const { transactions, isLoading, error, success } = useSelector(
    (state) => state.transactions
  );

  // ✅ ACCOUNTS FROM ACCOUNT SLICE
  const {
    accounts,
    selectedAccount,
    isLoading: accountsLoading,
    error: accountsError,
  } = useSelector(
    (state) => state.accounts
  );

  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [validationError, setValidation] = useState("");
  const [shake, setShake] = useState(false);

  const inputRef = useRef(null);

  // ── Load accounts
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  // ── Clear transaction status on unmount
  useEffect(() => {
    return () => dispatch(clearStatus());
  }, [dispatch]);

  // ── refresh accounts AFTER success (instant sync)
  useEffect(() => {
    if (success) {
      const tx = transactions?.[0];
      const updatedBalance =
        tx?.balanceAfter ??
        tx?.account?.availableBalance ??
        tx?.availableBalance;

      if (selectedAccount?._id && updatedBalance != null) {
        dispatch(
          updateAccountBalance({
            accountId: selectedAccount._id,
            balance: updatedBalance,
          })
        );
      }

      dispatch(fetchAccounts());
    }
  }, [success, transactions, dispatch, selectedAccount]);

  const numericAmount = parseFloat(amount) || 0;

  // ✅ BALANCE COMES FROM TRANSACTION SLICE (instant update source)
  const availableBalance =
    selectedAccount?.availableBalance ??
    selectedAccount?.balance ??
    0;

  const balanceAfterPreview = availableBalance - numericAmount;

  const showPreview =
    numericAmount > 0 &&
    numericAmount <= availableBalance &&
    showBalance;

  const lastTransaction = transactions?.[0];

  const tickedAmount = useCountUp(
    success && lastTransaction ? lastTransaction.amount : 0
  );

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // ── validation
  const validate = () => {
    if (!selectedAccount) {
      setValidation("Please select an account.");
      triggerShake();
      return false;
    }

    if (!showBalance) {
      setValidation("Please view your balance first.");
      triggerShake();
      return false;
    }

    if (!amount || isNaN(amount)) {
      setValidation("Please enter a valid amount.");
      triggerShake();
      return false;
    }

    if (parseFloat(amount) <= 0) {
      setValidation("Amount must be greater than R 0.00.");
      triggerShake();
      return false;
    }

    if (parseFloat(amount) < 50) {
      setValidation("Minimum withdrawal amount is R50.");
      triggerShake();
      return false;
    }

    if (parseFloat(amount) > availableBalance) {
      setValidation("Amount exceeds your available balance.");
      triggerShake();
      return false;
    }

    setValidation("");
    return true;
  };

  // ── submit (NOW USES transactionSlice)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      withdrawMoney({
        accountId: selectedAccount?._id,
        amount: parseFloat(amount),
        note: "Withdrawal from app",
      })
    );
  };

  const handlePreset = (val) => {
    setAmount(String(val));
    setValidation("");
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setAmount("");
    setValidation("");
    setShowBalance(false);
    dispatch(clearStatus());
  };

  const btnLabel =
    isLoading
      ? LABEL.loading
      : success
      ? LABEL.confirm
      : LABEL.idle;

  const withdrawDisabled =
    accountsLoading ||
    Boolean(accountsError) ||
    !selectedAccount ||
    isLoading;

  return (
    <div className="withdraw-page">

      <span className="withdraw-glyph" aria-hidden="true">R</span>

      <div className={`card card--narrow withdraw-card${shake ? " withdraw-card--shake" : ""}`}>

        {/* ── Success ──────────────────────────────────────── */}
        {success && lastTransaction && (
          <div className="withdraw-success animate-fadeUp">
            <div className="withdraw-success__copy">
              <p className="withdraw-eyebrow">Transaction Complete</p>
              <h2 className="withdraw-success__amount">
                R {tickedAmount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="withdraw-success__details">
              <div className="withdraw-success__row">
                <span>Transaction ID</span>
                <span className="withdraw-success__mono">
                  {lastTransaction.transactionId}
                </span>
              </div>

              <div className="withdraw-success__row">
                <span>New Balance</span>
                <span>
                  R {lastTransaction.balanceAfter?.toLocaleString("en-ZA", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="withdraw-success__row">
                <span>Date</span>
                <span>
                  {new Date(
                    lastTransaction.processedAt || lastTransaction.date || Date.now()
                  ).toLocaleString("en-ZA")}
                </span>
              </div>
            </div>

            <div className="withdraw-success__actions">
              <button className="btn btn--outline btn--full" onClick={handleReset}>
                New Withdrawal
              </button>
            </div>
          </div>
        )}

        {/* ── FORM ─────────────────────────────────────────── */}
        {!success && (
          <>
            <div className="card__head">
              <div>
                <p className="withdraw-eyebrow">Debit</p>
                <h1 className="withdraw-title">Withdraw Funds</h1>
                <p className="withdraw-subtitle">
                  Funds will be debited from your account immediately.
                </p>
              </div>
            </div>

            {/* ACCOUNT SELECT (FIXED) */}
            <div className="form-group withdraw-account">
              <label className="form-label">Select Account</label>
              <select
                className="form-input"
                value={selectedAccount?._id || ""}
                disabled={accountsLoading || Boolean(accountsError)}
                onChange={(e) => {
                  const acc = accounts.find(
                    (a) => a._id === e.target.value
                  );
                  dispatch(setSelectedAccount(acc));
                  setShowBalance(false);
                }}
              >
                <option value="">
                  {accountsLoading ? "Loading accounts..." : "-- Choose account --"}
                </option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountType || acc.name}
                  </option>
                ))}
              </select>
              {accountsError && (
                <p className="form-error">{accountsError}</p>
              )}
              {!accountsLoading && !accountsError && accounts.length === 0 && (
                <p className="form-error">
                  No account found. Please log in again.
                </p>
              )}
            </div>

            {/* BALANCE */}
            <div className="withdraw-balance">
              {!showBalance ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setShowBalance(true)}
                  disabled={withdrawDisabled}
                >
                  View Balance
                </button>
              ) : (
                <>
                  <span className="withdraw-balance__label">
                    Available Balance
                  </span>
                  <span className="withdraw-balance__amount">
                    R {availableBalance.toLocaleString("en-ZA", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </>
              )}
            </div>

            <form className="withdraw-form" onSubmit={handleSubmit} noValidate>

              {/* PRESETS */}
              <div className="withdraw-presets">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`withdraw-preset${
                      numericAmount === p ? " withdraw-preset--active" : ""
                    }`}
                    onClick={() => handlePreset(p)}
                    disabled={!showBalance || p > availableBalance}
                  >
                    R {p.toLocaleString("en-ZA")}
                  </button>
                ))}
              </div>

              {/* INPUT */}
              <div className="form-group">
                <label className="form-label">Amount (ZAR)</label>

                <div
                  className={`input-wrapper${
                    validationError ? " input-wrapper--error" : ""
                  }`}
                >
                  <span
                    className={`input-prefix${
                      amount ? " input-prefix--active" : ""
                    }`}
                  >
                    R
                  </span>

                  <input
                    ref={inputRef}
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={withdrawDisabled || !showBalance}
                  />
                </div>

                {validationError && (
                  <p className="form-error">{validationError}</p>
                )}
              </div>

              {/* PREVIEW */}
              <div
                className={`withdraw-preview${
                  showPreview ? " withdraw-preview--visible" : ""
                }`}
              >
                <span>Balance after withdrawal</span>
                <span>
                  R {Math.max(balanceAfterPreview, 0).toLocaleString(
                    "en-ZA",
                    { minimumFractionDigits: 2 }
                  )}
                </span>
              </div>

              {/* ERROR */}
              {error && (
                <div className="alert alert--error">
                  <span className="alert__indicator" />
                  <span className="alert__message">{error}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className={`btn btn--primary btn--full withdraw-btn${
                  isLoading ? " withdraw-btn--loading" : ""
                }`}
                disabled={withdrawDisabled}
              >
                {accountsLoading ? "Loading Accounts..." : btnLabel}
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
