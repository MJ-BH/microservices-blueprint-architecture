# Microservices Blueprint Architecture

> **Enterprise Microservices Platform supporting Node.js Express, TypeScript, Spring Boot Java & Spring Boot Kotlin**  
> *Architectural rules defined in `RULES.md`.*

This repository provides an enterprise-grade backend microservices platform designed to complement our **Flutter Monorepo (`blueprint-project-flutter`)** and **Android Clean Architecture (`android-basic-clean-architecture`)** mobile applications.

---

## 🌿 Repository Branches & Multi-Stack Implementations

This blueprint repository is available across 4 specialized technology branches:

1. **`master` (or `main`)**: Node.js & Express JavaScript Microservices (`api-gateway`, `auth-service`, `explorer-service`, `email-service`, `url-builder-service`).
2. **`refactor/typescript`**: Node.js & Express TypeScript Microservices with strict type safety and repository patterns.
3. **`spring-boot-java`**: Enterprise Java 17 Spring Boot 3 microservice architecture (Spring Security, Spring Data JPA, JWT tokens).
4. **`spring-boot-kotlin`**: Modern Kotlin 2.0 Spring Boot 3 microservice architecture with Kotlin Coroutines and Flow.

---

## 🏛️ Microservice Ecosystem Overview

```
                          ┌───────────────────────────┐
                          │   API Gateway (Port 3000) │
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
┌──────────▼──────────┐      ┌──────────▼──────────┐      ┌──────────▼──────────┐
│    Auth Service     │      │  Explorer Service   │      │ URL Builder Service │
│     (Port 3001)     │      │     (Port 4003)     │      │     (Port 3002)     │
└──────────┬──────────┘      └──────────┬──────────┘      └──────────┬──────────┘
           │                            │                            │
    MongoDB / JPA                REST API Endpoint                RabbitMQ Queue
                                                                     │
                                                              ┌──────▼──────┐
                                                              │ Email Service│
                                                              │ (Port 3003) │
                                                              └─────────────┘
```

---

## 🚀 Microservices Breakdown

- **`api-gateway` (Port 3000):** Central entry point routing client traffic to downstream services (`/api/v1/auth`, `/api/v1/explorer`, `/api/v1/tools`, `/api/v1/email`).
- **`auth-service` (Port 3001):** Handles user registration, JWT token generation, password hashing, and authentication verification.
- **`explorer-service` (Port 4003):** Manages file/folder structures (`FileItem`), parent-child hierarchy queries, folder creation, and deletion to serve Flutter and Android client apps.
- **`url-builder-service` (Port 3002):** Generates signed links and pushes async email notifications to RabbitMQ queues.
- **`email-service` (Port 3003):** Asynchronous worker consuming RabbitMQ queues and dispatching email templates.

---

## 🐳 Docker Deployment Commands

```bash
# Spin up complete microservice infrastructure (Gateway, Services, MongoDB, RabbitMQ)
docker-compose up -d --build

# View container logs
docker-compose logs -f

# Shut down containers
docker-compose down
```
