import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdraw, resetWithdraw } from "../../features/withdrawSlice";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "../../components/ui/styles/alert.css";
import "./withdraw.css";

const PRESETS = [500, 1000, 2500, 5000];

// simple accounts
const ACCOUNTS = [
  { id: "acc_001", name: "Main Account" },
  { id: "acc_002", name: "Savings Account" },
];

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

  const { status, error, lastTransaction } = useSelector((s) => s.withdraw);
  const { balance } = useSelector((s) => s.auth);
  const { savingsBalance } = useSelector((s) => s.savings);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [showBalance, setShowBalance] = useState(false);

  const [amount, setAmount] = useState("");
  const [validationError, setValidation] = useState("");
  const [btnLabel, setBtnLabel] = useState(LABEL.idle);
  const [shake, setShake] = useState(false);

  const inputRef = useRef(null);

  // Reset 
  useEffect(() => {
    return () => dispatch(resetWithdraw());
  }, [dispatch]);

  // Button label 
  useEffect(() => {
    if (status === "loading") {
      setBtnLabel(LABEL.loading);
    } else if (status === "succeeded") {
      setBtnLabel(LABEL.confirm);
      setTimeout(() => setBtnLabel(LABEL.idle), 1800);
    } else {
      setBtnLabel(LABEL.idle);
    }
  }, [status]);

  const numericAmount = parseFloat(amount) || 0;
  const availableBalance =
    selectedAccount === "acc_002" ? (savingsBalance ?? 0) : (balance ?? 0);
  const balanceAfterPreview = availableBalance - numericAmount;

  const showPreview =
    numericAmount > 0 &&
    numericAmount <= availableBalance &&
    showBalance;

  const tickedAmount = useCountUp(
    status === "succeeded" && lastTransaction
      ? lastTransaction.amount
      : 0
  );

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  
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

    if (parseFloat(amount) > availableBalance) {
      setValidation("Amount exceeds your available balance.");
      triggerShake();
      return false;
    }

    setValidation("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      withdraw({
        accountId: selectedAccount,
        amount: parseFloat(amount),
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
    setSelectedAccount("");
    dispatch(resetWithdraw());
  };

  const isLoading = status === "loading";

  return (
    <div className="withdraw-page">

      <span className="withdraw-glyph" aria-hidden="true">R</span>

      <div className={`card card--narrow withdraw-card${shake ? " withdraw-card--shake" : ""}`}>

         {/* ── Success ──────────────────────────────────────── */}
        {status === "succeeded" && lastTransaction && (
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
                <span className="withdraw-success__mono">{lastTransaction.transactionId}</span>
              </div>
              <div className="withdraw-success__row">
                <span>New Balance</span>
                <span>
                  R {lastTransaction.balanceAfter.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="withdraw-success__row">
                <span>Date</span>
                <span>{new Date(lastTransaction.date).toLocaleString("en-ZA")}</span>
              </div>
            </div>

            <div className="withdraw-success__actions">
              <button className="btn btn--outline btn--full" onClick={handleReset}>
                New Withdrawal
              </button>
            </div>
          </div>
        )}

        {/* ── Form ─────────────────────────────────────────── */}
        {status !== "succeeded" && (
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

            {/* ✅ Account Select */}
            <div className="form-group withdraw-account">
              <label className="form-label">Select Account</label>
              <select
                className="form-input"
                value={selectedAccount}
                onChange={(e) => {
                  setSelectedAccount(e.target.value);
                  setShowBalance(false);
                }}
              >
                <option value="">-- Choose account --</option>
                {ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live balance */}
            <div className="withdraw-balance">
              {!showBalance ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setShowBalance(true)}
                  disabled={!selectedAccount}
                >
                  View Balance
                </button>
              ) : (
                <>
                  <span className="withdraw-balance__label">Available Balance</span>
                  <span className="withdraw-balance__amount">
                    R {availableBalance.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </span>
                </>
              )}
            </div>

            <form className="withdraw-form" onSubmit={handleSubmit} noValidate>

              {/* Preset amounts */}
              <div className="withdraw-presets">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`withdraw-preset${numericAmount === p ? " withdraw-preset--active" : ""}`}
                    onClick={() => handlePreset(p)}
                    disabled={!showBalance || p > availableBalance}
                  >
                    R {p.toLocaleString("en-ZA")}
                  </button>
                ))}
              </div>

              {/* Amount input */}
              <div className="form-group">
                <label className="form-label">Amount (ZAR)</label>
                <div className={`input-wrapper${validationError ? " input-wrapper--error" : ""}`}>
                  <span className={`input-prefix${amount ? " input-prefix--active" : ""}`}>R</span>
                  <input
                    ref={inputRef}
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading || !showBalance}
                  />
                </div>
                {validationError && <p className="form-error">{validationError}</p>}
              </div>

              {/* Live preview */}
              <div className={`withdraw-preview${showPreview ? " withdraw-preview--visible" : ""}`}>
                <span>Balance after withdrawal</span>
                <span>
                  R {Math.max(balanceAfterPreview, 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* API error */}
              {status === "failed" && error && (
                <div className="alert alert--error">
                  <span className="alert__indicator" />
                  <span className="alert__message">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`btn btn--primary btn--full withdraw-btn${isLoading ? " withdraw-btn--loading" : ""}`}
                disabled={isLoading}
              >
                {btnLabel}
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
}
