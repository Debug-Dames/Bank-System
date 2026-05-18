import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCards,
  updateCardLimitsApi,
  toggleCardStatusApi,
} from "../service/cards";

// FETCH CARDS
export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async (_, { rejectWithValue }) => {
    try {
      console.log("FETCHING CARDS");

      const res = await getCards();

      console.log("CARDS RESPONSE:", res.data);

      return res.data;
    } catch (err) {
      console.log(err);

      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// UPDATE LIMITS
export const updateCardLimits = createAsyncThunk(
  "cards/updateLimits",
  async ({ cardId, limits }, { rejectWithValue }) => {
    try {
      const res = await updateCardLimitsApi(cardId, limits);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// BLOCK / UNBLOCK
export const setCardBlocked = createAsyncThunk(
  "cards/toggleStatus",
  async ({ cardId, blocked }, { rejectWithValue }) => {
    try {
      const action = blocked ? "block" : "unblock";

      const res = await toggleCardStatusApi(cardId, action);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const cardSlice = createSlice({
  name: "cards",

  initialState: {
    cards: [],
    isLoading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCards.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cards = action.payload;
      })

      .addCase(fetchCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // UPDATE LIMITS
      .addCase(updateCardLimits.fulfilled, (state, action) => {
        const updatedCard = action.payload;

        const index = state.cards.findIndex(
          (c) => c._id === updatedCard._id
        );

        if (index !== -1) {
          state.cards[index] = updatedCard;
        }
      })

      // BLOCK / UNBLOCK
      .addCase(setCardBlocked.fulfilled, (state, action) => {
        const updatedCard = action.payload;

        const index = state.cards.findIndex(
          (c) => c._id === updatedCard._id
        );

        if (index !== -1) {
          state.cards[index] = updatedCard;
        }
      });
  },
});

export default cardSlice.reducer;