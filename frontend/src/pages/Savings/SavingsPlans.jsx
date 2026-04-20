import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavingsPlans,
  createSavingsPlan,
  addToSavingsPlan,
  updateSavingsPlan,
  deleteSavingsPlan,
  resetSavingsError,
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
  const { plans, status, error, lastAction } = useSelector((state) => state.savings);
  const { balance } = useSelector((state) => state.auth);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [addAmount, setAddAmount] = useState("");

  // Create form state
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    targetAmount: "",
    deadline: "",
    interestRate: "0"
  });

  useEffect(() => {
    dispatch(fetchSavingsPlans());
  }, [dispatch]);

  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => {
        dispatch(clearLastAction());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAction, dispatch]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();

    const planData = {
      ...newPlan,
      targetAmount: parseFloat(newPlan.targetAmount),
      interestRate: parseFloat(newPlan.interestRate) || 0
    };

    try {
      await dispatch(createSavingsPlan(planData)).unwrap();
      setNewPlan({
        name: "",
        description: "",
        targetAmount: "",
        deadline: "",
        interestRate: "0"
      });
      setShowCreateForm(false);
    } catch (error) {
      // Error is handled in the slice
    }
  };

  const handleAddToPlan = async (planId) => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) return;

    try {
      await dispatch(addToSavingsPlan({ planId, amount })).unwrap();
      setAddAmount("");
      setSelectedPlan(null);
    } catch (error) {
      // Error is handled in the slice
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Are you sure you want to delete this savings plan?")) {
      try {
        await dispatch(deleteSavingsPlan(planId)).unwrap();
      } catch (error) {
        // Error is handled in the slice
      }
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

  const isLoading = status === 'loading';

  return (
    <div className="savings-plans">
      <div className="savings-plans__header">
        <h1 className="page-title">Savings Plans</h1>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant="primary"
          disabled={isLoading}
        >
          {showCreateForm ? 'Cancel' : 'Create New Plan'}
        </Button>
      </div>

      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {lastAction && (
        <Alert variant="success">Savings plan {lastAction}d successfully!</Alert>
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
              <Input
                label="Interest Rate (%)"
                type="number"
                value={newPlan.interestRate}
                onChange={(e) => setNewPlan({...newPlan, interestRate: e.target.value})}
                placeholder="2.5"
                min="0"
                step="0.1"
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
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
                <div className="progress-text">
                  {formatCurrency(plan.currentAmount)} / {formatCurrency(plan.targetAmount)}
                  ({plan.progress.toFixed(1)}%)
                </div>
              </div>

              <div className="savings-plan-card__details">
                <div className="detail-item">
                  <span className="label">Deadline:</span>
                  <span className="value">{formatDate(plan.deadline)}</span>
                </div>
                {plan.interestRate > 0 && (
                  <div className="detail-item">
                    <span className="label">Interest Rate:</span>
                    <span className="value">{plan.interestRate}%</span>
                  </div>
                )}
              </div>

              {plan.status === 'active' && (
                <div className="savings-plan-card__actions">
                  {selectedPlan === plan._id ? (
                    <div className="add-money-form">
                      <Input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        placeholder="Amount to add"
                        min="0"
                        step="0.01"
                      />
                      <div className="add-money-buttons">
                        <Button
                          onClick={() => handleAddToPlan(plan._id)}
                          variant="primary"
                          size="small"
                          disabled={!addAmount || parseFloat(addAmount) <= 0}
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedPlan(null);
                            setAddAmount("");
                          }}
                          variant="secondary"
                          size="small"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedPlan(plan._id)}
                      variant="primary"
                      size="small"
                    >
                      Add Money
                    </Button>
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
            </Card>
          ))
        )}
      </div>
    </div>
  );
}