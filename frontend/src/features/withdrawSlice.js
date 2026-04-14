import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { withdrawFunds } from "../service/mockApi";
import { prependTransaction, setBalance } from "./authSlice";

// Async thunk for handling the withdrawal process
export const withdraw = createAsyncThunk(
  "withdraw/withdrawFunds",
  async ({ accountId, amount }, { dispatch, rejectWithValue }) => {
    try {
      const data = await withdrawFunds({ accountId, amount });
      dispatch(setBalance(data.balanceAfter));
      dispatch(prependTransaction(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Withdrawal failed");
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
