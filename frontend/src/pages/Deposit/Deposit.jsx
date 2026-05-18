import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { depositMoney, clearStatus, fetchTransactions } from "../../features/transactionSlice";
import { fetchAccounts, setSelectedAccount, updateAccountBalance } from "../../features/accountSlice";


import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "../../components/ui/styles/alert.css";
import "./deposit.css";

const PRESETS = [500, 1000, 2500, 5000];

export default function Deposit() {
  const dispatch = useDispatch();

  // 🔹 Redux state
  const {
    accounts,
    selectedAccount,
    isLoading: accountsLoading,
    error: accountsError,
  } =
    useSelector((state) => state.accounts);

  const {
    transactions,
    isLoading,
    error,
    success,
  } = useSelector((state) => state.transactions);

  // 🔹 Local state
  const [amount, setAmount] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [validationError, setValidation] = useState("");
  const [lastTransaction, setLastTransaction] = useState(null);

  const inputRef = useRef(null);

  const numericAmount = parseFloat(amount) || 0;
  const availableBalance = selectedAccount?.availableBalance ?? 0;

  // ✅ Load accounts on mount
  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchAccounts());
    }, 800);
  }, [dispatch]);

  // ✅ Fetch transactions when account changes
  useEffect(() => {
    if (selectedAccount?._id) {
      dispatch(fetchTransactions({ accountId: selectedAccount._id }));
    }
  }, [selectedAccount, dispatch]);

  // ✅ Capture latest transaction after deposit
  useEffect(() => {
    if (success && transactions.length > 0) {
      const tx = transactions[0];

      setLastTransaction(tx);

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
    }
  }, [success, transactions, dispatch, selectedAccount]);

  // ✅ Cleanup
  useEffect(() => {
    return () => dispatch(clearStatus());
  }, [dispatch]);

  // 🔍 Validation
  const validate = () => {
    if (!selectedAccount) {
      setValidation("Please select an account.");
      return false;
    }
    if (!amount || isNaN(amount)) {
      setValidation("Enter a valid amount.");
      return false;
    }
    if (numericAmount <= 0) {
      setValidation("Amount must be greater than R0.");
      return false;
    }
    if (numericAmount < 10) {
      setValidation("Minimum deposit amount is R10.");
      return false;
    }
    setValidation("");
    return true;
  };

  // 💸 Deposit handler
  const handleDeposit = () => {
    if (!validate()) return;

    dispatch(
      depositMoney({
        accountId: selectedAccount._id,
        amount: numericAmount,
        note: "Deposit from app",
      })
    );
  };

  const depositDisabled =
    accountsLoading ||
    !selectedAccount ||
    isLoading ||
    Boolean(accountsError);

  const handlePreset = (val) => {
    setAmount(String(val));
    setValidation("");
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setAmount("");
    setValidation("");
    setShowBalance(false);
    setLastTransaction(null);
    dispatch(clearStatus());
  };

  return (
    <div className="deposit-page">

      <span className="deposit-glyph">R</span>

      <div className="card card--narrow deposit-card">

        {/* ✅ SUCCESS SCREEN */}
        {success && lastTransaction ? (
          <div className="deposit-success">

            <div className="deposit-success__icon">✔</div>

            <div className="deposit-success__copy">
              <p>Deposit Complete</p>
              <h2>
                R{" "}
                {lastTransaction.amount?.toLocaleString("en-ZA", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>

            <div className="deposit-success__details">

              <div>
                <span>Transaction ID</span>
                <span>{lastTransaction.transactionId}</span>
              </div>

              <div>
                <span>New Balance</span>
                <span>
                  R{" "}
                  {lastTransaction.balanceAfter?.toLocaleString("en-ZA", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div>
                <span>Date</span>
                <span>
                  {new Date(
                    lastTransaction.processedAt || Date.now()
                  ).toLocaleString("en-ZA")}
                </span>
              </div>

            </div>

            <button
              className="btn btn--outline btn--full"
              onClick={handleReset}
            >
              New Deposit
            </button>

          </div>

        ) : (
          <>
            {/* HEADER */}
            <div className="card__head">
              <h1>Deposit Funds</h1>
              <p>Funds will reflect immediately.</p>
            </div>

            {/* ACCOUNT SELECT */}
            <div className="form-group">
              <label>Select Account</label>
              <select
                className="form-input"
                value={selectedAccount?._id || ""}
                disabled={accountsLoading || Boolean(accountsError)}
                onChange={(e) => {
                  const acc = accounts.find(a => a._id === e.target.value);
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
                  No account found. Open an account before depositing.
                </p>
              )}
            </div>

            {/* BALANCE */}
            <div className="deposit-balance">
              {!showBalance ? (
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setShowBalance(true)}
                  disabled={!selectedAccount}
                >
                  View Balance
                </button>
              ) : (
                <>
                  <span>Available Balance</span>
                  <span>
                    R {availableBalance.toLocaleString("en-ZA")}
                  </span>
                </>
              )}
            </div>

            {/* FORM */}
            <div className="deposit-form">

              {/* PRESETS */}
              <div className="deposit-presets">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    className={`deposit-preset ${
                      numericAmount === p ? "deposit-preset--active" : ""
                    }`}
                    onClick={() => handlePreset(p)}
                    type="button"
                  >
                    R {p}
                  </button>
                ))}
              </div>

              {/* INPUT */}
              <div className="form-group">
                <label>Amount</label>
                <input
                  ref={inputRef}
                  type="number"
                  placeholder="0.00"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={depositDisabled}
                />
                {validationError && (
                  <p className="form-error">{validationError}</p>
                )}
              </div>

              {/* ERROR */}
              {error && (
                <div className="alert alert--error">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                className="btn btn--primary btn--full"
                onClick={handleDeposit}
                disabled={depositDisabled}
              >
                {accountsLoading
                  ? "Loading Accounts..."
                  : isLoading
                  ? "Processing..."
                  : "Confirm Deposit"}
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
