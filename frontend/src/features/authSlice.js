import { createSlice } from "@reduxjs/toolkit";
import { mockUser, mockBalance, mockTransactions, mockSavingsPlans } from "../service/mockApi";

const initialState = {
  user: mockUser,
  balance: mockBalance,
  transactions: mockTransactions,
  savingsPlans: mockSavingsPlans
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addSavingsPlan: (state, action) => {
      const payload = action.payload || {};
      const name = String(payload.name || "").trim();
      const target = Number(payload.target || 0);

      if (!name || !Number.isFinite(target) || target <= 0) return;

      state.savingsPlans.unshift({
        id: `s${Date.now()}`,
        name,
        target,
        balance: 0
      });
    },
    transferToSavingsPlan: (state, action) => {
      const { planId, amount } = action.payload || {};
      const plan = state.savingsPlans.find((p) => p.id === planId);
      const n = Number(amount || 0);
      if (!plan || !Number.isFinite(n) || n <= 0) return;
      if (state.balance < n) return;

      state.balance -= n;
      plan.balance += n;

      state.transactions.unshift({
        id: `t${Date.now()}`,
        type: "transfer",
        amount: n,
        date: new Date().toISOString().slice(0, 10),
        status: "completed",
        note: `Transfer to savings: ${plan.name}`
      });
    }
  }
});

export const { updateUser, addSavingsPlan, transferToSavingsPlan } = authSlice.actions;
export default authSlice.reducer;
