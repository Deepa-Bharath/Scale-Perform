# Scale-Perform: High-Performance API 🚀

A production-ready TypeScript + Docker application demonstrating API scalability and performance optimization techniques. This project creates a dummy GET API that efficiently handles multiple resources while maintaining optimal performance under load.

## Project Overview

Scale-Perform is designed to showcase best practices for building scalable Node.js APIs with Docker containerization. It includes a dummy GET API endpoint that retrieves and serves multiple resources, with performance monitoring and optimization strategies implemented throughout.

## Architecture
Client (HTTP)
   ↓
Interfaces (Controllers, Routes)
   ↓
Application (Use Cases)
   ↓
Domain (Entities, Repository Interfaces)
   ↑
Infrastructure (MongoDB, ORM, DB Connection)

### Why this Architecture?

This project is designed as a read-heavy API with the following long-term goals:

High read performance

Clear separation of concerns

Ability to switch databases (Mongo today, others later)

Easy observability (metrics, latency, DB timing)

Docker-first, production-like setup

To achieve these goals, we chose Hexagonal Architecture, also known as Ports & Adapters.

## Features
- ⚡ Hot reload in development
- 🐳 Multi-stage Docker builds
- 📦 TypeScript with incremental compilation
- 🏗️ Clean architecture structure
- 🔧 Configured for ES modules

## Quick Start

### Existing Project
  * npm init -y 
  * npm install - node modules intallation 
  * Typescript Setup - npx tsc --init
  * Docker setup

### Use as Template
1. Click the "Use this template" button
2. Create your new repository
3. Clone and start developing!

### Setup
```bash
# Clone your new repo
git clone https://github.com/yourusername/your-new-app.git
cd your-new-app

# Install dependencies
npm install

# Start development (terminals)
docker compose up dev  # Terminal 1: Docker container
