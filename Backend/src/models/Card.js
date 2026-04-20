import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// Hash CVV before saving
cardSchema.pre("save", async function () {
  if (!this.isModified("cvvHash")) return;
  const salt = await bcrypt.genSalt(10);
  this.cvvHash = await bcrypt.hash(this.cvvHash, salt);
  // next();
});
 
cardSchema.methods.matchCvv = async function (enteredCvv) {
  return await bcrypt.compare(enteredCvv, this.cvvHash);
};
 
// Generate 16-digit card number
cardSchema.statics.generateCardNumber = async function () {
  let cardNumber;
  let exists = true;
  while (exists) {
    const segments = Array.from({ length: 4 }, () =>
      Math.floor(1000 + Math.random() * 9000)
    );
    cardNumber = segments.join("");
    exists = await this.findOne({ cardNumber });
  }
  return cardNumber;
};
 
// Generate expiry date 3 years from now
cardSchema.statics.generateExpiryDate = function () {
  const now = new Date();
  const expiry = new Date(now.setFullYear(now.getFullYear() + 3));
  const month = String(expiry.getMonth() + 1).padStart(2, "0");
  const year = String(expiry.getFullYear()).slice(-2);
  return `${month}/${year}`;
};


const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);

export default Card;
