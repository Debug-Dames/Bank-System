import api from "./api";

// GET ALL CARDS
export const getCards = async () => {
  return api.get("/cards");
};

// UPDATE LIMITS
export const updateCardLimitsApi = async (cardId, limits) => {
  return api.patch(`/cards/${cardId}/limits`, limits);
};

// BLOCK / UNBLOCK
export const toggleCardStatusApi = async (cardId, action) => {
  return api.patch(`/cards/${cardId}/${action}`);
};