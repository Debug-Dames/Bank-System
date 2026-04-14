import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { depositFunds } from "../service/mockApi";
import { prependTransaction, setBalance } from "./authSlice";

// =========================
// ASYNC THUNK (API CALL)
// =========================
export const depositAsync = createAsyncThunk(
  "deposit/depositAsync",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await depositFunds(payload);
      dispatch(setBalance(response.balanceAfter));
      dispatch(prependTransaction(response));
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const depositSlice = createSlice({
  name: "deposit",
  initialState: {
    status: "idle",
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
        state.lastTransaction = action.payload;
      })
      .addCase(depositAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetDeposit } = depositSlice.actions;
export default depositSlice.reducer;
