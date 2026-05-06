import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { withdrawFunds } from "../service/transactions";
import { prependTransaction, setBalance } from "./authSlice";
import { withdrawAPI } from "../service/api";

// Async thunk for handling the withdrawal process
export const withdraw = createAsyncThunk(
  "withdraw/withdrawFunds",
  async ({ accountId, amount }, { dispatch, rejectWithValue }) => {
    try {
      const result = await withdrawAPI({ accountId, amount });
      const transaction = result?.transaction ?? result?.data ?? result;

      if (transaction) {
        if (transaction.balanceAfter !== undefined) dispatch(setBalance(transaction.balanceAfter));
        dispatch(prependTransaction(transaction));
      }

      return transaction;
    } catch (error) {
      return rejectWithValue(error?.message || String(error) || "Withdrawal failed");
    }
  }
);

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState: {
    status: "idle",      // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastTransaction: null,
  },
  reducers: {
    resetWithdraw: (state) => {
      state.status = "idle";
      state.error = null;
      state.lastTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(withdraw.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastTransaction = action.payload;
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetWithdraw } = withdrawSlice.actions;
export default withdrawSlice.reducer;
