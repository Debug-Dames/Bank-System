import {
  getUserBalance,
  depositAmount,
  withdrawAmount,
  getUserAccounts,
  openAccount,
  getAccountById,
  getAvailableAccountTypes,
} from "../services/accountService.js";

// GET BALANCE
export const getBalance = async (req, res) => {
  try {
    const result = await getUserBalance(req.user.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
 
// DEPOSIT
export const deposit = async (req, res) => {
  try {
    const result = await depositAmount(
      req.user.userId,
      req.body.amount
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// WITHDRAW
export const withdraw = async (req, res) => {
  try {
    const result = await withdrawAmount(
      req.user.userId,
      req.body.amount
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getMyAccounts = async (req, res, next) => {
  try {
    const accounts = await getUserAccounts(req.user._id);
    res.status(200).json(accounts);
  } catch (err) {
    res.status(err.statusCode || 500);
    next(err);
  }
};

export const openNewAccount = async (req, res, next) => {
  try {
    const account = await openAccount(req.user._id, req.body);
    res.status(201).json(account);
  } catch (err) {
    res.status(err.statusCode || 500);
    next(err);
  }
};

export const getUserAccountById = async (req, res, next) => {
  try {
    const account = await getAccountById(req.params.id, req.user._id);
    res.status(200).json(account);
  } catch (err) {
    res.status(err.statusCode || 500);
    next(err);
  }
};

export const getAccountTypes = async (req, res, next) => {
  try {
    const income = req.query.income ? Number(req.query.income) : 0;
    const types = getAvailableAccountTypes(income);
    res.status(200).json(types);
  } catch (err) {
    res.status(err.statusCode || 500);
    next(err);
  }
};