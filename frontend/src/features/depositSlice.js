import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../service/api";

// DEPOSIT
export const deposit = createAsyncThunk(
  "deposit/create",
  async (amount, { rejectWithValue }) => {
    try {
      return await apiRequest("/account/deposit", "POST", { amount });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const depositSlice = createSlice({
  name: "deposit",
  initialState: {
    isLoading: false,
    success: false,
    error: null,
  },

  reducers: {
    resetDeposit: (state) => {
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(deposit.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(deposit.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(deposit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDeposit } = depositSlice.actions;
export default depositSlice.reducer;