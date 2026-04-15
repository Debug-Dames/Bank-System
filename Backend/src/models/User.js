import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    idNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    pinHash: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "closed"],
      default: "pending",
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ idNumber: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
