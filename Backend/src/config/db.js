import mongoose from "mongoose";
import { initializeSchemas } from "../models/index.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    await initializeSchemas();

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
