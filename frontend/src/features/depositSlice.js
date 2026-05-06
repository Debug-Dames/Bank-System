import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { depositFunds } from "../service/transactions";

// =====================
// DEPOSIT ASYNC ACTION
// =====================
export const depositAsync = createAsyncThunk(
  "deposit/depositAsync",
  async ({ accountId, amount }, { rejectWithValue }) => {
    try {
      if (!accountId) throw new Error("Account ID missing");

      const res = await depositFunds(accountId, { amount });

      // safety fallback
      return res || {};
    } catch (err) {
      return rejectWithValue(err.message || "Deposit failed");
    }
  }
);

// =====================
// SLICE
// =====================
const depositSlice = createSlice({
  name: "deposit",
  initialState: {
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    lastTransaction: null,
  },

  reducers: {
    resetDeposit: (state) => {
      state.status = "idle";
      state.error = null;
      state.lastTransaction = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(depositAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(depositAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        // safe fallback prevents crashes
        state.lastTransaction = action.payload || null;
      })

      .addCase(depositAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Deposit failed";
      });
  },
});

export const { resetDeposit } = depositSlice.actions;

export default depositSlice.reducer;