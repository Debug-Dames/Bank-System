import SavingsPlan from "../models/SavingsPlan.js";

/**
 * Create a new savings plan
 */
export const createSavingsPlan = async (userId, planData) => {
  const { name, description, targetAmount, deadline, interestRate = 0 } = planData;

  if (!name || !targetAmount || !deadline) {
    throw new Error("Name, target amount, and deadline are required");
  }

  if (targetAmount <= 0) {
    throw new Error("Target amount must be greater than 0");
  }

  if (new Date(deadline) <= new Date()) {
    throw new Error("Deadline must be in the future");
  }

  const savingsPlan = new SavingsPlan({
    user: userId,
    name,
    description,
    targetAmount,
    deadline,
    interestRate,
  });

  await savingsPlan.save();
  return savingsPlan;
};

/**
 * Get all savings plans for a user
 */
export const getUserSavingsPlans = async (userId) => {
  const plans = await SavingsPlan.find({ user: userId }).sort({ createdAt: -1 });
  return plans;
};

/**
 * Get a specific savings plan by ID
 */
export const getSavingsPlanById = async (planId, userId) => {
  const plan = await SavingsPlan.findById(planId);

  if (!plan) {
    const error = new Error("Savings plan not found");
    error.statusCode = 404;
    throw error;
  }

  if (plan.user.toString() !== userId.toString()) {
    const error = new Error("You do not have access to this savings plan");
    error.statusCode = 403;
    throw error;
  }

  return plan;
};

/**
 * Add money to a savings plan
 */
export const addToSavingsPlan = async (planId, userId, amount) => {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const plan = await getSavingsPlanById(planId, userId);

  if (plan.status !== "active") {
    throw new Error("Cannot add to a non-active savings plan");
  }

  plan.currentAmount += amount;

  // Check if plan is completed
  if (plan.currentAmount >= plan.targetAmount) {
    plan.status = "completed";
  }

  await plan.save();
  return plan;
};

/**
 * Update savings plan details
 */
export const updateSavingsPlan = async (planId, userId, updateData) => {
  const plan = await getSavingsPlanById(planId, userId);

  const allowedFields = ["name", "description", "targetAmount", "deadline", "status", "interestRate"];
  const updates = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  }

  // Validate deadline if being updated
  if (updates.deadline && new Date(updates.deadline) <= new Date()) {
    throw new Error("Deadline must be in the future");
  }

  // Validate target amount
  if (updates.targetAmount !== undefined && updates.targetAmount <= 0) {
    throw new Error("Target amount must be greater than 0");
  }

  Object.assign(plan, updates);

  // Recheck completion status if target amount changed
  if (updates.targetAmount && plan.currentAmount >= plan.targetAmount) {
    plan.status = "completed";
  } else if (updates.targetAmount && plan.currentAmount < plan.targetAmount) {
    plan.status = "active";
  }

  await plan.save();
  return plan;
};

/**
 * Delete a savings plan
 */
export const deleteSavingsPlan = async (planId, userId) => {
  const plan = await getSavingsPlanById(planId, userId);

  await SavingsPlan.findByIdAndDelete(planId);
  return { message: "Savings plan deleted successfully" };
};

/**
 * Calculate interest for a savings plan (if applicable)
 */
export const calculateInterest = async (planId, userId) => {
  const plan = await getSavingsPlanById(planId, userId);

  if (plan.interestRate <= 0) {
    return { interest: 0, message: "No interest rate set for this plan" };
  }

  // Simple interest calculation: (principal * rate * time)
  // For simplicity, assuming annual interest and time in years
  const timeElapsed = (new Date() - new Date(plan.createdAt)) / (1000 * 60 * 60 * 24 * 365);
  const interest = plan.currentAmount * (plan.interestRate / 100) * timeElapsed;

  return {
    interest: Math.round(interest * 100) / 100, // Round to 2 decimal places
    rate: plan.interestRate,
    timeElapsed: Math.round(timeElapsed * 100) / 100,
  };
};