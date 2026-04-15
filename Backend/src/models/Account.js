import mongoose from "mongoose";

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
      enum: ["transactional", "savings", "current"],
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

const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

export default Account;
