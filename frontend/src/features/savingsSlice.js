import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { prependTransaction, setBalance } from "./transactionSlice";
import {
  getSavingsPlansAPI,
  createSavingsPlanAPI,
  addToSavingsPlanAPI,
  withdrawFromSavingsPlanAPI,
  updateSavingsPlanAPI,
  deleteSavingsPlanAPI,
} from "../service/savings";

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

export const depositToSavingsPlan = createAsyncThunk(
  "savings/depositToSavingsPlan",
  async ({ planId, amount }, { rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const response = await addToSavingsPlanAPI({ planId, amount: numericAmount });
      return { plan: response?.data };
    } catch (error) {
      return rejectWithValue(error?.message || "Savings plan deposit failed");
    }
  }
);

export const withdrawFromSavingsPlan = createAsyncThunk(
  "savings/withdrawFromSavingsPlan",
  async ({ planId, amount }, { rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const response = await withdrawFromSavingsPlanAPI({ planId, amount: numericAmount });
      return { plan: response?.data };
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
      const response = await getSavingsPlansAPI();
      return response?.data || [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch savings plans");
    }
  }
);

export const createSavingsPlan = createAsyncThunk(
  "savings/createSavingsPlan",
  async (planData, { rejectWithValue }) => {
    try {
      const response = await createSavingsPlanAPI(planData);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to create savings plan");
    }
  }
);

export const addToSavingsPlan = createAsyncThunk(
  "savings/addToSavingsPlan",
  async ({ planId, amount }, { rejectWithValue }) => {
    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Amount must be greater than zero");
      }

      const response = await addToSavingsPlanAPI({ planId, amount: numericAmount });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add to savings plan");
    }
  }
);

export const updateSavingsPlan = createAsyncThunk(
  "savings/updateSavingsPlan",
  async ({ planId, updates }, { rejectWithValue }) => {
    try {
      const response = await updateSavingsPlanAPI({ planId, update: updates });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to update savings plan");
    }
  }
);

export const deleteSavingsPlan = createAsyncThunk(
  "savings/deleteSavingsPlan",
  async (planId, { rejectWithValue }) => {
    try {
      await deleteSavingsPlanAPI(planId);
      return planId;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to delete savings plan");
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
