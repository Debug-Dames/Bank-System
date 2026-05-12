import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: "bank_system_",
});

export const httpRequestDuration = new client.Histogram({
  name: "bank_api_http_request_duration_seconds",
  help: "API request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

export const httpRequestsTotal = new client.Counter({
  name: "bank_api_http_requests_total",
  help: "Total API requests",
  labelNames: ["method", "route", "status_code"],
});

export const httpErrorsTotal = new client.Counter({
  name: "bank_api_http_errors_total",
  help: "Total API requests with 4xx or 5xx status codes",
  labelNames: ["method", "route", "status_code"],
});

export const transactionRequestsTotal = new client.Counter({
  name: "bank_api_transaction_requests_total",
  help: "Total transaction API requests",
  labelNames: ["method", "transaction_type", "status_code"],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpErrorsTotal);
register.registerMetric(transactionRequestsTotal);

const normalizeRoute = (req) => {
  if (req.route?.path) {
    const mountPath = req.baseUrl || "";
    return `${mountPath}${req.route.path}`.replace(/\/+/g, "/");
  }

  return req.path
    .replace(/[0-9a-fA-F]{24}/g, ":id")
    .replace(/\d{6,}/g, ":id");
};

const getTransactionType = (req) => {
  if (!req.path.startsWith("/api/transactions")) return null;
  if (req.path.includes("/deposit")) return "deposit";
  if (req.path.includes("/withdraw")) return "withdraw";
  if (req.path.includes("/send-cash")) return "send_cash";
  if (req.path.includes("/utility/airtime")) return "airtime";
  if (req.path.includes("/utility/electricity")) return "electricity";
  if (req.path.includes("/history")) return "history";
  return "other";
};

export const metricsMiddleware = (req, res, next) => {
  if (req.path === "/metrics") {
    next();
    return;
  }

  const endTimer = httpRequestDuration.startTimer();

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: normalizeRoute(req),
      status_code: String(res.statusCode),
    };

    endTimer(labels);
    httpRequestsTotal.inc(labels);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }

    const transactionType = getTransactionType(req);
    if (transactionType && req.method !== "GET") {
      transactionRequestsTotal.inc({
        method: req.method,
        transaction_type: transactionType,
        status_code: String(res.statusCode),
      });
    }
  });

  next();
};

export const metricsHandler = async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};
