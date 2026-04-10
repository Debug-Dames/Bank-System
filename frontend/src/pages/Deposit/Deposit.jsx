import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { depositAsync, resetDeposit } from "../../features/depositSlice";
import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "../../components/ui/styles/alert.css";
import "./deposit.css";

const ACCOUNT_ID = "acc_001";

export default function Deposit() {
  const dispatch = useDispatch();
  const { status, error, lastTransaction } = useSelector((state) => state.deposit);
  const [amount, setAmount] = useState("");

  const isLoading = status === "loading";

  const handleDeposit = () => {
    const numericAmount = Number(amount);

    if (!amount || numericAmount <= 0) return;

    dispatch(depositAsync({ accountId: ACCOUNT_ID, amount: numericAmount }));
  };

  const handleReset = () => {
    setAmount("");
    dispatch(resetDeposit());
  };

  return (
    <div className="deposit-page">
      <div className="card card--narrow deposit-card">
        {status === "succeeded" && lastTransaction ? (
          <div className="deposit-success">
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

            <button className="btn btn--outline btn--full" onClick={handleReset}>
              New Deposit
            </button>
          </div>
        ) : (
          <>
            <div className="deposit-header">
              <p className="deposit-eyebrow">Credit</p>
              <h1 className="deposit-title">Deposit Funds</h1>
              <p className="deposit-description">
                Add money to your account quickly and securely. Enter an amount and submit to update your balance.
              </p>
            </div>

            {status === "failed" && error && (
              <div className="alert alert--error">
                <span className="alert__indicator" />
                <span className="alert__message">{error}</span>
              </div>
            )}

            <div className="deposit-form">
              <div className="form-group">
                <label htmlFor="amount" className="form-label">Amount (ZAR)</label>
                <input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button
                type="button"
                className="btn btn--primary btn--full"
                onClick={handleDeposit}
                disabled={isLoading}
              >
                {isLoading
                  ? <span className="btn__spinner" aria-label="Processing" />
                  : "Deposit"
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
