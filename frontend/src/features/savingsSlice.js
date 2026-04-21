import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { prependTransaction, setBalance } from "./authSlice";

// Mock savings plans data (in-memory store for Sprint 1)
let savingsPlansStore = [
  {
    _id: "plan_001",
    user: "user_001",
    name: "Emergency Fund",
    description: "Building a 3-month emergency fund",
    targetAmount: 15000,
    currentAmount: 4500,
    deadline: "2026-12-31T00:00:00.000Z",
    status: "active",
    progress: 30,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-04-15T00:00:00.000Z",
  },
  {
    _id: "plan_002",
    user: "user_001",
    name: "Vacation Fund",
    description: "Saving for summer vacation",
    targetAmount: 8000,
    currentAmount: 3200,
    deadline: "2026-06-30T00:00:00.000Z",
    status: "active",
    progress: 40,
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  },
];

function clonePlan(plan) {
  return plan ? { ...plan } : plan;
}

function clonePlans(plans) {
  if (!Array.isArray(plans)) return [];
  return plans.map((p) => clonePlan(p));
}

const SAVINGS_BALANCE_KEY = "novabank.savings.balance";

function getInitialSavingsBalance() {
  try {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage?.getItem(SAVINGS_BALANCE_KEY);
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function persistSavingsBalance(balance) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage?.setItem(SAVINGS_BALANCE_KEY, String(balance));
  } catch {
    // ignore persistence failures
  }
}

export const depositToSavings = createAsyncThunk(
  "savings/depositToSavings",
  async ({ amount }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const state = getState();
      const mainBalance = Number(state?.auth?.balance ?? 0);
      const savingsBalance = Number(state?.savings?.savingsBalance ?? 0);

      if (!Number.isFinite(mainBalance) || mainBalance < 0) {
        return rejectWithValue("Main account balance is unavailable");
      }
      if (!Number.isFinite(savingsBalance) || savingsBalance < 0) {
        return rejectWithValue("Savings balance is unavailable");
      }
      if (numericAmount > mainBalance) {
        return rejectWithValue("Insufficient funds");
      }

      const nextMainBalance = mainBalance - numericAmount;
      const nextSavingsBalance = savingsBalance + numericAmount;
      persistSavingsBalance(nextSavingsBalance);

      dispatch(setBalance(nextMainBalance));
      dispatch(
        prependTransaction({
          transactionId: `txn_${Date.now()}`,
          type: "savings_deposit",
          amount: numericAmount,
          balanceAfter: nextMainBalance,
          date: new Date().toISOString(),
          savingsBalanceAfter: nextSavingsBalance,
        })
      );

      return { savingsBalance: nextSavingsBalance };
    } catch (error) {
      return rejectWithValue(error?.message || "Savings deposit failed");
    }
  }
);

export const withdrawFromSavings = createAsyncThunk(
  "savings/withdrawFromSavings",
  async ({ amount }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const state = getState();
      const mainBalance = Number(state?.auth?.balance ?? 0);
      const savingsBalance = Number(state?.savings?.savingsBalance ?? 0);

      if (!Number.isFinite(mainBalance) || mainBalance < 0) {
        return rejectWithValue("Main account balance is unavailable");
      }
      if (!Number.isFinite(savingsBalance) || savingsBalance < 0) {
        return rejectWithValue("Savings balance is unavailable");
      }
      if (numericAmount > savingsBalance) {
        return rejectWithValue("Insufficient savings funds");
      }

      const nextMainBalance = mainBalance + numericAmount;
      const nextSavingsBalance = savingsBalance - numericAmount;
      persistSavingsBalance(nextSavingsBalance);

      dispatch(setBalance(nextMainBalance));
      dispatch(
        prependTransaction({
          transactionId: `txn_${Date.now()}`,
          type: "savings_withdraw",
          amount: numericAmount,
          balanceAfter: nextMainBalance,
          date: new Date().toISOString(),
          savingsBalanceAfter: nextSavingsBalance,
        })
      );

      return { savingsBalance: nextSavingsBalance };
    } catch (error) {
      return rejectWithValue(error?.message || "Savings withdrawal failed");
    }
  }
);

export const depositToSavingsAccount = createAsyncThunk(
  "savings/depositToSavingsAccount",
  async ({ amount }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const state = getState();
      const savingsBalance = Number(state?.savings?.savingsBalance ?? 0);
      if (!Number.isFinite(savingsBalance) || savingsBalance < 0) {
        return rejectWithValue("Savings balance is unavailable");
      }

      const nextSavingsBalance = savingsBalance + numericAmount;
      persistSavingsBalance(nextSavingsBalance);

      const tx = {
        transactionId: `txn_${Date.now()}`,
        type: "savings_account_deposit",
        amount: numericAmount,
        balanceAfter: nextSavingsBalance,
        date: new Date().toISOString(),
        accountId: "acc_002",
      };

      dispatch(prependTransaction(tx));

      return { savingsBalance: nextSavingsBalance, transaction: tx };
    } catch (error) {
      return rejectWithValue(error?.message || "Savings account deposit failed");
    }
  }
);

export const withdrawFromSavingsAccount = createAsyncThunk(
  "savings/withdrawFromSavingsAccount",
  async ({ amount }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const state = getState();
      const savingsBalance = Number(state?.savings?.savingsBalance ?? 0);
      if (!Number.isFinite(savingsBalance) || savingsBalance < 0) {
        return rejectWithValue("Savings balance is unavailable");
      }
      if (numericAmount > savingsBalance) {
        return rejectWithValue("Insufficient savings funds");
      }

      const nextSavingsBalance = savingsBalance - numericAmount;
      persistSavingsBalance(nextSavingsBalance);

      const tx = {
        transactionId: `txn_${Date.now()}`,
        type: "savings_account_withdraw",
        amount: numericAmount,
        balanceAfter: nextSavingsBalance,
        date: new Date().toISOString(),
        accountId: "acc_002",
      };

      dispatch(prependTransaction(tx));

      return { savingsBalance: nextSavingsBalance, transaction: tx };
    } catch (error) {
      return rejectWithValue(error?.message || "Savings account withdrawal failed");
    }
  }
);

function recalcPlanProgressAndStatus(plan) {
  const currentAmount = Number(plan?.currentAmount ?? 0);
  const targetAmount = Number(plan?.targetAmount ?? 0);

  const safeCurrent = Number.isFinite(currentAmount) && currentAmount >= 0 ? currentAmount : 0;
  const safeTarget = Number.isFinite(targetAmount) && targetAmount > 0 ? targetAmount : 0;

  const progress = safeTarget > 0 ? Math.min((safeCurrent / safeTarget) * 100, 100) : 0;
  const next = { ...plan, currentAmount: safeCurrent, progress };

  if (safeTarget > 0 && safeCurrent >= safeTarget) {
    next.status = "completed";
  } else if (next.status === "completed") {
    next.status = "active";
  }

  return next;
}

export const depositToSavingsPlan = createAsyncThunk(
  "savings/depositToSavingsPlan",
  async ({ planId, amount }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const state = getState();
      const mainBalance = Number(state?.auth?.balance ?? 0);
      if (!Number.isFinite(mainBalance) || mainBalance < 0) {
        return rejectWithValue("Main account balance is unavailable");
      }
      if (numericAmount > mainBalance) {
        return rejectWithValue("Insufficient funds");
      }

      const plan = savingsPlansStore.find((p) => p._id === planId);
      if (!plan) {
        return rejectWithValue("Savings plan not found");
      }

      const updatedPlan = recalcPlanProgressAndStatus({
        ...plan,
        currentAmount: Number(plan.currentAmount ?? 0) + numericAmount,
        updatedAt: new Date().toISOString(),
      });

      savingsPlansStore = savingsPlansStore.map((p) => (p._id === planId ? updatedPlan : p));

      const nextMainBalance = mainBalance - numericAmount;
      dispatch(setBalance(nextMainBalance));
      dispatch(
        prependTransaction({
          transactionId: `txn_${Date.now()}`,
          type: "savings_plan_deposit",
          amount: numericAmount,
          balanceAfter: nextMainBalance,
          date: new Date().toISOString(),
          planId,
          planName: updatedPlan.name,
          planBalanceAfter: updatedPlan.currentAmount,
        })
      );

      return { plan: clonePlan(updatedPlan) };
    } catch (error) {
      return rejectWithValue(error?.message || "Savings plan deposit failed");
    }
  }
);

export const withdrawFromSavingsPlan = createAsyncThunk(
  "savings/withdrawFromSavingsPlan",
  async ({ planId, amount }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const state = getState();
      const mainBalance = Number(state?.auth?.balance ?? 0);
      if (!Number.isFinite(mainBalance) || mainBalance < 0) {
        return rejectWithValue("Main account balance is unavailable");
      }

      const plan = savingsPlansStore.find((p) => p._id === planId);
      if (!plan) {
        return rejectWithValue("Savings plan not found");
      }

      const currentAmount = Number(plan.currentAmount ?? 0);
      if (!Number.isFinite(currentAmount) || currentAmount < 0) {
        return rejectWithValue("Savings plan balance is unavailable");
      }
      if (numericAmount > currentAmount) {
        return rejectWithValue("Insufficient savings funds");
      }

      const updatedPlan = recalcPlanProgressAndStatus({
        ...plan,
        currentAmount: currentAmount - numericAmount,
        updatedAt: new Date().toISOString(),
      });

      savingsPlansStore = savingsPlansStore.map((p) => (p._id === planId ? updatedPlan : p));

      const nextMainBalance = mainBalance + numericAmount;
      dispatch(setBalance(nextMainBalance));
      dispatch(
        prependTransaction({
          transactionId: `txn_${Date.now()}`,
          type: "savings_plan_withdraw",
          amount: numericAmount,
          balanceAfter: nextMainBalance,
          date: new Date().toISOString(),
          planId,
          planName: updatedPlan.name,
          planBalanceAfter: updatedPlan.currentAmount,
        })
      );

      return { plan: clonePlan(updatedPlan) };
    } catch (error) {
      return rejectWithValue(error?.message || "Savings plan withdrawal failed");
    }
  }
);

// Async thunks for savings plans operations
export const fetchSavingsPlans = createAsyncThunk(
  "savings/fetchSavingsPlans",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would be: await api.get('/api/savings-plans')
      return clonePlans(savingsPlansStore);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch savings plans");
    }
  }
);

export const createSavingsPlan = createAsyncThunk(
  "savings/createSavingsPlan",
  async (planData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newPlan = {
        _id: `plan_${Date.now()}`,
        user: "user_001", // In real app, get from auth state
        ...planData,
        currentAmount: 0,
        status: "active",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app: await api.post('/api/savings-plans', planData)
      savingsPlansStore = [...savingsPlansStore, newPlan];
      return clonePlan(newPlan);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create savings plan");
    }
  }
);

export const addToSavingsPlan = createAsyncThunk(
  "savings/addToSavingsPlan",
  async ({ planId, amount }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app: await api.post(`/api/savings-plans/${planId}/add`, { amount })
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const plan = savingsPlansStore.find(p => p._id === planId);
      if (!plan) {
        return rejectWithValue("Savings plan not found");
      }

      const updatedPlan = {
        ...plan,
        currentAmount: plan.currentAmount + numericAmount,
        updatedAt: new Date().toISOString(),
      };

      // Recalculate progress
      updatedPlan.progress = Math.min((updatedPlan.currentAmount / updatedPlan.targetAmount) * 100, 100);

      // Check if completed
      if (updatedPlan.currentAmount >= updatedPlan.targetAmount) {
        updatedPlan.status = "completed";
      }

      savingsPlansStore = savingsPlansStore.map((p) => (p._id === planId ? updatedPlan : p));
      return clonePlan(updatedPlan);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add to savings plan");
    }
  }
);

export const updateSavingsPlan = createAsyncThunk(
  "savings/updateSavingsPlan",
  async ({ planId, updates }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app: await api.put(`/api/savings-plans/${planId}`, updates)
      const existingPlan = savingsPlansStore.find(p => p._id === planId);
      if (!existingPlan) {
        return rejectWithValue("Savings plan not found");
      }
      const updatedPlan = {
        ...existingPlan,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Recalculate progress if target amount changed
      if (updates.targetAmount) {
        updatedPlan.progress = Math.min((updatedPlan.currentAmount / updatedPlan.targetAmount) * 100, 100);
        if (updatedPlan.currentAmount >= updatedPlan.targetAmount) {
          updatedPlan.status = "completed";
        }
      }

      savingsPlansStore = savingsPlansStore.map((p) => (p._id === planId ? updatedPlan : p));
      return clonePlan(updatedPlan);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update savings plan");
    }
  }
);

export const deleteSavingsPlan = createAsyncThunk(
  "savings/deleteSavingsPlan",
  async (planId, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app: await api.delete(`/api/savings-plans/${planId}`)
      savingsPlansStore = savingsPlansStore.filter((p) => p._id !== planId);
      return planId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete savings plan");
    }
  }
);

const savingsSlice = createSlice({
  name: "savings",
  initialState: {
    plans: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastPlanAction: null, // Track the last successful savings-plan action
    savingsBalance: getInitialSavingsBalance(),
    transferStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    transferError: null,
    lastTransferAction: null,
    lastTransferPlanId: null,
  },
  reducers: {
    resetSavingsError: (state) => {
      state.error = null;
      state.status = "idle";
    },
    resetTransferError: (state) => {
      state.transferError = null;
      state.transferStatus = "idle";
    },
    clearLastAction: (state) => {
      state.lastPlanAction = null;
      state.lastTransferAction = null;
      state.lastTransferPlanId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch savings plans
      .addCase(fetchSavingsPlans.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSavingsPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
        state.lastPlanAction = "fetch";
      })
      .addCase(fetchSavingsPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create savings plan
      .addCase(createSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans.push(action.payload);
        state.lastPlanAction = "create";
      })
      .addCase(createSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add to savings plan
      .addCase(addToSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.plans.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        state.lastPlanAction = "add";
      })
      .addCase(addToSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update savings plan
      .addCase(updateSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.plans.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        state.lastPlanAction = "update";
      })
      .addCase(updateSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete savings plan
      .addCase(deleteSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = state.plans.filter(p => p._id !== action.payload);
        state.lastPlanAction = "delete";
      })
      .addCase(deleteSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Savings account transfers
      .addCase(depositToSavings.pending, (state) => {
        state.transferStatus = "loading";
        state.transferError = null;
      })
      .addCase(depositToSavings.fulfilled, (state, action) => {
        state.transferStatus = "succeeded";
        state.savingsBalance = action.payload?.savingsBalance ?? state.savingsBalance;
        state.lastTransferAction = "transfer_deposit";
      })
      .addCase(depositToSavings.rejected, (state, action) => {
        state.transferStatus = "failed";
        state.transferError = action.payload;
      })
      .addCase(withdrawFromSavings.pending, (state) => {
        state.transferStatus = "loading";
        state.transferError = null;
      })
      .addCase(withdrawFromSavings.fulfilled, (state, action) => {
        state.transferStatus = "succeeded";
        state.savingsBalance = action.payload?.savingsBalance ?? state.savingsBalance;
        state.lastTransferAction = "transfer_withdraw";
      })
      .addCase(withdrawFromSavings.rejected, (state, action) => {
        state.transferStatus = "failed";
        state.transferError = action.payload;
      })
      .addCase(depositToSavingsAccount.pending, (state) => {
        state.transferStatus = "loading";
        state.transferError = null;
      })
      .addCase(depositToSavingsAccount.fulfilled, (state, action) => {
        state.transferStatus = "succeeded";
        state.savingsBalance = action.payload?.savingsBalance ?? state.savingsBalance;
        state.lastTransferAction = "account_deposit";
      })
      .addCase(depositToSavingsAccount.rejected, (state, action) => {
        state.transferStatus = "failed";
        state.transferError = action.payload;
      })
      .addCase(withdrawFromSavingsAccount.pending, (state) => {
        state.transferStatus = "loading";
        state.transferError = null;
      })
      .addCase(withdrawFromSavingsAccount.fulfilled, (state, action) => {
        state.transferStatus = "succeeded";
        state.savingsBalance = action.payload?.savingsBalance ?? state.savingsBalance;
        state.lastTransferAction = "account_withdraw";
      })
      .addCase(withdrawFromSavingsAccount.rejected, (state, action) => {
        state.transferStatus = "failed";
        state.transferError = action.payload;
      })

      // Savings plan transfers
      .addCase(depositToSavingsPlan.pending, (state) => {
        state.transferStatus = "loading";
        state.transferError = null;
      })
      .addCase(depositToSavingsPlan.fulfilled, (state, action) => {
        state.transferStatus = "succeeded";
        const plan = action.payload?.plan;
        if (plan?._id) {
          const index = state.plans.findIndex((p) => p._id === plan._id);
          if (index !== -1) state.plans[index] = plan;
        }
        state.lastTransferAction = "deposit_plan";
        state.lastTransferPlanId = plan?._id ?? null;
      })
      .addCase(depositToSavingsPlan.rejected, (state, action) => {
        state.transferStatus = "failed";
        state.transferError = action.payload;
      })
      .addCase(withdrawFromSavingsPlan.pending, (state) => {
        state.transferStatus = "loading";
        state.transferError = null;
      })
      .addCase(withdrawFromSavingsPlan.fulfilled, (state, action) => {
        state.transferStatus = "succeeded";
        const plan = action.payload?.plan;
        if (plan?._id) {
          const index = state.plans.findIndex((p) => p._id === plan._id);
          if (index !== -1) state.plans[index] = plan;
        }
        state.lastTransferAction = "withdraw_plan";
        state.lastTransferPlanId = plan?._id ?? null;
      })
      .addCase(withdrawFromSavingsPlan.rejected, (state, action) => {
        state.transferStatus = "failed";
        state.transferError = action.payload;
      });
  },
});

export const { resetSavingsError, resetTransferError, clearLastAction } = savingsSlice.actions;

export default savingsSlice.reducer;
