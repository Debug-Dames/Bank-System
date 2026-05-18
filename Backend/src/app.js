import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import savingsPlanRoutes from "./routes/savingsPlanRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

app.use("/api/transactions", transactionRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/savings-plans", savingsPlanRoutes);

// simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working" });
});

app.get("/api/db-check", async (req, res) => {
  try {
    const pingResult = await mongoose.connection.db.admin().ping();

    res.json({
      message: "Database connection is working",
      ping: pingResult,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: mongoose.connection.readyState,
    });
  } catch (error) {
    res.status(500).json({
      message: "Database check failed",
      error: error.message,
    });
  }
});

export default app;
