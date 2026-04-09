import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdraw, resetWithdraw } from "../../features/withdrawSlice";
import "./Withdraw.css";

const ACCOUNT_ID = "acc_001";

export default function Withdraw() {
  const dispatch = useDispatch();
  const { status, error, lastTransaction } = useSelector((state) => state.withdraw);

  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");

  // Reset slice state when the component unmounts
  useEffect(() => {
    return () => dispatch(resetWithdraw());
  }, [dispatch]);

  const validate = () => {
    if (!amount || isNaN(amount)) {
      setValidationError("Please enter a valid amount.");
      return false;
    }
    if (parseFloat(amount) <= 0) {
      setValidationError("Amount must be greater than R 0.00.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(withdraw({ accountId: ACCOUNT_ID, amount: parseFloat(amount) }));
  };

  const handleReset = () => {
    setAmount("");
    setValidationError("");
    dispatch(resetWithdraw());
  };

  const isLoading = status === "loading";

  return (
    <div className="withdraw-page">
      <div className="withdraw-card">
        <div className="withdraw-card__header">
          <h1 className="withdraw-card__title">Withdraw Funds</h1>
          <p className="withdraw-card__subtitle">
            Funds will be debited from your account immediately.
          </p>
        </div>

        {/* Success State */}
        {status === "succeeded" && lastTransaction && (
          <div className="withdraw-success">
            <div className="withdraw-success__icon">✓</div>
            <h2 className="withdraw-success__heading">Withdrawal Successful</h2>
            <p className="withdraw-success__amount">
              R {lastTransaction.amount.toFixed(2)}
            </p>
            <div className="withdraw-success__details">
              <div className="withdraw-success__row">
                <span>Transaction ID</span>
                <span>{lastTransaction.transactionId}</span>
              </div>
              <div className="withdraw-success__row">
                <span>New Balance</span>
                <span>R {lastTransaction.balanceAfter.toFixed(2)}</span>
              </div>
              <div className="withdraw-success__row">
                <span>Date</span>
                <span>{new Date(lastTransaction.date).toLocaleString()}</span>
              </div>
            </div>
            <button className="btn btn--primary" onClick={handleReset}>
              Make Another Withdrawal
            </button>
          </div>
        )}

        {/* Form State */}
        {status !== "succeeded" && (
          <form className="withdraw-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Amount (ZAR)
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">R</span>
                <input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className={`form-input ${validationError ? "form-input--error" : ""}`}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  disabled={isLoading}
                />
              </div>
              {validationError && (
                <p className="form-error">{validationError}</p>
              )}
            </div>

            {/* API error */}
            {status === "failed" && error && (
              <div className="withdraw-alert withdraw-alert--error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn__spinner" aria-label="Processing" />
              ) : (
                "Withdraw"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}