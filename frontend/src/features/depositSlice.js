import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { depositMoney } from "../service/mockApi";

// =========================
// ASYNC THUNK (API CALL)
// =========================
export const depositAsync = createAsyncThunk(
  "deposit/depositAsync",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await depositMoney(amount);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const depositSlice = createSlice({
  name: "deposit",
  initialState: {
    loading: false,
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(depositAsync.pending, (state) => {
        state.loading = true;
        state.status = null;
      })
      .addCase(depositAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.status = {
          type: "success",
          message: `R ${action.payload.transaction.amount} deposited successfully`,
        };
      })
      .addCase(depositAsync.rejected, (state, action) => {
        state.loading = false;
        state.status = {
          type: "error",
          message: action.payload,
        };
      });
  },
});

export default depositSlice.reducer;
