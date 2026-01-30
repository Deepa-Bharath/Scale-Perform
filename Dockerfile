# Stage 1: Base (install deps only once)
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Builder (compile TS → dist)
FROM base AS builder
COPY . .
RUN npm run build

# Stage 3: Development (live watch, no prebuild)
FROM base AS development
WORKDIR /app
COPY . .
CMD ["npm", "run", "dev"]

# Stage 4: Production (use prebuilt dist)
FROM node:24-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
