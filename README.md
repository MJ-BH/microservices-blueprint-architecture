# Microservices Blueprint Architecture

> **Unified Enterprise Ecosystem: Mobile Clients (Flutter & Android) ↔ Backend Microservices (Node.js/TS, Java & Kotlin Spring Boot)**  
> *Architectural rules defined in `RULES.md`.*

This repository provides an enterprise-grade backend microservices platform explicitly designed to connect seamlessly with our mobile client blueprints:
* 📱 **Flutter Monorepo Blueprint (`blueprint-project-flutter`)**
* 🤖 **Android Clean Architecture Blueprint (`android-basic-clean-architecture`)**

---

## 🔗 How the 3 Ecosystem Projects Link Together

```
┌─────────────────────────────────────────┐       ┌─────────────────────────────────────────┐
│     Flutter Monorepo Blueprint          │       │    Android Clean Architecture Blueprint │
│   (packages/explorer_repository)        │       │       (com.android.basiccleanarchitecture) │
└────────────────────┬────────────────────┘       └────────────────────┬────────────────────┘
                     │                                                 │
                     └────────────────────────┬────────────────────────┘
                                              │ REST API / JWT
                                              ▼
                                 ┌───────────────────────────┐
                                 │   API Gateway (Port 3000) │
                                 └─────────────┬─────────────┘
                                               │
           ┌───────────────────────────────────┼───────────────────────────────────┐
           │                                   │                                   │
┌──────────▼──────────┐             ┌──────────▼──────────┐             ┌──────────▼──────────┐
│    Auth Service     │             │  Explorer Service   │             │ URL Builder Service │
│     (Port 3001)     │             │     (Port 4003)     │             │     (Port 3002)     │
└─────────────────────┘             └──────────┬──────────┘             └──────────┬──────────┘
                                               │                                   │
                                    ┌──────────┴──────────┐            Generates Pre-Signed URLs
                                    │ Storage Provider    │            & Enqueues RabbitMQ Msg
                                    │ Abstraction Layer   │                        │
                                    └──────────┬──────────┘                  ┌─────▼─────┐
                                               │                             │ RabbitMQ  │
                        ┌──────────────────────┼──────────────────────┐      └─────┬─────┘
                        │                      │                      │            │
                 ┌──────▼──────┐        ┌──────▼──────┐        ┌──────▼──────┐ ┌───▼───────────┐
                 │ Local Server│        │ Cloudflare  │        │ Amazon S3   │ │ Email Service │
                 │ Disk / NAS  │        │     R2      │        │  / MinIO    │ │  (Port 3003)  │
                 └─────────────┘        └─────────────┘        └─────────────┘ └───────────────┘
```

### 🛠️ Service Flow & Roles

1. **`auth-service` (Port 3001)**:
   * Handles user authentication, registration, JWT token issuing, and token refresh loops for both Flutter and Android apps.

2. **`explorer-service` (Port 4003)**:
   * Serves file/folder parent-child hierarchies (`FileItem`), file creation metadata, renaming, and deletion requests.

3. **`url-builder-service` (Port 3002)**:
   * **Pre-Signed Upload & Download URL Generation:** When a user selects a file or document to upload from the mobile app, `url-builder-service` constructs secure, time-limited pre-signed URLs (S3, Cloudflare R2, or Local Server stream endpoints).
   * **Event Emission:** Triggers background event notifications into RabbitMQ queues upon file transfer completion.

4. **`email-service` (Port 3003)**:
   * Asynchronous event consumer reading RabbitMQ queues to dispatch transactional emails (storage quota alerts, file upload receipts, security warnings, password resets).

---

## 🗄️ Storage Provider Architecture (Multi-Storage Integration)

The `explorer-service` and `url-builder-service` decouple storage mechanisms behind a unified **Storage Provider Abstraction Layer**:

### 1. Local Server Disk / NAS Storage (`LocalStorageProvider`)
* **Use Case:** Self-hosted on-premise deployments or private server storage.
* **Implementation:** Files are written to a mounted volume path (`/var/storage/uploads/`).
* **URL Generation:** Generates direct streaming HTTP URLs (`http://api.yourdomain.com/api/v1/storage/files/{file_id}`).

### 2. Cloudflare R2 Storage (`CloudflareR2Provider`)
* **Use Case:** Zero-egress fee cloud object storage with ultra-fast global CDN delivery.
* **Implementation:** Uses AWS S3 SDK compatibility with Cloudflare endpoint (`https://{account_id}.r2.cloudflarestorage.com`).
* **Pre-Signed URL Generation:**
  ```javascript
  // Node.js / TypeScript R2 Pre-Signed Upload URL
  const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType
  });
  const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
  ```

### 3. Amazon S3 Storage (`AmazonS3Provider`)
* **Use Case:** Enterprise scalable cloud storage with IAM role-based security.
* **Implementation:** Amazon S3 SDK (`AWS.S3`).
* **Pre-Signed URL Generation:**
  ```java
  // Java Spring Boot S3 Pre-Signed Upload URL
  GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, fileKey)
      .withMethod(HttpMethod.PUT)
      .withExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000));
  URL presignedUrl = s3Client.generatePresignedUrl(request);
  ```

### 4. MinIO Self-Hosted Private Cloud (`MinioStorageProvider`)
* **Use Case:** Private cloud S3-compatible storage hosted on Kubernetes / Docker.
* **Implementation:** Connects via standard S3 client pointing to `http://minio:9000`.

---

## 🌿 Repository Branches & Multi-Stack Implementations

This blueprint repository is available across 4 specialized technology branches:

1. **`master` (or `main`)**: Node.js & Express JavaScript Microservices (`api-gateway`, `auth-service`, `explorer-service`, `email-service`, `url-builder-service`).
2. **`refactor/typescript`**: Node.js & Express TypeScript Microservices.
3. **`spring-boot-java`**: Enterprise Java 17 Spring Boot 3 microservice architecture.
4. **`spring-boot-kotlin`**: Modern Kotlin 2.0 Spring Boot 3 microservice architecture with Coroutines.

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
