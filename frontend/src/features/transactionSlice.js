import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTransactionHistory,
  depositFunds,
  withdrawFunds,
} from "../service/transactions.js";

// FETCH
export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async ({ accountId }, { rejectWithValue }) => {
    try {
      const res = await getTransactionHistory(accountId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DEPOSIT
export const depositMoney = createAsyncThunk(
  "transactions/deposit",
  async ({ accountId, amount, note }, { rejectWithValue }) => {
    try {
      const res = await depositFunds(accountId, { amount, note });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// WITHDRAW
export const withdrawMoney = createAsyncThunk(
  "transactions/withdraw",
  async ({ accountId, amount, note }, { rejectWithValue }) => {
    try {
      const res = await withdrawFunds(accountId, { amount, note });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    isLoading: false,
    error: null,
    success: null,
  },

  // ✅ ADD THIS
  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.success = null;
    },

    prependTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },

    setBalance: (state, action) => {
      state.balance = action.payload;
    },

    clearTransactions: (state) => {
      state.transactions = [];
    },

    setCardBlocked: (state, action) => {
      const { cardId, blocked } = action.payload || {};
      const card = state.cards.find((c) => c.id === cardId);
      if (card) card.blocked = blocked;
    },

    updateCardLimits: (state, action) => {
      const { cardId, limit } = action.payload || {};
      const card = state.cards.find((c) => c.id === cardId);
      if (card) card.limit = limit;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // DEPOSIT
      .addCase(depositMoney.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(depositMoney.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = "Deposit successful";
        state.transactions.unshift(action.payload);
      })
      .addCase(depositMoney.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // WITHDRAW
      .addCase(withdrawMoney.fulfilled, (state, action) => {
        state.success = "Withdrawal successful";
        state.transactions.unshift(action.payload);
      });
  },
});

// ✅ EXPORT IT HERE
export const { clearStatus, prependTransaction, setBalance, clearTransactions, setCardBlocked, updateCardLimits } = transactionSlice.actions;

export default transactionSlice.reducer;