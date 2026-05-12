import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import savingsPlanRoutes from "./routes/savingsPlanRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import client from "prom-client";

client.collectDefaultMetrics();

export const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

app.use("/api/transactions", transactionRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/savings-plans", savingsPlanRoutes);
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    requestCounter.labels(req.method, req.originalUrl, res.statusCode).inc();
  });

  next();
});
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

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

app.use(notFound);
app.use(errorHandler);

export default app;
