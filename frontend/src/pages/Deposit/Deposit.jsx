import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";
import "./deposit.css";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeposit = () => {
    if (!amount || amount <= 0) {
      setStatus({ type: "error", message: "Enter a valid amount" });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStatus({
        type: "success",
        message: `R ${amount} deposited successfully`,
      });
      setAmount("");
    }, 1000);
  };

  return (
    <div className="deposit-page">
      <Card>
        <h2 className="deposit-title">Deposit Funds</h2>

        <div className="deposit-form">
          <Input
            label="Amount (R)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />

          <Button onClick={handleDeposit} loading={loading}>
            Deposit
          </Button>

          {status && <Alert type={status.type} message={status.message} />}
        </div>
      </Card>
    </div>
  );
}