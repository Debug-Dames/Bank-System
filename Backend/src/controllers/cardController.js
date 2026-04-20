import * as cardService from "../services/cardService.js";

export const getMyCards = async (req, res, next) => {
  try {
    const cards = await cardService.getUserCards(req.user._id);
    res.status(200).json(cards);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to retrieve cards",
    });
    next(err);
  }
};

export const getCardById = async (req, res, next) => {
  try {
    const card = await cardService.getCardById(req.params.id, req.user._id);
    res.status(200).json(card);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to retrieve card",
    });
    next(err);
  }
};

export const updateLimits = async (req, res, next) => {
  try {
    const card = await cardService.updateCardLimits(req.params.id, req.user._id, req.body);
    res.status(200).json(card);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to update card limits",
    });
    next(err);
  }
};

export const toggleCardStatus = async (req, res, next) => {
  try {
    const { action } = req.params; // 'block' or 'unblock'
    const card = await cardService.toggleCardStatus(req.params.id, req.user._id, action);
    res.status(200).json(card);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to toggle card status",
    });
    next(err);
  }
};