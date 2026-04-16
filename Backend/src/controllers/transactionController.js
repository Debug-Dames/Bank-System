import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const deposit = async (req, res) => {
  try {
    const { amount, accountNumber } = req.body;

    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.balance += amount;
    await account.save();

    // Create transaction record
    const transaction = new Transaction({
      account: account._id,
      type: "deposit",
      amount,
      status: "completed",
    });
    await transaction.save();

    res.json({
      message: "Deposit successful",
      balance: account.balance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const withdraw = async (req, res) => {
  try {
    const { amount, accountNumber } = req.body;

    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    account.balance -= amount;
    await account.save();

    // Create transaction record
    const transaction = new Transaction({
      account: account._id,
      type: "withdrawal",
      amount,
      status: "completed",
    });
    await transaction.save();

    res.json({
      message: "Withdrawal successful",
      balance: account.balance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};