import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// Handle port in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process using this port or change the PORT environment variable.`);
    process.exit(1);
  }
  throw err;
});
