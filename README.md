# Scale-Perform

Scale-Perform is a TypeScript API built to experiment with backend scalability, database performance, pagination strategies, and observability. The project currently uses MongoDB for product storage and exposes metrics that can be scraped and visualized for performance analysis.

The codebase follows a clean architecture style so HTTP handling, business rules, and persistence stay separated:

Client (HTTP)
-> Interfaces (controllers, routes)
-> Application (use cases)
-> Domain (entities, repository interfaces)
-> Infrastructure (MongoDB, schemas, DB connection, migrations)

This separation makes it easier to change storage details, add performance experiments, and measure the impact of those changes without tightly coupling the app.

## What the project covers

- Product listing APIs with filtering and cursor-based pagination
- MongoDB query optimization using compound indexes
- Prometheus metrics collection through `/metrics`
- Local performance experiments and latency comparisons
- Migration-based index management with `migrate-mongo`

## Tech stack

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- Prometheus client metrics

## Local setup

### Prerequisites

- Node.js 24+
- npm
- A running MongoDB instance, local or remote

### Environment variables

Create a `.env` file from `.env.example`.

Current required values:

- `PORT`
- `MONGO_URI`
- `DB_TYPE`

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/scale_perform
DB_TYPE=mongo
```

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

This starts TypeScript watch mode and the local server. By default the API runs on:

```text
http://localhost:5000
```

### Build and run compiled output

```bash
npm run build
npm run start
```

`npm run start` serves the compiled app from `dist/`, so `npm run build` must run first.

## Mongo migrations

This project uses `migrate-mongo` for MongoDB migrations.

Available commands:

- `npm run migrate:status`
- `npm run migrate:up`
- `npm run migrate:down`

These commands build the project first and then run migrations from:

```text
dist/infrastructure/db/mongo/migrations
```

Make sure `MONGO_URI` is set before running migrations.

## Useful endpoints

- `GET /health` returns server health information
- `GET /metrics` exposes Prometheus metrics
- `GET /api/products` returns product data with filters and cursor pagination

## Available scripts

- `npm run dev` runs local development mode
- `npm run build` compiles TypeScript into `dist/`
- `npm run start` starts the compiled server
- `npm run migrate:status` shows Mongo migration status
- `npm run migrate:up` applies pending Mongo migrations
- `npm run migrate:down` rolls back the latest Mongo migration
- `npm run clean` removes the `dist/` folder

## Notes on pagination

The product listing API supports cursor-based pagination.

- Default pagination can use `_id`
- Price-sorted pagination uses a composite cursor:
  - `lastSeenId`
  - `lastPrice`

This is required to keep pagination correct when sorting by price in ascending or descending order.
