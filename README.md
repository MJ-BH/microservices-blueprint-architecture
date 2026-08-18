# Microservices Blueprint Architecture (Spring Boot Java 17 Edition)

> **Enterprise Java 17 Spring Boot 3 Microservices Platform with Spring Data JPA & Spring Security**  
> *Architectural rules defined in `RULES.md`.*

This branch (`spring-boot-java`) provides an enterprise-grade **Java 17 Spring Boot 3** implementation of our backend microservices platform, designed to complement our **Flutter Monorepo (`blueprint-project-flutter`)** and **Android Clean Architecture (`android-basic-clean-architecture`)** mobile applications.

---

## 🌿 Repository Branches & Multi-Stack Implementations

1. **`master` (or `main`)**: Node.js & Express JavaScript Microservices.
2. **`refactor/typescript`**: Node.js & Express TypeScript Microservices.
3. **`spring-boot-java`**: Enterprise Java 17 Spring Boot 3 Microservices (current branch).
4. **`spring-boot-kotlin`**: Modern Kotlin 2.0 Spring Boot 3 Microservices.

---

## 🚀 Spring Boot Java Microservice Breakdown

- **Framework**: Spring Boot `3.3.5` + Java `17`
- **Persistence**: Spring Data JPA + H2 In-Memory / PostgreSQL
- **Security**: Spring Security + JWT Stateless Authentication Token Interceptor
- **Explorer Endpoint (`ExplorerController`)**: 
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
