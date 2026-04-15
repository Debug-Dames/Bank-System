import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// simple test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});

export default app;