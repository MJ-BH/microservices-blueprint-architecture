# Spring Boot Java Microservices Architecture Rules

1. **Tech Stack**:
   - Language: Java 17
   - Framework: Spring Boot 3.3.5
   - Security: Spring Security 6 with JWT Stateless Authentication
   - Persistence: Spring Data JPA + PostgreSQL / H2 Database

2. **Clean Layer Separation**:
   - `controller`: Exposes REST endpoints (`@RestController`).
   - `service`: Business transactions (`@Service`, `@Transactional`).
   - `domain`: JPA Database Entities (`@Entity`) and Spring Data Repositories (`@Repository`).
   - `core`: JWT Security filters, Global Exception Handlers, and `ApiResponse<T>` wrappers.

3. **Build & Verification**:
   - Build command: `./mvnw clean package`
   - Verification test command: `./mvnw test`
