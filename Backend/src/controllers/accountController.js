import {
  getUserBalance,
  depositAmount,
  withdrawAmount,
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