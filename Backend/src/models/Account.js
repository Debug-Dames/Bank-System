import mongoose from "mongoose";

export const ACCOUNT_TYPES = ["transactional", "savings", "current", "platinum"];


const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    citizenId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    accountType: {
      type: String,
      enum: ACCOUNT_TYPES,
      default: "transactional",
    },
    monthlyIncome: {
      type: Number,
      required: true,
      min: 0,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "ZAR",
      uppercase: true,
      trim: true,
      maxlength: 3,
    },
    status: {
      type: String,
      enum: ["pending", "active", "frozen", "closed"],
      default: "pending",
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ accountNumber: 1 }, { unique: true });
accountSchema.index({ user: 1, status: 1 });

// In Account.js

accountSchema.statics.generateAccountNumber = async function () {
  // Example: generate a 10-digit random number
  let accountNumber;
  let exists = true;

  while (exists) {
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    exists = await this.findOne({ accountNumber });
  }

  return accountNumber;
};

const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

export default Account;
