import mongoose from "mongoose";
import { Account, Transaction, Activity } from "../models/index.js";
import { generateReference } from "../utils/helpers.js";
import { validatePhoneNumber, normalizePhone, validateMeterNumber } from "../utils/validators.js";

/**
 * Internal helper: debit an account and record transaction + activity
 * Runs inside a mongoose session for atomicity
 */
const recordDebit = async (session, { account, amount, type, note, details }) => {
  const balanceBefore = account.balance;
  const balanceAfter = parseFloat((balanceBefore - amount).toFixed(2));

  account.balance = balanceAfter;
  account.availableBalance = balanceAfter;
  await account.save({ session });

  const transaction = await Transaction.create(
    [
      {
        user: account.user,
        accountId: account._id,
        type,
        channel: "App",
        direction: "Debit",
        status: "Completed",
        amount,
        balanceBefore,
        balanceAfter,
        netFlow: -amount,
        reference: generateReference(),
        note: note || "",
        processedAt: new Date(),
        details,
      },
    ],
    { session }
  );

  await Activity.create(
    [
      {
        user: account.user,
        accountId: account._id,
        transactionId: transaction[0]._id,
        activityType: type,
        description: note || type,
        amount,
        balance: balanceAfter,
        netFlow: -amount,
        date: new Date(),
      },
    ],
    { session }
  );

  return transaction[0];
};

/**
 * Transfer money to a recipient via phone number with secret PIN
 */
export const sendCash = async (user, accountId, data) => {
  const { amount, recipientName, recipientPhone, secretPin, note } = data;

  // --- Validation ---
  if (!amount || !recipientName || !recipientPhone || !secretPin) {
    const error = new Error("Amount, recipient name, phone number, and PIN are required");
    error.statusCode = 400;
    throw error;
  }

  if (isNaN(amount) || Number(amount) <= 0) {
    const error = new Error("Amount must be a positive number");
    error.statusCode = 400;
    throw error;
  }

  if (!validatePhoneNumber(recipientPhone)) {
    const error = new Error("Invalid recipient phone number");
    error.statusCode = 400;
    throw error;
  }

  if (!/^\d{4,6}$/.test(secretPin)) {
    const error = new Error("Secret PIN must be 4–6 digits");
    error.statusCode = 400;
    throw error;
  }

  const numericAmount = parseFloat(Number(amount).toFixed(2));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findOne({ _id: accountId, user }).session(session);

    if (!account) {
      const error = new Error("Account not found");
      error.statusCode = 404;
      throw error;
    }

    if (account.status !== "active") {
      const error = new Error("Account is not active");
      error.statusCode = 400;
      throw error;
    }

    if (account.availableBalance < numericAmount) {
      const error = new Error("Insufficient funds");
      error.statusCode = 400;
      throw error;
    }

    const transaction = await recordDebit(session, {
      account,
      amount: numericAmount,
      type: "SendCash",
      note: note || `Cash to ${recipientName}`,
      details: {
        recipientName,
        recipientPhone: normalizePhone(recipientPhone),
        secretPin, // In production this would be hashed and stored separately
        voucherReference: generateReference("CASH"),
      },
    });

    await session.commitTransaction();
    return transaction;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Get transaction history for a specific account
 */
export const getTransactionHistory = async (accountId, user, query = {}) => {
  // Verify ownership first
  const account = await Account.findOne({ _id: accountId, user });
  if (!account) {
    const error = new Error("Account not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  const { page = 1, limit = 20, type, startDate, endDate } = query;
  const filter = { accountId };

  if (type) filter.type = type;
  if (startDate || endDate) {
    filter.processedAt = {};
    if (startDate) filter.processedAt.$gte = new Date(startDate);
    if (endDate) filter.processedAt.$lte = new Date(endDate);
  }

  const transactions = await Transaction.find(filter)
    .sort({ processedAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Transaction.countDocuments(filter);

  return {
    transactions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Purchase airtime or data bundle
 */
export const purchaseAirtime = async (user, accountId, data) => {
  const { network, amount, phoneNumber, type } = data;

  const validNetworks = ["Vodacom", "MTN", "Cell C", "Telkom"];
  const validTypes = ["Airtime", "Data"];

  if (!network || !amount || !phoneNumber || !type) {
    const error = new Error("Network, amount, phone number, and type are required");
    error.statusCode = 400;
    throw error;
  }

  if (!validNetworks.includes(network)) {
    const error = new Error(`Invalid network. Choose from: ${validNetworks.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  if (!validTypes.includes(type)) {
    const error = new Error(`Type must be either 'Airtime' or 'Data'`);
    error.statusCode = 400;
    throw error;
  }

  if (!validatePhoneNumber(phoneNumber)) {
    const error = new Error("Invalid phone number");
    error.statusCode = 400;
    throw error;
  }

  const numericAmount = parseFloat(Number(amount).toFixed(2));
  if (numericAmount < 5 || numericAmount > 1000) {
    const error = new Error("Amount must be between R5 and R1000");
    error.statusCode = 400;
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findOne({ _id: accountId, user }).session(session);

    if (!account) {
      const error = new Error("Account not found");
      error.statusCode = 404;
      throw error;
    }

    if (account.availableBalance < numericAmount) {
      const error = new Error("Insufficient funds");
      error.statusCode = 400;
      throw error;
    }

    const txnType = type === "Airtime" ? "AirtimePurchase" : "DataPurchase";

    const transaction = await recordDebit(session, {
      account,
      amount: numericAmount,
      type: txnType,
      note: `${network} ${type} - ${normalizePhone(phoneNumber)}`,
      details: {
        network,
        phoneNumber: normalizePhone(phoneNumber),
        purchaseType: type,
        voucherReference: generateReference("AIR"),
      },
    });

    await session.commitTransaction();
    return transaction;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Purchase prepaid electricity
 */
export const purchaseElectricity = async (user, accountId, data) => {
  const { meterNumber, amount } = data;

  if (!meterNumber || !amount) {
    const error = new Error("Meter number and amount are required");
    error.statusCode = 400;
    throw error;
  }

  if (!validateMeterNumber(meterNumber)) {
    const error = new Error("Invalid meter number. Must be 11 digits.");
    error.statusCode = 400;
    throw error;
  }

  const numericAmount = parseFloat(Number(amount).toFixed(2));
  if (numericAmount < 20 || numericAmount > 5000) {
    const error = new Error("Amount must be between R20 and R5000");
    error.statusCode = 400;
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findOne({ _id: accountId, user }).session(session);

    if (!account) {
      const error = new Error("Account not found");
      error.statusCode = 404;
      throw error;
    }

    if (account.availableBalance < numericAmount) {
      const error = new Error("Insufficient funds");
      error.statusCode = 400;
      throw error;
    }

    // Simulate token generation (in production: call a real utility API)
    const token = Array.from({ length: 5 }, () =>
      Math.floor(1000 + Math.random() * 9000)
    ).join("-");

    // Rough kWh estimate (R2.50/unit average)
    const units = (numericAmount / 2.5).toFixed(2);

    const transaction = await recordDebit(session, {
      account,
      amount: numericAmount,
      type: "ElectricityPurchase",
      note: `Electricity - Meter ${meterNumber}`,
      details: {
        meterNumber,
        token,
        units: `${units} kWh`,
        voucherReference: generateReference("ELEC"),
      },
    });

    await session.commitTransaction();
    return { ...transaction.toObject(), token, units: `${units} kWh` };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};