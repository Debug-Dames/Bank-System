import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
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
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    activityType: {
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
        "AccountOpened",
        "AccountClosed",
        "CardIssued",
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
    },
    netFlow: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ account: 1, date: -1 });
activitySchema.index({ user: 1, date: -1 });

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", activitySchema);

export default Activity;
