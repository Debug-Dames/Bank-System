import Account from "../models/Account.js";

export const getBalance = async (req, res) => {
  try {
    const { accountNumber } = req.query;

    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      message: "Balance retrieved successfully",
      balance: account.balance,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};