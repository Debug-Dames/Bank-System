import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdraw, resetWithdraw } from "../../features/withdrawSlice";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "../../components/ui/styles/alert.css";
import "./withdraw.css";

const ACCOUNT_ID = "acc_001";

export default function Withdraw() {
  const dispatch = useDispatch();
  const { status, error, lastTransaction } = useSelector((state) => state.withdraw);

  const [amount, setAmount]               = useState("");
  const [validationError, setValidation]  = useState("");

  useEffect(() => {
    return () => dispatch(resetWithdraw());
  }, [dispatch]);

  const validate = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(withdraw({ accountId: ACCOUNT_ID, amount: parseFloat(amount) }));
  };

  const handleReset = () => {
    setAmount("");
    setValidation("");
    dispatch(resetWithdraw());
  };

  const isLoading = status === "loading";

  return (
    <div className="withdraw-page">
      <div className="card card--narrow withdraw-card">

        {/* ── Success ─────────────────────────────────────────── */}
        {status === "succeeded" && lastTransaction && (
          <div className="withdraw-success animate-fadeUp">
            <div className="withdraw-success__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="withdraw-success__copy">
              <p className="withdraw-success__label">Transaction Complete</p>
              <h2 className="withdraw-success__amount">
                R {lastTransaction.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="withdraw-success__details">
              <div className="withdraw-success__row">
                <span>Transaction ID</span>
                <span className="withdraw-success__mono">{lastTransaction.transactionId}</span>
              </div>
              <div className="withdraw-success__row">
                <span>New Balance</span>
                <span>R {lastTransaction.balanceAfter.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="withdraw-success__row">
                <span>Date</span>
                <span>{new Date(lastTransaction.date).toLocaleString("en-ZA")}</span>
              </div>
            </div>

            <button className="btn btn--outline btn--full" onClick={handleReset}>
              New Withdrawal
            </button>
          </div>
        )}

        {/* ── Form ────────────────────────────────────────────── */}
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

            <form className="withdraw-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Amount (ZAR)
                </label>
                <div className={`input-wrapper${validationError ? " input-wrapper--error" : ""}`}>
                  <span className="input-prefix">R</span>
                  <input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="form-input"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (validationError) setValidation("");
                    }}
                    disabled={isLoading}
                  />
                </div>
                {validationError && (
                  <p className="form-error">{validationError}</p>
                )}
              </div>

              {status === "failed" && error && (
                <div className="alert alert--error">
                  <span className="alert__indicator" />
                  <span className="alert__message">{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn--primary btn--full"
                disabled={isLoading}
              >
                {isLoading
                  ? <span className="btn__spinner" aria-label="Processing" />
                  : "Confirm Withdrawal"
                }
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}