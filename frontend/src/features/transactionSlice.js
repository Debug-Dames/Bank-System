import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTransactionHistory,
  depositFunds,
  withdrawFunds,
} from "../service/transactions.js";

// FETCH TRANSACTIONS
export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async ({ accountId }, { rejectWithValue }) => {
    try {
      const res = await getTransactionHistory(accountId);

      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message
      );
    }
  }
);

// DEPOSIT
export const depositMoney = createAsyncThunk(
  "transactions/deposit",
  async ({ accountId, amount, note }, { rejectWithValue }) => {
    try {
      const res = await depositFunds(accountId, {
        amount,
        note,
      });

      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message
      );
    }
  }
);

// WITHDRAW
export const withdrawMoney = createAsyncThunk(
  "transactions/withdraw",
  async ({ accountId, amount, note }, { rejectWithValue }) => {
    try {
      const res = await withdrawFunds(accountId, {
        amount,
        note,
      });

      return res;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message
      );
    }
  }
);

const initialState = {
  transactions: [],
  pagination: {},
  balance: 0,
  isLoading: false,
  error: null,
  success: null,
};

const transactionSlice = createSlice({
  name: "transactions",

  initialState,

  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },

    prependTransaction: (state, action) => {
      if (action.payload) {
        state.transactions.unshift(action.payload);
      }
    },

    setBalance: (state, action) => {
      state.balance = action.payload;
    },

    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination = {};
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // FETCH TRANSACTIONS
      // =========================
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;

        const payload = action.payload;

        state.transactions =
          payload?.transactions ||
          payload?.data?.transactions ||
          [];

        state.pagination =
          payload?.pagination ||
          payload?.data?.pagination ||
          {};
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // =========================
      // DEPOSIT
      // =========================
      .addCase(depositMoney.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(depositMoney.fulfilled, (state, action) => {
        state.isLoading = false;

        state.success = "Deposit successful";

        if (action.payload) {
          state.transactions.unshift(action.payload);

          state.balance =
            action.payload?.balanceAfter ||
            action.payload?.availableBalance ||
            state.balance;
        }
      })

      .addCase(depositMoney.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // =========================
      // WITHDRAW
      // =========================
      .addCase(withdrawMoney.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })

      .addCase(withdrawMoney.fulfilled, (state, action) => {
        state.isLoading = false;

        state.success = "Withdrawal successful";

        if (action.payload) {
          state.transactions.unshift(action.payload);

          state.balance =
            action.payload?.balanceAfter ||
            action.payload?.availableBalance ||
            state.balance;
        }
      })

      .addCase(withdrawMoney.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearStatus,
  prependTransaction,
  setBalance,
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;