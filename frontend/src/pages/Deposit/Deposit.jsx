import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { depositAsync } from "../../features/depositSlice";
import "./deposit.css";

export default function Deposit() {
  const dispatch = useDispatch();
  const { loading, status } = useSelector((state) => state.deposit);
  const [amount, setAmount] = useState("");

  const handleDeposit = () => {
    const numericAmount = Number(amount);

    if (!amount || numericAmount <= 0) return;

    dispatch(depositAsync(numericAmount));
    setAmount("");
  };

  return (
    <div className="deposit-page">
      <div className="deposit-card">
        <h1 className="deposit-title">Deposit Funds</h1>
        <p className="deposit-description">
          Add money to your account quickly and securely. Enter an amount and submit to update your balance.
        </p>

        <div className="deposit-form">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <button onClick={handleDeposit} disabled={loading}>
            {loading ? "Depositing..." : "Deposit"}
          </button>
        </div>

        {status && (
          <div className={`deposit-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
