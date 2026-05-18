import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavingsPlans,
  createSavingsPlan,
  depositToSavingsPlan,
  withdrawFromSavingsPlan,
  deleteSavingsPlan,
  clearLastAction
} from "../../features/savingsSlice";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";

import "./savings.css";

export default function SavingsPlans() {
  const dispatch = useDispatch();

  const {
    plans = [],
    error,
    savingsBalance = 0,
    lastPlanAction,
    transferError,
    lastTransferAction,
  } = useSelector((state) => state.savings);

  const { balance = 0 } = useSelector((state) => state.auth);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState(null); // deposit | withdraw

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
      const t = setTimeout(() => dispatch(clearLastAction()), 2500);
      return () => clearTimeout(t);
    }
  }, [lastPlanAction, lastTransferAction, dispatch]);

  const createPlan = (e) => {
    e.preventDefault();

    dispatch(
      createSavingsPlan({
        ...newPlan,
        targetAmount: Number(newPlan.targetAmount),
      })
    );

    setNewPlan({
      name: "",
      description: "",
      targetAmount: "",
      deadline: "",
    });

    setShowCreateForm(false);
  };

  const handlePlanAction = () => {
    const value = Number(amount);
    if (!selectedPlan || !value || value <= 0) return;

    if (mode === "deposit") {
      dispatch(
        depositToSavingsPlan({
          planId: selectedPlan,
          amount: value,
        })
      );
    }

    if (mode === "withdraw") {
      dispatch(
        withdrawFromSavingsPlan({
          planId: selectedPlan,
          amount: value,
        })
      );
    }

    setAmount("");
    setSelectedPlan(null);
    setMode(null);
  };

  const format = (v) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(v || 0);

  return (
    <div className="savings-plans">
      <div className="savings-plans__hero">
        <p className="savings-plans__eyebrow">Save smarter</p>
        <h1 className="savings-plans__title">Savings Plans</h1>
        <p className="savings-plans__subtitle">
          Create goals, deposit anytime, and track progress.
        </p>
      </div>

      {/* SUMMARY */}
      <Card>
        <div className="savings-summary">
          <div className="savings-summary__item">
            <p className="savings-summary__label">Main Balance</p>
            <p className="savings-summary__value">{format(balance)}</p>
          </div>
          <div className="savings-summary__item">
            <p className="savings-summary__label">Savings Balance</p>
            <p className="savings-summary__value">{format(savingsBalance)}</p>
          </div>
        </div>
      </Card>

      {/* ALERTS */}
      {error && <Alert variant="error">{error}</Alert>}
      {transferError && <Alert variant="error">{transferError}</Alert>}

      {}
      <Card>
        <div className="savings-plans__create-head">
          <div>
            <h2 className="savings-section__title">Create a plan</h2>
            <p className="savings-section__subtitle">
              Set a target and optional deadline.
            </p>
          </div>

          <Button
            variant={showCreateForm ? "outline" : "primary"}
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Close" : "Create Plan"}
          </Button>
        </div>

        {showCreateForm && (
          <form className="savings-plans__create-form" onSubmit={createPlan}>
            <Input
              placeholder="Plan name"
              value={newPlan.name}
              onChange={(e) =>
                setNewPlan({ ...newPlan, name: e.target.value })
              }
            />

            <Input
              placeholder="Target amount"
              type="number"
              value={newPlan.targetAmount}
              onChange={(e) =>
                setNewPlan({ ...newPlan, targetAmount: e.target.value })
              }
            />

            <Input
              type="date"
              value={newPlan.deadline}
              onChange={(e) =>
                setNewPlan({ ...newPlan, deadline: e.target.value })
              }
            />

            <div className="savings-plans__create-actions">
              <Button type="submit" variant="primary">
                Create
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* PLANS */}
      {plans.length === 0 ? (
        <p>No savings plans yet</p>
      ) : (
        <div className="savings-plans__grid">
          {plans.map((plan) => (
            <Card key={plan._id}>
              <div className="savings-plan">
                <div className="savings-plan__head">
                  <h3 className="savings-plan__title">{plan.name}</h3>
                  <span className="savings-plan__badge">
                    {plan.progress?.toFixed(0) || 0}%
                  </span>
                </div>

                <div className="savings-plan__stats">
                  <div className="savings-plan__stat">
                    <p className="savings-plan__label">Target</p>
                    <p className="savings-plan__value">
                      {format(plan.targetAmount)}
                    </p>
                  </div>
                  <div className="savings-plan__stat">
                    <p className="savings-plan__label">Saved</p>
                    <p className="savings-plan__value">
                      {format(plan.currentAmount)}
                    </p>
                  </div>
                </div>

                <div className="progress-bar" aria-hidden="true">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, Math.max(0, plan.progress || 0))}%`,
                    }}
                  />
                </div>

                {/* ACTIONS */}
                {selectedPlan === plan._id ? (
                  <div className="savings-plan__actions">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />

                    <div className="savings-plan__action-row">
                      <Button variant="primary" onClick={handlePlanAction}>
                        {mode === "withdraw" ? "Withdraw" : "Deposit"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedPlan(null);
                          setAmount("");
                          setMode(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="savings-plan__action-row">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPlan(plan._id);
                        setMode("deposit");
                      }}
                    >
                      Deposit
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPlan(plan._id);
                        setMode("withdraw");
                      }}
                    >
                      Withdraw
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => dispatch(deleteSavingsPlan(plan._id))}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
