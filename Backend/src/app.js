import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

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
