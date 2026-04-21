import { Card } from "../models/index.js";
import { maskCardNumber } from "../utils/helpers.js";

/**
 * Get all cards for a user (masked card numbers)
 */
export const getUserCards = async (user) => {
  const cards = await Card.find({ user, status: { $ne: "cancelled" } })
    .populate("account", "accountType accountNumber")
    .sort({ createdAt: -1 });

  return cards.map((card) => ({
    _id: card._id,
    account: card.account,
    cardholderName: card.cardholderName,
    maskedCardNumber: maskCardNumber(card.cardNumber),
    cardType: card.cardType,
    expiryDate: card.expiryDate,
    limits: card.limits,
    status: card.status,
  }));
};

/**
 * Get a single card with ownership check
 */
export const getCardById = async (cardId, user) => {
  const card = await Card.findOne({ _id: cardId, user }).populate(
    "account",
    "accountType accountNumber"
  );

  if (!card) {
    const error = new Error("Card not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  return {
    _id: card._id,
    account: card.account,
    cardholderName: card.cardholderName,
    maskedCardNumber: maskCardNumber(card.cardNumber),
    cardType: card.cardType,
    expiryDate: card.expiryDate,
    limits: card.limits,
    status: card.status,
  };
};

/**
 * Update card limits
 */
export const updateCardLimits = async (cardId, user, limits) => {
  const card = await Card.findOne({ _id: cardId, user });

  if (!card) {
    const error = new Error("Card not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  if (card.status !== "active") {
    const error = new Error("Cannot update limits on a non-active card");
    error.statusCode = 400;
    throw error;
  }

  const maxLimits = { atmWithdrawal: 50000, cardPurchase: 100000, onlinePurchase: 50000 };

  if (limits.atmWithdrawal !== undefined) {
    if (limits.atmWithdrawal > maxLimits.atmWithdrawal) {
      const error = new Error(`ATM withdrawal limit cannot exceed R${maxLimits.atmWithdrawal.toLocaleString()}`);
      error.statusCode = 400;
      throw error;
    }
    card.limits.atmWithdrawal = limits.atmWithdrawal;
  }

  if (limits.cardPurchase !== undefined) {
    if (limits.cardPurchase > maxLimits.cardPurchase) {
      const error = new Error(`Card purchase limit cannot exceed R${maxLimits.cardPurchase.toLocaleString()}`);
      error.statusCode = 400;
      throw error;
    }
    card.limits.cardPurchase = limits.cardPurchase;
  }

  if (limits.onlinePurchase !== undefined) {
    if (limits.onlinePurchase > maxLimits.onlinePurchase) {
      const error = new Error(`Online purchase limit cannot exceed R${maxLimits.onlinePurchase.toLocaleString()}`);
      error.statusCode = 400;
      throw error;
    }
    card.limits.onlinePurchase = limits.onlinePurchase;
  }

  await card.save();
  return getCardById(cardId, user);
};

/**
 * Block or unblock a card
 */
export const toggleCardStatus = async (cardId, user, action) => {
  const card = await Card.findOne({ _id: cardId, user });

  if (!card) {
    const error = new Error("Card not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  if (action === "block") {
    if (card.status === "blocked") {
      const error = new Error("Card is already blocked");
      error.statusCode = 400;
      throw error;
    }
    card.status = "blocked";
  } else if (action === "unblock") {
    if (card.status !== "blocked") {
      const error = new Error("Card is not blocked");
      error.statusCode = 400;
      throw error;
    }
    card.status = "active";
  } else {
    const error = new Error("Action must be 'block' or 'unblock'");
    error.statusCode = 400;
    throw error;
  }

  await card.save();
  return getCardById(cardId, user);
};