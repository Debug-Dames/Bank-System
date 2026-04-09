# Frontend — OpenBank Cloud Simulation

> React + Redux UI for the OpenBank banking simulation. Part of the [OpenBank monorepo](../README.md).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Mock Data](#mock-data)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## Overview

The frontend provides the complete user interface for OpenBank — handling authentication, account management, deposits, withdrawals, and transaction history. During Sprint 1, all data is served through a local mock API. Real backend integration is planned for Sprint 2.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| State Management | Redux Toolkit |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Styling | Pure CSS |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                # Redux store configuration
│   ├── features/           # Redux slices
│   │   ├── auth/
│   │   ├── transactions/
│   │   └── balance/
│   ├── pages/              # Route-level page components
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Deposit/
│   │   ├── Withdraw/
│   │   └── Transactions/
│   ├── components/         # Reusable UI components
│   │   ├── ui/
│   │   └── layout/
│   ├── services/           # API and mock data services
│   ├── routes/             # Route definitions
│   ├── styles/             # Global CSS
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# From the monorepo root
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

App runs at **http://localhost:5173**

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Features

### Sprint 1 (Current)

- [x] Login & Registration UI
- [x] Dashboard overview
- [x] Deposit functionality
- [x] Withdrawal functionality
- [x] Transaction history display
- [x] Basic responsive layout

---

## Mock Data

During Sprint 1, all API calls are handled by:

```
src/services/mockApi.js
```

This service simulates backend responses locally and will be replaced with real Axios calls to the Node.js API in Sprint 2.

---

## API Reference

Planned endpoints for Sprint 2 integration:

| Feature | Method | Endpoint |
|---|---|---|
| Login | `POST` | `/api/auth/login` |
| Register | `POST` | `/api/auth/register` |
| Deposit | `POST` | `/api/transactions/deposit` |
| Withdraw | `POST` | `/api/transactions/withdraw` |
| Transactions | `GET` | `/api/transactions` |

---

## Contributing

Branch and commit from the monorepo root. Scope all frontend commits clearly:

```bash
git checkout -b feature/frontend-your-feature
git commit -m "feat(frontend): describe your change"
```

See the [root README](../README.md) for full contribution guidelines.