import mongoose from "mongoose";

const currencyField = {
  type: String,
  default: "ZAR",
  uppercase: true,
  trim: true,
  maxlength: 3,
};

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
    type: {
      type: String,
      required: true,
      enum: [
        "airtime",
        "data",
        "electricity",
        "transfer",
        "send_cash",
        "deposit",
        "withdrawal",
      ],
    },
    channel: {
      type: String,
      enum: ["app", "atm", "card", "branch", "ussd", "system"],
      default: "app",
    },
    direction: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "completed",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: currencyField,
    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    netFlow: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      trim: true,
      maxlength: 140,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
    details: {
      networkProvider: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      phoneNumber: {
        type: String,
        trim: true,
        maxlength: 20,
      },
      bundle: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      meterNumber: {
        type: String,
        trim: true,
        maxlength: 30,
      },
      beneficiaryName: {
        type: String,
        trim: true,
        maxlength: 120,
      },
      beneficiaryAccountNumber: {
        type: String,
        trim: true,
        maxlength: 30,
      },
      bank: {
        type: String,
        trim: true,
        maxlength: 120,
      },
      recipientName: {
        type: String,
        trim: true,
        maxlength: 120,
      },
      secretPinHash: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index(
  { transactionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      transactionId: { $type: "string" },
    },
  }
);
transactionSchema.index({ account: 1, processedAt: -1 });
transactionSchema.index({ user: 1, type: 1, processedAt: -1 });

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
