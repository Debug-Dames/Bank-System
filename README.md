# 🏦 OpenBank Cloud Simulation

> A cloud-native banking simulation system built as part of the IBM Full Stack Developer Professional Certificate. OpenBank demonstrates modern full-stack architecture, agile sprint delivery, and cloud-native deployment practices.

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

OpenBank simulates core retail banking operations — account authentication, deposits, withdrawals, and transaction tracking — across a decoupled frontend and backend architecture. The system is designed with cloud-native deployment in mind, targeting Docker containerisation and Kubernetes orchestration in later sprints.

**Current Sprint:** Sprint 1 — Frontend UI with mock data services.

---

## Monorepo Structure

```
openbank/
├── frontend/               # React + Redux UI (Sprint 1 — active)
├── backend/                # Node.js REST API (Sprint 2 — planned)
├── database/               # PostgreSQL / MongoDB schemas & migrations (planned)
├── infra/                  # Docker, Kubernetes, CI/CD config (planned)
├── docs/                   # Architecture diagrams, API contracts
└── README.md               # This file
```

Each service has its own `README.md` with setup and usage instructions.

---

## Services

| Service | Stack | Status | Docs |
|---|---|---|---|
| Frontend | React, Redux, Vite | ✅ Sprint 1 active | [frontend/README.md](./frontend/README.md) |
| Backend API | Node.js, Express | 🔜 Sprint 2 | — |
| Database | PostgreSQL / MongoDB | 🔜 Sprint 2 | — |
| Infrastructure | Docker, Kubernetes | 🔜 Sprint 3 | — |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), Redux Toolkit, React Router, Axios |
| Backend *(planned)* | Node.js, Express |
| Database *(planned)* | PostgreSQL or MongoDB |
| DevOps *(planned)* | Docker, Kubernetes, GitHub Actions |
| Monitoring *(planned)* | Grafana, Prometheus |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- Docker *(Sprint 3+)*

### Run the Frontend (Sprint 1)

```bash
git clone https://github.com/Debug-Dames/Bank-System.git
cd openbank/Bank-system
npm install
npm run dev
```

See [frontend/README.md](./frontend/README.md) for full frontend setup details.

---

## Sprint Progress

| Sprint | Focus | Status |
|---|---|---|
| Sprint 1 | Frontend UI — all pages, mock data | ✅ In progress |
| Sprint 2 | Node.js backend, database, API integration | 🔜 Planned |
| Sprint 3 | Docker, Kubernetes, CI/CD pipeline | 🔜 Planned |
| Sprint 4 | Monitoring, observability, final deployment | 🔜 Planned |

---

## Roadmap

- [x] React frontend with Redux state management
- [x] Mock API service layer
- [ ] Node.js REST API (Express)
- [ ] PostgreSQL / MongoDB integration
- [ ] JWT authentication
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
   git commit -m "feat(frontend): add deposit form validation"
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
