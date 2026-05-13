import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import client from "prom-client";

dotenv.config();
connectDB();

/* =========================
   PROMETHEUS METRICS SETUP
========================= */

// Collect default system metrics
client.collectDefaultMetrics();

// Request counter
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// Request duration (latency)
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

/* =========================
   METRICS MIDDLEWARE
========================= */

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode,
      },
      duration
    );
  });

  next();
});

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("API running...");
});

/* =========================
   METRICS ENDPOINT
========================= */

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);

  const metrics = await client.register.metrics();

  res.send(metrics);
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

/* =========================
   ERROR HANDLING
========================= */

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Please kill the process using this port or change the PORT environment variable.`
    );

    process.exit(1);
  }

  throw err;
});