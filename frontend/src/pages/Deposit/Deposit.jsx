import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { depositAsync, resetDeposit } from "../../features/depositSlice";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "../../components/ui/styles/alert.css";
import "./deposit.css";

const PRESETS = [500, 1000, 2500, 5000];

const ACCOUNTS = [
  { id: "acc_001", name: "Main Account" },
  { id: "acc_002", name: "Savings Account" },
];

export default function Deposit() {
  const dispatch = useDispatch();
  const { status, error, lastTransaction } = useSelector((state) => state.deposit);
  const { balance } = useSelector((s) => s.auth);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState("");
  const [validationError, setValidation] = useState("");

  const inputRef = useRef(null);

  const isLoading = status === "loading";
  const numericAmount = parseFloat(amount) || 0;
  const availableBalance = balance ?? 0;

  // Reset on unmount
  useEffect(() => {
    return () => dispatch(resetDeposit());
  }, [dispatch]);

  const validate = () => {
    if (!selectedAccount) {
      setValidation("Please select an account.");
      return false;
    }
    if (!amount || isNaN(amount)) {
      setValidation("Please enter a valid amount.");
      return false;
    }
    if (parseFloat(amount) <= 0) {
      setValidation("Amount must be greater than R 0.00.");
      return false;
    }
    setValidation("");
    return true;
  };

  const handleDeposit = () => {
    if (!validate()) return;
    dispatch(depositAsync({ accountId: selectedAccount, amount: numericAmount }));
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
    dispatch(resetDeposit());
  };

  return (
    <div className="deposit-page">

      <span className="deposit-glyph" aria-hidden="true">R</span>

      <div className="card card--narrow deposit-card">

        {/* ── Success ──────────────────────────────────────── */}
        {status === "succeeded" && lastTransaction ? (
          <div className="deposit-success animate-fadeUp">
            <div className="deposit-success__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="deposit-success__copy">
              <p className="deposit-success__label">Deposit Complete</p>
              <h2 className="deposit-success__amount">
                R {lastTransaction.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="deposit-success__details">
              <div className="deposit-success__row">
                <span>Transaction ID</span>
                <span className="deposit-success__mono">{lastTransaction.transactionId}</span>
              </div>
              <div className="deposit-success__row">
                <span>New Balance</span>
                <span>R {lastTransaction.balanceAfter.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="deposit-success__row">
                <span>Date</span>
                <span>{new Date(lastTransaction.date).toLocaleString("en-ZA")}</span>
              </div>
            </div>

            <div className="deposit-success__actions">
              <button className="btn btn--outline btn--full" onClick={handleReset}>
                New Deposit
              </button>
            </div>
          </div>

        ) : (
          <>
            {/* ── Header ───────────────────────────────────── */}
            <div className="card__head deposit-header">
              <div>
                <p className="deposit-eyebrow">Credit</p>
                <h1 className="deposit-title">Deposit Funds</h1>
                <p className="deposit-description">
                  Funds will be credited to your account immediately.
                </p>
              </div>
            </div>

            {/* ── Account Select ────────────────────────────── */}
            <div className="form-group deposit-account">
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

            {/* ── Live balance ──────────────────────────────── */}
            <div className="deposit-balance">
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
                  <span className="deposit-balance__label">Available Balance</span>
                  <span className="deposit-balance__amount">
                    R {availableBalance.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </span>
                </>
              )}
            </div>

            {/* ── Form ─────────────────────────────────────── */}
            <div className="deposit-form">

              {/* Preset amounts */}
              <div className="deposit-presets">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`deposit-preset${numericAmount === p ? " deposit-preset--active" : ""}`}
                    onClick={() => handlePreset(p)}
                    disabled={!selectedAccount}
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
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isLoading || !selectedAccount}
                  />
                </div>
                {validationError && <p className="form-error">{validationError}</p>}
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
                type="button"
                className="btn btn--primary btn--full"
                onClick={handleDeposit}
                disabled={isLoading}
              >
                {isLoading
                  ? <span className="btn__spinner" aria-label="Processing" />
                  : "Confirm Deposit"
                }
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}