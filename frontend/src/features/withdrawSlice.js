import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../service/api";

// WITHDRAW
export const withdraw = createAsyncThunk(
  "withdraw/create",
  async (amount, { rejectWithValue }) => {
    try {
      return await apiRequest("/account/withdraw", "POST", { amount });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState: {
    isLoading: false,
    success: false,
    error: null,
  },

  reducers: {
    resetWithdraw: (state) => {
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(withdraw.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(withdraw.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWithdraw } = withdrawSlice.actions;
export default withdrawSlice.reducer;