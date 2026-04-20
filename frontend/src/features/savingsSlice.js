import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock savings plans data
const mockSavingsPlans = [
  {
    _id: "plan_001",
    user: "user_001",
    name: "Emergency Fund",
    description: "Building a 3-month emergency fund",
    targetAmount: 15000,
    currentAmount: 4500,
    deadline: "2026-12-31T00:00:00.000Z",
    status: "active",
    interestRate: 2.5,
    progress: 30,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-04-15T00:00:00.000Z",
  },
  {
    _id: "plan_002",
    user: "user_001",
    name: "Vacation Fund",
    description: "Saving for summer vacation",
    targetAmount: 8000,
    currentAmount: 3200,
    deadline: "2026-06-30T00:00:00.000Z",
    status: "active",
    interestRate: 1.8,
    progress: 40,
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  },
];

// Async thunks for savings plans operations
export const fetchSavingsPlans = createAsyncThunk(
  "savings/fetchSavingsPlans",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would be: await api.get('/api/savings-plans')
      return mockSavingsPlans;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch savings plans");
    }
  }
);

export const createSavingsPlan = createAsyncThunk(
  "savings/createSavingsPlan",
  async (planData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newPlan = {
        _id: `plan_${Date.now()}`,
        user: "user_001", // In real app, get from auth state
        ...planData,
        currentAmount: 0,
        status: "active",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real app: await api.post('/api/savings-plans', planData)
      return newPlan;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create savings plan");
    }
  }
);

export const addToSavingsPlan = createAsyncThunk(
  "savings/addToSavingsPlan",
  async ({ planId, amount }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app: await api.post(`/api/savings-plans/${planId}/add`, { amount })
      const updatedPlan = {
        ...mockSavingsPlans.find(p => p._id === planId),
        currentAmount: mockSavingsPlans.find(p => p._id === planId).currentAmount + amount,
        updatedAt: new Date().toISOString(),
      };

      // Recalculate progress
      updatedPlan.progress = Math.min((updatedPlan.currentAmount / updatedPlan.targetAmount) * 100, 100);

      // Check if completed
      if (updatedPlan.currentAmount >= updatedPlan.targetAmount) {
        updatedPlan.status = "completed";
      }

      return updatedPlan;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add to savings plan");
    }
  }
);

export const updateSavingsPlan = createAsyncThunk(
  "savings/updateSavingsPlan",
  async ({ planId, updates }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app: await api.put(`/api/savings-plans/${planId}`, updates)
      const existingPlan = mockSavingsPlans.find(p => p._id === planId);
      const updatedPlan = {
        ...existingPlan,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Recalculate progress if target amount changed
      if (updates.targetAmount) {
        updatedPlan.progress = Math.min((updatedPlan.currentAmount / updatedPlan.targetAmount) * 100, 100);
        if (updatedPlan.currentAmount >= updatedPlan.targetAmount) {
          updatedPlan.status = "completed";
        }
      }

      return updatedPlan;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update savings plan");
    }
  }
);

export const deleteSavingsPlan = createAsyncThunk(
  "savings/deleteSavingsPlan",
  async (planId, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app: await api.delete(`/api/savings-plans/${planId}`)
      return planId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete savings plan");
    }
  }
);

const savingsSlice = createSlice({
  name: "savings",
  initialState: {
    plans: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    lastAction: null, // Track the last successful action
  },
  reducers: {
    resetSavingsError: (state) => {
      state.error = null;
      state.status = "idle";
    },
    clearLastAction: (state) => {
      state.lastAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch savings plans
      .addCase(fetchSavingsPlans.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSavingsPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
        state.lastAction = "fetch";
      })
      .addCase(fetchSavingsPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create savings plan
      .addCase(createSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans.push(action.payload);
        state.lastAction = "create";
      })
      .addCase(createSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add to savings plan
      .addCase(addToSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.plans.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        state.lastAction = "add";
      })
      .addCase(addToSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update savings plan
      .addCase(updateSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.plans.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        state.lastAction = "update";
      })
      .addCase(updateSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete savings plan
      .addCase(deleteSavingsPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSavingsPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = state.plans.filter(p => p._id !== action.payload);
        state.lastAction = "delete";
      })
      .addCase(deleteSavingsPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetSavingsError, clearLastAction } = savingsSlice.actions;

export default savingsSlice.reducer;