# Banking App – Backend API

Node.js + Express + MongoDB REST API.

---

## Setup

```bash
npm install
cp .env.example .env   # fill in your MONGO_URI and JWT_SECRET
npm run dev
```

---

## Project Structure

```
src/
├── app.js              # Express app + route wiring
├── server.js           # Entry point
├── config/
│   └── db.js           # MongoDB connection
├── controllers/        # Thin HTTP layer (req/res only)
├── services/           # All business logic
├── models/             # Mongoose schemas
├── routes/             # Route definitions
├── middleware/
│   ├── authMiddleware.js   # JWT protect() guard
│   └── errorMiddleware.js  # Global error handler
└── utils/
    ├── validators.js   # SA ID, phone, email, password validation
    └── helpers.js      # JWT generation, masking, formatting
```

---

## Account Types & Income Requirements

| Type      | Min Monthly Income | Description                        |
|-----------|--------------------|------------------------------------|
| Transactional    | R0                 | Standard everyday banking          |
| Savings   | R0                 | Earn interest on savings           |
| Platinum  | R20,000            | Elite banking experience           |
| Current  | R5,000             | Tailored for business needs        |

---

## API Reference

**Base URL:** `http://localhost:5000/api`  
**Auth:** `Authorization: Bearer <JWT_TOKEN>`

---

### Auth

#### `POST /auth/register`
Register a new user (no account created yet).

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "idNumber": "9001015000081",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "phoneNumber": "0712345678"
}
```
Returns `{ user, token }` — **201**

---

#### `POST /auth/login`
```json
{ "idNumber": "9001015000081", "password": "SecurePass123" }
```
Returns `{ user, token }` — **200**

---

#### `GET /auth/me` 🔒
Returns the logged-in user's profile — **200**

---

### Accounts

#### `GET /accounts/me` 🔒
Returns all accounts for the authenticated user.

#### `GET /accounts/types?income=15000` 🔒
Returns all account types with eligibility based on income.

#### `GET /accounts/:id` 🔒
Returns a single account (ownership enforced).

#### `POST /accounts/open` 🔒
Open a new account. Income is validated against account type minimums.

```json
{
  "citizenId": "9001015000081",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "0712345678",
  "monthlyIncome": 15000,
  "accountType": "platinum"
}
```
Returns the new account + auto-creates a virtual card — **201**

---

### Transactions

#### `POST /transactions/:accountId/send-cash` 🔒
```json
{
  "amount": 500,
  "recipientName": "Jane Smith",
  "recipientPhone": "0823334444",
  "secretPin": "1234",
  "note": "Lunch money"
}
```

#### `GET /transactions/history/:accountId` 🔒
Query params: `page`, `limit`, `type`, `startDate`, `endDate`

#### `POST /transactions/:accountId/utility/airtime` 🔒
```json
{
  "network": "Vodacom",
  "amount": 100,
  "phoneNumber": "0712345678",
  "type": "Airtime"
}
```
Networks: `Vodacom`, `MTN`, `Cell C`, `Telkom`  
Types: `Airtime`, `Data`

#### `POST /transactions/:accountId/utility/electricity` 🔒
```json
{ "meterNumber": "12345678901", "amount": 250 }
```
Returns transaction + `token` + `units` (kWh estimate).

---

### Cards

#### `GET /cards` 🔒
Returns all cards (masked card numbers).

#### `GET /cards/:id` 🔒
Returns a single card.

#### `PATCH /cards/:id/limits` 🔒
```json
{
  "atmWithdrawal": 3000,
  "cardPurchase": 8000,
  "onlinePurchase": 5000
}
```

#### `PATCH /cards/:id/block` 🔒
#### `PATCH /cards/:id/unblock` 🔒

---

## Error Responses

| Code | Meaning                          |
|------|----------------------------------|
| 400  | Validation failed / bad request  |
| 401  | Missing or invalid JWT           |
| 403  | Forbidden (wrong owner)          |
| 404  | Resource not found               |
| 500  | Internal server error            |

```json
{ "message": "Insufficient funds" }
```