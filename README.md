# Scale-Perform — Social Lending & Wallet App

A backend REST API for tracking informal loans between friends and settling them via in-app wallet transfers. Every settlement produces a verifiable ledger entry — no "mark as paid" shortcuts.

Built as a structured learning project for fintech system design: atomicity, idempotency, audit trails, and debt lifecycle management.

## What it does

- Users register and get a wallet automatically
- **Lend**: User A tops up their wallet and transfers to User B — a debt is created (B owes A)
- **Request**: User B requests money from A — A approves, transfer happens, debt is created
- **External payment**: A paid for B outside the app (cash, UPI) — A records it, B confirms or disputes
- **Settlement**: B can only settle via wallet transfer — no external "mark paid" option
- **Reminders**: Month-end reminders to both lender (what you're owed) and borrower (what you owe)
- **Withdrawal**: Users can transfer wallet balance to their bank account

Ledger entries are immutable. Every money movement (top-up, transfer, withdrawal, settlement) is recorded.

## Debt status lifecycle

```
PENDING_CONFIRMATION → ACTIVE → SETTLED
PENDING_CONFIRMATION → DISPUTED  (terminal — manual resolution required)
```

Wallet-originated and request-approved debts skip confirmation and go straight to ACTIVE.

## Tech stack

- Node.js 24+ + TypeScript (strict mode, ESM)
- Express
- PostgreSQL + [Kysely](https://kysely.dev) — type-safe SQL query builder; chosen over raw SQL for compile-time query validation and over ORMs (Prisma, TypeORM) to keep full control of queries without hidden abstractions, which matters for financial data where query correctness is critical
- MongoDB (connection infrastructure — available for future features)
- JWT auth (jsonwebtoken + bcrypt)
- Prometheus metrics (prom-client)

## Architecture

Clean Architecture — dependencies flow inward, domain knows nothing about infrastructure.

```
domain/         → entities and repository interfaces (pure TS, no deps)
application/    → use cases (orchestrate domain + repositories)
infrastructure/ → Kysely (PostgreSQL) and MongoDB connection
interfaces/     → Express controllers and routes
shared/         → DI container, AppError, JWT helper, metrics wrappers
middleware/     → error handler, HTTP metrics, auth
```

### Domain model

```
users 1──* wallets 1──* ledger_entries
users 1──* debts (as lender or borrower)
users 1──* lending_requests (as requester or target)
debts 1──1 ledger_entry (settlement reference)
```

Balance and amounts are stored as `varchar` (decimal string) — never as floating-point.

### Dependency injection

Manual, no framework. `src/shared/container.ts` wires repositories → use cases → controllers. Routes import from the container.

## Local setup

### Prerequisites

- Node.js 24+
- npm
- PostgreSQL instance (local or remote)
- MongoDB instance (local or remote)

### Environment variables

Copy `.env.example` and fill in the values:

```env
PORT=5000
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=scale_perform
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
MONGO_URI=mongodb://127.0.0.1:27017/scale_perform
JWT_SECRET=your_secret
```

When setting up PostgreSQL locally with pgAdmin:

```
Host: 127.0.0.1
Port: 5432
Maintenance database: postgres
Username: postgres
App database: scale_perform
```

### Install and run

```bash
npm install
npm run dev       # TypeScript watch + nodemon
```

```bash
npm run build     # compile to dist/
npm run start     # serve compiled output
```

### Database migrations

PostgreSQL (Kysely-based):

```bash
npm run postgres:migrate
```

MongoDB:

```bash
npm run migrate:up
npm run migrate:down
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | Register a new user (wallet auto-created) |
| POST | `/api/login` | Login, returns JWT |
| POST | `/api/transfer-funds` | Wallet-to-wallet transfer |
| GET | `/health` | Server health check |
| GET | `/metrics` | Prometheus metrics |

More endpoints coming as debt and lending features are built.

## Observability

- `GET /metrics` exposes Prometheus-format metrics
- `http_request_duration_seconds` — per route/method/status
- `usecase_execution_duration_seconds` — per use case (via UsecaseMetrics decorator)

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Watch mode — compile + nodemon |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Start compiled server |
| `npm run postgres:migrate` | Run PostgreSQL migrations |
| `npm run migrate:up` | Apply pending MongoDB migrations |
| `npm run migrate:down` | Roll back latest MongoDB migration |
| `npm run clean` | Remove `dist/` folder |
