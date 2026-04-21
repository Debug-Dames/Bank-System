import * as transactionService from "../services/transactionService.js";

export const sendCash = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const transaction = await transactionService.sendCash(req.user._id, accountId, req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to sendCash",
    });
    next(err);
  }
};

export const getTransactionHistory = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const result = await transactionService.getTransactionHistory(
      accountId,
      req.user._id,
      req.query
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to transaction history",
    });
    next(err);
  }
};

export const purchaseAirtime = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const transaction = await transactionService.purchaseAirtime(
      req.user._id,
      accountId,
      req.body
    );
    res.status(201).json(transaction);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to purchase airtime",
    });
    next(err);
  }
};

export const purchaseElectricity = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const transaction = await transactionService.purchaseElectricity(
      req.user._id,
      accountId,
      req.body
    );
    res.status(201).json(transaction);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to purchase electricity",
    });
    next(err);
  }
};


export const deposit = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const transaction = await transactionService.depositFunds(
      req.user._id,
      accountId,
      req.body
    );
    res.status(201).json(transaction);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to deposit funds",
    });
    next(err);
  }
};
 
export const withdraw = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const transaction = await transactionService.withdrawFunds(
      req.user._id,
      accountId,
      req.body
    );
    res.status(201).json(transaction);
  } catch (err) {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || "Failed to withdraw funds",
    });
    next(err);
  }
};
 