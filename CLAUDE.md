# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (compile-watch + nodemon in parallel)
npm run dev

# Build only
npm run build

# Run migrations (PostgreSQL, Kysely-based)
npm run postgres:migrate

# Run MongoDB migrations
npm run migrate:up
npm run migrate:down

# Start production server (requires prior build)
npm run start
```

Tests are not yet implemented (`npm test` exits with an error). The jest config (`jest.config.ts`) is wired for ESM + ts-jest when tests are added.

## Environment Variables

Copy `.env.example` and add the missing vars:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/scale_perform
POSTGRES_URI=postgresql://...
JWT_SECRET=...
```

## Architecture

Clean Architecture with four layers. Dependencies flow inward — domain knows nothing about infrastructure.

```
domain/         → entities (User, Product) and repository interfaces
application/    → use cases (orchestrate domain + repository)
infrastructure/ → concrete repositories (MongoProductRepository, PostgresUserRepository)
interfaces/     → HTTP controllers and route definitions
shared/         → container, AppError, JWT, metrics wrappers
middleware/     → error handler, HTTP metrics, auth (auth.middleware.ts is currently empty)
```

### Dual-database setup

- **MongoDB + Mongoose** — `Product` domain (read-heavy, cursor-based pagination)
- **PostgreSQL + Kysely** — `User`, `Wallet`, `LedgerEntry` (financial data requiring ACID guarantees)

Kysely schema types live in `src/infrastructure/db/postgres/types.ts`. Every query goes through Kysely — no raw SQL unless `sql` template tag is needed (e.g. `gen_random_uuid()`).

PostgreSQL migrations are custom Kysely scripts under `src/infrastructure/db/postgres/migrations/` and run via `npm run postgres:migrate`. MongoDB migrations use `migrate-mongo`.

### Dependency injection

Manual, no framework. `src/shared/container.ts` instantiates all repositories, use cases, and controllers and exports them. Routes import from the container.

### Request/response contract

Controllers receive `Request` and return a `Result` (`{ statusCode, status, message, data? }`). Routes call the controller and forward `statusCode` to `res.status()`. All errors throw `AppError`; the `handleError` middleware in `src/middleware/error.middleware.ts` catches them.

`AppError.isOperational` is `true` for 4xx (client errors), `false` for 5xx — the error middleware uses this distinction.

### Observability

`prom-client` exposes metrics at `GET /metrics`:
- `http_request_duration_seconds` — per route/method/status (HttpMetrics middleware)
- `usecase_execution_duration_seconds` — per use case name (UsecaseMetrics decorator wraps any `{ execute() }` object)
- `db_query_duration_seconds` — histogram available in `shared/dbMetrics.ts`, not yet wired to repositories

### Module system

The project uses `"type": "module"` with `"module": "NodeNext"`. All local imports **must** use `.js` extensions even for `.ts` source files.

## Domain model (wallet core)

```
users  1──* wallet  1──* ledger_entries
```

`ledger_entries.type` is `CREDIT | DEBIT`. Balance is stored as `varchar` (decimal string) — never as a floating-point type. `reference_id` on ledger entries is the idempotency key.

## Collaboration context

See `AGENTS.md` for project goals and the expected reviewer role. In summary: Deepa writes code first; Claude reviews and asks questions rather than generating solutions.
