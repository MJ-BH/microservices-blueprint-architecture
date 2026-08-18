# Microservices Blueprint Architecture (Spring Boot Kotlin 2.0 Edition)

> **Enterprise Kotlin 2.0 Spring Boot 3 Microservices Platform with Spring Data JPA & Kotlin Coroutines**  
> *Architectural rules defined in `RULES.md`.*

This branch (`spring-boot-kotlin`) provides an enterprise-grade **Kotlin 2.0 Spring Boot 3** implementation of our backend microservices platform, designed to complement our **Flutter Monorepo (`blueprint-project-flutter`)** and **Android Clean Architecture (`android-basic-clean-architecture`)** mobile applications.

---

## 🌿 Repository Branches & Multi-Stack Implementations

1. **`master` (or `main`)**: Node.js & Express JavaScript Microservices.
2. **`refactor/typescript`**: Node.js & Express TypeScript Microservices.
3. **`spring-boot-java`**: Enterprise Java 17 Spring Boot 3 Microservices.
4. **`spring-boot-kotlin`**: Modern Kotlin 2.0 Spring Boot 3 Microservices (current branch).

---

## 🚀 Spring Boot Kotlin Microservice Breakdown

- **Framework**: Spring Boot `3.3.5` + Kotlin `2.0.20`
- **Concurrency**: Kotlin Coroutines (`suspend`) + Flow
- **Persistence**: Spring Data JPA + H2 In-Memory / PostgreSQL
- **Security**: Spring Security + JWT Stateless Authentication Token Interceptor
- **Explorer Endpoint (`ExplorerController.kt`)**: 
  - `GET /api/v1/explorer?folderId=...`
  - `POST /api/v1/explorer/folders`
  - `DELETE /api/v1/explorer/{id}`

---

## 🛠️ Build & Verification Commands

```bash
# Compile and build executable JAR
./mvnw clean package

# Run Spring Boot Application
./mvnw spring-boot:run

# Run Unit Tests
./mvnw test
```
