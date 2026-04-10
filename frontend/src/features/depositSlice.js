import { createSlice } from "@reduxjs/toolkit";

const depositSlice = createSlice({
  name: "deposit",
  initialState: {
    status: "idle",
    error: null,
    lastDeposit: null,
  },
  reducers: {
    resetDeposit: (state) => {
      state.status = "idle";
      state.error = null;
      state.lastDeposit = null;
    },
  },
});

export const { resetDeposit } = depositSlice.actions;
export default depositSlice.reducer;

