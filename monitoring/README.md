# Bank System Monitoring

This folder contains the Prometheus and Grafana setup for the Bank System API.

## Run

```bash
docker compose up --build
```

## URLs

- Backend metrics: http://localhost:5000/metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

Grafana login:

- Username: `admin`
- Password: `admin`

## Dashboard

Grafana automatically provisions the dashboard from:

```text
monitoring/grafana/dashboards/bank-system-api-dashboard.json
```

The dashboard includes:

- API latency: p95 gauge and route-level p50/p95 time series
- Transaction volume: transaction-type time series and last-hour donut panel
- Error rates: current error-rate stat and route/status error time series
- Request table: route/status totals over the last hour

## Prometheus Metrics

The backend exposes:

- `bank_api_http_request_duration_seconds`
- `bank_api_http_requests_total`
- `bank_api_http_errors_total`
- `bank_api_transaction_requests_total`
- Default Node.js/process metrics prefixed with `bank_system_`
