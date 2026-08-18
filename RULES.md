# Spring Boot Microservices Architecture Rules

1. **Layer Separation**:
   - `controller`: Exposes REST endpoints (`@RestController`). No SQL queries or business logic allowed here.
   - `dto`: Decoupled Request/Response objects (`@Valid`).
   - `service`: Business transactions (`@Service`, `@Transactional`).
   - `domain`: JPA Database Entities (`@Entity`) and Spring Data Repositories (`@Repository`).
   - `core`: JWT Security filters, Global Exception Handlers, and API Response wrappers.

2. **Security & Authentication**:
   - Stateless JWT authentication via `JwtAuthenticationFilter` and `SecurityFilterChain`.
   - Dynamic profile configurations (`application-dev.yml`, `application-prod.yml`).

3. **Build & Containerization**:
   - Build command: `./mvnw clean package -DskipTests=false`
   - Docker deployment: `docker-compose up -d`
