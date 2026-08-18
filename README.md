# Microservices Blueprint Architecture (TypeScript Edition)

> **Enterprise TypeScript Microservices Platform with Strict Type Safety, Repository Pattern & Event-Driven Architecture**  
> *Architectural rules defined in `RULES.md`.*

This branch (`refactor/typescript`) provides an enterprise-grade **Node.js & TypeScript** implementation of our backend microservices platform, designed to complement our **Flutter Monorepo (`blueprint-project-flutter`)** and **Android Clean Architecture (`android-basic-clean-architecture`)** mobile applications.

---

## 🌿 Repository Branches & Multi-Stack Implementations

1. **`master` (or `main`)**: Node.js & Express JavaScript Microservices.
2. **`refactor/typescript`**: Node.js & Express TypeScript Microservices (current branch).
3. **`spring-boot-java`**: Enterprise Java 17 Spring Boot 3 microservice architecture.
4. **`spring-boot-kotlin`**: Modern Kotlin 2.0 Spring Boot 3 microservice architecture.

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

## 🚀 TypeScript Microservices Breakdown

- **`api-gateway` (Port 3000):** Express + Proxy Middleware routing traffic to downstream services.
- **`auth-service` (Port 3001):** TypeScript service with `AuthRepository`, `AuthService`, and JWT authentication.
- **`explorer-service` (Port 4003):** Strongly-typed `FileItem` file system interface (`GET /api/v1/explorer`, `POST /api/v1/explorer/folders`, `DELETE /api/v1/explorer/:id`).
- **`url-builder-service` (Port 3002):** TypeScript service generating signed URLs and publishing events to RabbitMQ.
- **`email-service` (Port 3003):** TypeScript worker consuming RabbitMQ messages and delivering emails.

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
