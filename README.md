# Scale-Perform

A TypeScript API focused on scalability, performance testing, and observability. Local development now runs directly on your machine and connects to MongoDB through the `MONGO_URI` value in your environment.

## Architecture

Client (HTTP)
-> Interfaces (controllers, routes)
-> Application (use cases)
-> Domain (entities, repository interfaces)
-> Infrastructure (MongoDB, ORM, DB connection)

This keeps transport, business logic, and persistence separated so the app is easier to evolve and test.

## Features

- Hot reload for local development
- TypeScript build output in `dist/`
- MongoDB-backed repository implementation
- Prometheus metrics endpoint at `/metrics`
- Clean architecture structure

## Local setup

### Prerequisites

- Node.js 24+
- A local or remote MongoDB instance

### Run the app

Install dependencies, create a `.env` file from `.env.example`, update the MongoDB connection string, then start the server:

```bash
npm install
npm run dev
```

The API uses `http://localhost:5000` by default.

## Scripts

- `npm run dev` runs TypeScript watch mode and the local server together
- `npm run build` compiles the project
- `npm run start` starts the compiled app from `dist/`
- `npm run clean` removes the `dist/` folder
