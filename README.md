# 🏦 Nova Bank — Cloud Banking Simulation

> A cloud-native banking simulation system built as part of the IBM Full Stack Developer Professional Certificate. Nova Bank demonstrates modern full-stack architecture, agile sprint delivery, and cloud-native deployment practices.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Monorepo Structure](#monorepo-structure)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Sprint Progress](#sprint-progress)
- [Roadmap](#roadmap)
- [Team](#team)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Nova Bank simulates core retail banking operations — account authentication, deposits, withdrawals, transfers, utility payments, and transaction tracking — across a decoupled frontend and backend architecture. The system is designed with cloud-native deployment in mind, targeting Docker containerisation and Kubernetes orchestration in later sprints.

**Current Sprint:** Sprint 2 — Node.js REST API with MongoDB.

---

## Monorepo Structure

```
├── frontend/               # React + Redux UI (Sprint 1 — complete)
├── backend/                # Node.js REST API (Sprint 2 — active)
│   ├── src/
│   │   ├── app.js          # Express app — middleware + route wiring
│   │   ├── server.js       # Entry point
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # HTTP layer (auth, accounts, transactions, cards)
│   │   ├── services/       # Business logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Route definitions
│   │   ├── middleware/     # JWT auth guard, error handler
│   │   └── utils/          # Validators, helpers
│   ├── .env.example
│   └── package.json
├── database/               # MongoDB schemas & migrations (Sprint 2 — active)
├── infra/                  # Docker, Kubernetes, CI/CD config (planned)
├── docs/                   # Architecture diagrams, API contracts
└── README.md               # This file
```

Each service has its own `README.md` with setup and usage instructions.

---

## Services

| Service | Stack | Status | Docs |
|---|---|---|---|
| Frontend | React, Redux, Vite | ✅ Sprint 1 complete | [frontend/README.md](./frontend/README.md) |
| Backend API | Node.js, Express, MongoDB | ✅ Sprint 2 active | [backend/README.md](./backend/README.md) |
| Database | MongoDB (Mongoose) | ✅ Sprint 2 active | — |
| Infrastructure | Docker, Kubernetes | 🔜 Sprint 3 | — |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), Redux Toolkit, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Validation | Custom SA ID Luhn validator, phone normalisation |
| DevOps *(planned)* | Docker, Kubernetes, GitHub Actions |
| Monitoring *(planned)* | Grafana, Prometheus |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB instance)
- Docker *(Sprint 3+)*

---

### Run the Frontend (Sprint 1)

```bash
git clone https://github.com/Debug-Dames/Bank-System.git
cd Bank-System/frontend
npm install
npm run dev
```

See [frontend/README.md](./frontend/README.md) for full frontend setup details.

---

### Run the Backend (Sprint 2)

```bash
cd Bank-System/backend
npm install
cp .env.example .env
```

Fill in your `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev       # nodemon — auto-restarts on file changes
npm start         # production server
```

Verify the server is running:

```bash
GET http://localhost:5000/api/health
# → { "status": "ok", "timestamp": "..." }

GET http://localhost:5000/api/db-check
# → MongoDB connection state and host
```

See [backend/README.md](./backend/README.md) for full API reference and documentation.

---

## API Overview

The backend exposes a REST API at `http://localhost:5000/api`. All protected routes require an `Authorization: Bearer <JWT_TOKEN>` header.

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and receive JWT |
| GET | `/auth/me` | ✅ | Get authenticated user profile |

### Accounts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/accounts/me` | ✅ | Get all accounts for user |
| GET | `/accounts/types?income=N` | ✅ | List account types with eligibility |
| GET | `/accounts/:id` | ✅ | Get a single account |
| POST | `/accounts/open` | ✅ | Open a new bank account |

### Transactions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/transactions/:accountId/deposit` | ✅ | Deposit funds |
| POST | `/transactions/:accountId/withdraw` | ✅ | Withdraw funds |
| POST | `/transactions/:accountId/send-cash` | ✅ | Send cash to phone number |
| GET | `/transactions/history/:accountId` | ✅ | Paginated transaction history |
| POST | `/transactions/:accountId/utility/airtime` | ✅ | Buy airtime or data |
| POST | `/transactions/:accountId/utility/electricity` | ✅ | Buy prepaid electricity |

### Cards
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cards` | ✅ | Get all cards for user |
| GET | `/cards/:id` | ✅ | Get a single card |
| PATCH | `/cards/:id/limits` | ✅ | Update card spending limits |
| PATCH | `/cards/:id/block` | ✅ | Block a card |
| PATCH | `/cards/:id/unblock` | ✅ | Unblock a card |

### Account Types & Income Requirements

| Type | Min Monthly Income | Description |
|---|---|---|
| Cheque | R0 | Standard everyday banking |
| Savings | R0 | Interest-bearing savings account |
| Business | R5,000 | Business banking with multi-signatory support |
| Gold | R8,000 | Premium — travel insurance, priority support |
| Platinum | R25,000 | Elite — airport lounge, dedicated banker |

---

## Data Models

```
User
  ├── Account (1 → N)
  │     ├── Card (1 → N)
  │     ├── Transaction (1 → N)
  │     └── Activity (1 → N)
  ├── Card (1 → N)
  ├── Transaction (1 → N)
  └── Activity (1 → N)
```

All money-movement operations run inside **MongoDB sessions** — balance updates, Transaction records, and Activity logs commit or roll back atomically.

---

## Sprint Progress

| Sprint | Focus | Status |
|---|---|---|
| Sprint 1 | Frontend UI — all pages, mock data | ✅ Complete |
| Sprint 2 | Node.js backend, MongoDB, REST API, JWT auth | ✅ In progress |
| Sprint 3 | Docker, Kubernetes, CI/CD pipeline | 🔜 Planned |
| Sprint 4 | Monitoring, observability, final deployment | 🔜 Planned |

---

## Roadmap

- [x] React frontend with Redux state management
- [x] Mock API service layer
- [x] Node.js REST API (Express)
- [x] MongoDB integration with Mongoose
- [x] JWT authentication & bcrypt password hashing
- [x] SA ID number validation (Luhn algorithm)
- [x] Account types with income-gated eligibility
- [x] Deposit & withdrawal with atomic transactions
- [x] Send cash via phone number with PIN voucher
- [x] Airtime, data, and electricity utility payments
- [x] Virtual card creation on account opening
- [x] Card limit management and block/unblock
- [x] Paginated transaction history with filters
- [ ] Connect frontend to backend API (replace mock data)
- [ ] Docker containerisation
- [ ] Kubernetes deployment
- [ ] CI/CD with GitHub Actions
- [ ] Monitoring with Grafana & Prometheus

---

## Team

| Member | Responsibility |
|---|---|
| Nomzamo | Auth — Login & Registration |
| Betty | Dashboard |
| Marciah | Deposit |
| Nqobile | Withdrawal |
| Faith | Transactions |

---

## Contributing

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(backend): add electricity purchase endpoint"
   ```

3. Push and open a pull request against `main`:
   ```bash
   git push origin feature/your-feature-name
   ```

> Scope your commits to the relevant service: `feat(frontend)`, `feat(backend)`, `chore(infra)`, etc.

---

## License

This project is for **educational purposes only** as part of the IBM Full Stack Developer Professional Certificate.

---

## Learning Reference

- [IBM Full Stack Developer Professional Certificate](https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer)
- Cloud-native development practices
- DevOps and CI/CD fundamentals

---

*Built with ☁️ by the Debug Dames Team*