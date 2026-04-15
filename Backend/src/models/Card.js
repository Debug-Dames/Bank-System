import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
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
    cardholderName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    cardNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 19,
    },
    expiryDate: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5,
    },
    cvvHash: {
      type: String,
      required: true,
    },
    limits: {
      atmWithdrawal: {
        type: Number,
        default: 5000,
        min: 0,
      },
      cardPurchase: {
        type: Number,
        default: 10000,
        min: 0,
      },
      onlinePurchase: {
        type: Number,
        default: 5000,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: ["active", "blocked", "expired", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

cardSchema.index({ cardNumber: 1 }, { unique: true });
cardSchema.index({ account: 1, status: 1 });

const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);

export default Card;
