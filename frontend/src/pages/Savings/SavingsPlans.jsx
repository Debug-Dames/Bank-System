import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavingsPlans,
  createSavingsPlan,
  depositToSavings,
  depositToSavingsPlan,
  withdrawFromSavings,
  withdrawFromSavingsPlan,
  deleteSavingsPlan,
  clearLastAction
} from "../../features/savingsSlice";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "../../components/ui/styles/alert.css";
import "./savings.css";

export default function SavingsPlans() {
  const dispatch = useDispatch();
  const {
    plans,
    status,
    error,
    lastPlanAction,
    savingsBalance,
    transferStatus,
    transferError,
    lastTransferAction,
    lastTransferPlanId
  } = useSelector((state) => state.savings);
  const { balance } = useSelector((state) => state.auth);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [planTransferAction, setPlanTransferAction] = useState(null); // 'deposit' | 'withdraw'
  const [planTransferAmount, setPlanTransferAmount] = useState("");

  // Create form state
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    targetAmount: "",
    deadline: "",
  });

  useEffect(() => {
    dispatch(fetchSavingsPlans());
  }, [dispatch]);

  useEffect(() => {
    if (lastPlanAction || lastTransferAction) {
      const timer = setTimeout(() => {
        dispatch(clearLastAction());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastPlanAction, lastTransferAction, dispatch]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    const planData = {
      ...newPlan,
      targetAmount: parseFloat(newPlan.targetAmount),
    };

    try {
      await dispatch(createSavingsPlan(planData)).unwrap();
      setNewPlan({
        name: "",
        description: "",
        targetAmount: "",
        deadline: "",
      });
      setShowCreateForm(false);
    } catch {
      // Error is handled in the slice
    }
  };

  const handlePlanTransfer = async () => {
    const amount = parseFloat(planTransferAmount);
    if (!selectedPlan || !planTransferAction) return;
    if (!amount || amount <= 0) return;

    try {
      if (planTransferAction === "deposit") {
        await dispatch(depositToSavingsPlan({ planId: selectedPlan, amount })).unwrap();
      } else {
        await dispatch(withdrawFromSavingsPlan({ planId: selectedPlan, amount })).unwrap();
      }
      setPlanTransferAmount("");
      setSelectedPlan(null);
      setPlanTransferAction(null);
    } catch {
      // Error is handled in the slice
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Are you sure you want to delete this savings plan?")) {
      try {
        await dispatch(deleteSavingsPlan(planId)).unwrap();
      } catch {
        // Error is handled in the slice
      }
    }
  };

  const handleDepositToSavings = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;

    try {
      await dispatch(depositToSavings({ amount })).unwrap();
      setDepositAmount("");
    } catch {
      // Error is handled in the slice
    }
  };

  const handleWithdrawFromSavings = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return;

    try {
      await dispatch(withdrawFromSavings({ amount })).unwrap();
      setWithdrawAmount("");
    } catch {
      // Error is handled in the slice
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'paused': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getPlanProgress = (plan) => {
    const explicit = Number(plan?.progress);
    if (Number.isFinite(explicit)) return Math.min(Math.max(explicit, 0), 100);

    const current = Number(plan?.currentAmount);
    const target = Number(plan?.targetAmount);
    if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0) return 0;
    return Math.min(Math.max((current / target) * 100, 0), 100);
  };

  const isLoading = status === 'loading';
  const isTransferLoading = transferStatus === "loading";
  const lastTransferPlanName =
    lastTransferPlanId ? (plans.find((p) => p?._id === lastTransferPlanId)?.name || "plan") : null;

  return (
    <div className="savings-plans">
      <div className="savings-plans__header">
        <h1 className="page-title">Savings Plans</h1>
        <Button
          onClick={() => setShowCreateForm((prev) => !prev)}
          variant={showCreateForm ? "secondary" : "primary"}
        >
          {showCreateForm ? "Close" : "Create Plan"}
        </Button>
      </div>

      <Card className="savings-account">
        <div className="savings-account__balances">
          
          <div className="balance-item">
            <span className="label">Savings Balance</span>
            <span className="value">{formatCurrency(savingsBalance)}</span>
          </div>
        </div>

        <div className="savings-account__actions">
          

          
        </div>
      </Card>

      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {transferError && (
        <Alert variant="error">{transferError}</Alert>
      )}

      {lastTransferAction && (
        <Alert variant="success">
          {lastTransferAction === "transfer_deposit"
            ? "Transfer to savings successful!"
            : lastTransferAction === "transfer_withdraw"
              ? "Transfer from savings successful!"
              : lastTransferAction === "account_deposit"
                ? "Savings account deposit successful!"
                : lastTransferAction === "account_withdraw"
                  ? "Savings account withdrawal successful!"
                  : lastTransferAction === "deposit_plan"
                    ? `Deposited into ${lastTransferPlanName}.`
                    : `Withdrew from ${lastTransferPlanName}.`}
        </Alert>
      )}

      {lastPlanAction && (
        <Alert variant="success">Savings plan {lastPlanAction}d successfully!</Alert>
      )}

      {showCreateForm && (
        <Card className="savings-plans__create-form">
          <h2>Create New Savings Plan</h2>
          <form onSubmit={handleCreatePlan}>
            <div className="form-row">
              <Input
                label="Plan Name"
                type="text"
                value={newPlan.name}
                onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                placeholder="e.g., Emergency Fund"
                required
              />
              <Input
                label="Target Amount (ZAR)"
                type="number"
                value={newPlan.targetAmount}
                onChange={(e) => setNewPlan({...newPlan, targetAmount: e.target.value})}
                placeholder="5000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Deadline"
                type="date"
                value={newPlan.deadline}
                onChange={(e) => setNewPlan({...newPlan, deadline: e.target.value})}
                required
              />
            </div>

            <Input
              label="Description (Optional)"
              type="text"
              value={newPlan.description}
              onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
              placeholder="Describe your savings goal..."
            />

            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Plan'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="savings-plans__grid">
        {plans.length === 0 && !isLoading ? (
          <Card className="savings-plans__empty">
            <h3>No savings plans yet</h3>
            <p>Start building your financial future by creating your first savings plan!</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="primary"
            >
              Create Your First Plan
            </Button>
          </Card>
        ) : (
          plans.map((plan) => (
            <Card key={plan._id} className="savings-plan-card">
              {(() => {
                const progress = getPlanProgress(plan);
                return (
                  <>
                    <div className="savings-plan-card__header">
                      <h3>{plan.name}</h3>
                      <span className={`status-badge status-${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>

                    {plan.description && (
                      <p className="savings-plan-card__description">{plan.description}</p>
                    )}

                    <div className="savings-plan-card__progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="progress-text">
                        {formatCurrency(plan.currentAmount)} / {formatCurrency(plan.targetAmount)}
                        ({progress.toFixed(1)}%)
                      </div>
                    </div>

                    <div className="savings-plan-card__details">
                    <div className="detail-item">
                      <span className="label">Deadline:</span>
                      <span className="value">{formatDate(plan.deadline)}</span>
                    </div>
                  </div>

                  {plan.status === 'active' && (
                      <div className="savings-plan-card__actions">
                        {selectedPlan === plan._id ? (
                          <div className="add-money-form">
                            <Input
                              type="number"
                              value={planTransferAmount}
                              onChange={(e) => setPlanTransferAmount(e.target.value)}
                              placeholder={planTransferAction === "withdraw" ? "Amount to withdraw" : "Amount to deposit"}
                              min="0"
                              step="0.01"
                            />
                            <div className="add-money-buttons">
                              <Button
                                onClick={handlePlanTransfer}
                                variant="primary"
                                size="small"
                                disabled={
                                  isTransferLoading ||
                                  !planTransferAmount ||
                                  parseFloat(planTransferAmount) <= 0 ||
                                  (planTransferAction === "deposit" &&
                                    parseFloat(planTransferAmount) > Number(balance ?? 0)) ||
                                  (planTransferAction === "withdraw" &&
                                    parseFloat(planTransferAmount) > Number(plan?.currentAmount ?? 0))
                                }
                              >
                                {planTransferAction === "withdraw" ? "Withdraw" : "Deposit"}
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedPlan(null);
                                  setPlanTransferAmount("");
                                  setPlanTransferAction(null);
                                }}
                                variant="secondary"
                                size="small"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Button
                              onClick={() => {
                                setSelectedPlan(plan._id);
                                setPlanTransferAction("deposit");
                              }}
                              variant="primary"
                              size="small"
                              disabled={isTransferLoading}
                            >
                              Deposit
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedPlan(plan._id);
                                setPlanTransferAction("withdraw");
                              }}
                              variant="secondary"
                              size="small"
                              disabled={isTransferLoading}
                            >
                              Withdraw
                            </Button>
                          </>
                        )}

                        <Button
                          onClick={() => handleDeletePlan(plan._id)}
                          variant="danger"
                          size="small"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
