import mongoose from "mongoose";

const savingsPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "cancelled"],
      default: "active",
    },
    interestRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // percentage
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
savingsPlanSchema.index({ user: 1, status: 1 });
savingsPlanSchema.index({ deadline: 1 });

// Virtual for progress percentage
savingsPlanSchema.virtual("progress").get(function () {
  if (this.targetAmount === 0) return 0;
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Ensure virtual fields are serialized
savingsPlanSchema.set("toJSON", { virtuals: true });
savingsPlanSchema.set("toObject", { virtuals: true });

const SavingsPlan = mongoose.model("SavingsPlan", savingsPlanSchema);

export default SavingsPlan;