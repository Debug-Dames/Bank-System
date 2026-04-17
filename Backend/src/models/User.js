import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.passwordHash' refers to the password stored in the database
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Hash password before saving to DB
userSchema.pre("save", async function () {
  // 1. Only hash if modified
  if (!this.isModified("passwordHash")) {
    return; // Just return; Mongoose knows you're done because it's async
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    // No next() needed here!
  } catch (err) {
    throw err; // Throwing inside an async pre-save is like calling next(err)
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
