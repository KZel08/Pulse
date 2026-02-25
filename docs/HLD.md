# High Level Design (HLD)

## Pulse - Real-Time Messaging System

---

## Document Information

| Item          | Value                          |
|---------------|--------------------------------|
| Document ID   | PULSE-HLD-001                  |
| Version       | 1.0                            |
| Date          | February 25, 2026              |
| Status        | Approved                       |
| Author        | Pulse Development Team         |

---

## 1. Introduction

### 1.1 Purpose

This High Level Design (HLD) document provides an overview of the Pulse messaging system architecture, including system components, their interactions, and the technologies used. It serves as a blueprint for the detailed design and implementation phases.

### 1.2 Scope

This document covers:
- System architecture overview
- Component design
- Data flow
- Technology stack
- Deployment architecture
- Security architecture

### 1.3 References

- PRD.md - Product Requirements Document
- SRS.md - Software Requirements Specification
- ERM.md - Entity Relationship Model

---

## 2. System Architecture Overview

### 2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        React Web Application                         │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │    │
│  │  │  Auth    │  │  Chat    │  │  File    │  │  WebSocket Client    │ │    │
│  │  │  Module  │  │  Module  │  │  Module  │  │  (Socket.IO)         │ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS / WSS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY (Future)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          Nginx Reverse Proxy                         │    │
│  │  - SSL Termination                                                   │    │
│  │  - Load Balancing                                                    │    │
│  │  - Rate Limiting                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP / WebSocket
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        NestJS Backend                                │    │
│  │  ┌──────────────────────────────────────────────────────────────┐   │    │
│  │  │                     Core Modules                              │   │    │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │   │    │
│  │  │  │  Auth   │  │  User   │  │  Chat   │  │  Storage        │  │   │    │
│  │  │  │ Module  │  │ Module  │  │ Module  │  │  Module         │  │   │    │
│  │  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘  │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  │  ┌──────────────────────────────────────────────────────────────┐   │    │
│  │  │                   Infrastructure                              │   │    │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │   │    │
│  │  │  │ WebSocket   │  │  Guards     │  │  Interceptors       │   │   │    │
│  │  │  │ Gateway     │  │  (JWT)      │  │  (Logging, Errors)  │   │   │    │
│  │  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │   │    │
│  │  └──────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                    │                    │
                    │                    │                    │
                    ▼                    ▼                    ▼
┌─────────────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐
│      DATA LAYER         │  │  STORAGE LAYER  │  │     CACHE LAYER         │
│  ┌─────────────────┐    │  │  ┌───────────┐  │  │  ┌─────────────────┐   │
│  │   PostgreSQL    │    │  │  │   MinIO   │  │  │  │     Redis       │   │
│  │   (TypeORM)     │    │  │  │  (S3 API) │  │  │  │   (Future)      │   │
│  │                 │    │  │  │           │  │  │  │                 │   │
│  │  - Users        │    │  │  │ - Files   │  │  │  │ - Sessions      │   │
│  │  - Conversations│    │  │  │ - Images  │  │  │  │ - Pub/Sub       │   │
│  │  - Messages     │    │  │  │ - Docs    │  │  │  │ - Cache         │   │
│  └─────────────────┘    │  │  └───────────┘  │  │  └─────────────────┘   │
└─────────────────────────┘  └─────────────────┘  └─────────────────────────┘
```

### 2.2 Architecture Style

Pulse follows a **Layered Architecture** with the following layers:

1. **Client Layer** - React-based SPA
2. **API Gateway Layer** - Nginx reverse proxy (future)
3. **Application Layer** - NestJS backend services
4. **Data Layer** - PostgreSQL database
5. **Storage Layer** - MinIO object storage
6. **Cache Layer** - Redis (future)

---

## 3. Component Design

### 3.1 Frontend Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Application                           │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                     │
│  ├── Auth/                                                       │
│  │   ├── LoginForm                                               │
│  │   ├── RegisterForm                                            │
│  │   └── AuthContext                                              │
│  ├── Chat/                                                       │
│  │   ├── ConversationList                                        │
│  │   ├── MessageList                                             │
│  │   ├── MessageInput                                            │
│  │   ├── TypingIndicator                                         │
│  │   └── OnlineStatus                                            │
│  ├── File/                                                       │
│  │   ├── FileUpload                                              │
│  │   └── FilePreview                                             │
│  └── Common/                                                     │
│      ├── Layout                                                  │
│      ├── Header                                                  │
│      └── LoadingSpinner                                          │
├─────────────────────────────────────────────────────────────────┤
│  Services:                                                       │
│  ├── AuthService                                                 │
│  ├── ChatService                                                 │
│  ├── SocketService                                               │
│  └── FileService                                                 │
├─────────────────────────────────────────────────────────────────┤
│  State Management:                                               │
│  ├── React Context (Auth)                                        │
│  └── Local State (UI)                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Backend Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      NestJS Application                          │
├─────────────────────────────────────────────────────────────────┤
│  Modules:                                                        │
│  ├── AppModule (Root)                                            │
│  │   └── TypeORM Configuration                                   │
│  │   └── ConfigModule                                            │
│  ├── AuthModule                                                  │
│  │   ├── AuthController                                          │
│  │   ├── AuthService                                             │
│  │   ├── JwtStrategy                                             │
│  │   └── JwtAuthGuard                                            │
│  ├── UsersModule                                                 │
│  │   ├── UsersService                                            │
│  │   └── User Entity                                             │
│  ├── ChatModule                                                  │
│  │   ├── ChatController                                          │
│  │   ├── ChatService                                             │
│  │   ├── ChatGateway (WebSocket)                                 │
│  │   ├── Message Entity                                          │
│  │   ├── Conversation Entity                                     │
│  │   └── ConversationMember Entity                               │
│  └── StorageModule                                               │
│      └── StorageService                                          │
├─────────────────────────────────────────────────────────────────┤
│  Infrastructure:                                                 │
│  ├── Guards (JWT Authentication)                                 │
│  ├── Interceptors (Logging, Transform)                           │
│  ├── Filters (Exception Handling)                                │
│  └── Pipes (Validation)                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow

### 4.1 Authentication Flow

```
┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
│ Client │          │ Backend│          │   JWT  │          │   DB   │
└───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
    │                   │                   │                   │
    │ POST /auth/login  │                   │                   │
    │──────────────────>│                   │                   │
    │                   │                   │                   │
    │                   │ Find user         │                   │
    │                   │──────────────────────────────────────>│
    │                   │                   │                   │
    │                   │ User data         │                   │
    │                   │<──────────────────────────────────────│
    │                   │                   │                   │
    │                   │ Verify password   │                   │
    │                   │ (bcrypt)          │                   │
    │                   │                   │                   │
    │                   │ Generate token    │                   │
    │                   │──────────────────>│                   │
    │                   │                   │                   │
    │                   │ JWT Token         │                   │
    │                   │<──────────────────│                   │
    │                   │                   │                   │
    │ JWT Token         │                   │                   │
    │<──────────────────│                   │                   │
    │                   │                   │                   │
```

### 4.2 Message Flow (REST)

```
┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
│ Client │          │ Backend│          │ MinIO  │          │   DB   │
└───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
    │                   │                   │                   │
    │ POST /upload      │                   │                   │
    │ (file + JWT)      │                   │                   │
    │──────────────────>│                   │                   │
    │                   │                   │                   │
    │                   │ Validate JWT      │                   │
    │                   │                   │                   │
    │                   │ Store file        │                   │
    │                   │──────────────────>│                   │
    │                   │                   │                   │
    │                   │ File URL          │                   │
    │                   │<──────────────────│                   │
    │                   │                   │                   │
    │                   │ Create message    │                   │
    │                   │──────────────────────────────────────>│
    │                   │                   │                   │
    │                   │ Message saved     │                   │
    │                   │<──────────────────────────────────────│
    │                   │                   │                   │
    │ Message response  │                   │                   │
    │<──────────────────│                   │                   │
    │                   │                   │                   │
```

### 4.3 Message Flow (WebSocket)

```
┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
│ Client │          │Gateway │          │  DB    │          │ Other  │
│   A    │          │        │          │        │          │Clients │
└───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
    │                   │                   │                   │
    │ connect (JWT)     │                   │                   │
    │──────────────────>│                   │                   │
    │                   │                   │                   │
    │ connection ack    │                   │                   │
    │<──────────────────│                   │                   │
    │                   │                   │                   │
    │ send_message      │                   │                   │
    │──────────────────>│                   │                   │
    │                   │                   │                   │
    │                   │ Save message      │                   │
    │                   │──────────────────>│                   │
    │                   │                   │                   │
    │                   │ Message saved     │                   │
    │                   │<──────────────────│                   │
    │                   │                   │                   │
    │                   │ broadcast new_message               │
    │                   │──────────────────────────────────────>│
    │                   │                   │                   │
    │ new_message       │                   │                   │
    │<──────────────────│                   │                   │
    │                   │                   │                   │
```

---

## 5. Technology Stack

### 5.1 Frontend Stack

| Component      | Technology        | Version | Purpose                    |
|----------------|-------------------|---------|----------------------------|
| Framework      | React             | 18.x    | UI framework               |
| Language       | TypeScript        | 5.x     | Type safety                |
| State          | React Context     | -       | State management           |
| HTTP Client    | Axios/Fetch       | -       | API calls                  |
| WebSocket      | Socket.IO Client  | 4.x     | Real-time communication    |
| Styling        | CSS/Tailwind      | -       | UI styling                 |
| Build          | Vite              | 5.x     | Build tool                 |

### 5.2 Backend Stack

| Component      | Technology        | Version | Purpose                    |
|----------------|-------------------|---------|----------------------------|
| Framework      | NestJS            | 11.x    | Backend framework          |
| Language       | TypeScript        | 5.x     | Type safety                |
| ORM            | TypeORM           | 0.3.x   | Database ORM               |
| Auth           | Passport/JWT      | -       | Authentication             |
| WebSocket      | Socket.IO         | 4.x     | Real-time communication    |
| Validation     | class-validator   | -       | Input validation           |
| File Storage   | MinIO SDK         | -       | Object storage client      |

### 5.3 Infrastructure Stack

| Component      | Technology        | Version | Purpose                    |
|----------------|-------------------|---------|----------------------------|
| Database       | PostgreSQL        | 15.x    | Primary data store         |
| Object Storage | MinIO             | Latest  | File storage               |
| Cache/PubSub   | Redis             | 7.x     | Caching, scaling (future)  |
| Container      | Docker            | Latest  | Containerization           |
| Orchestration  | Docker Compose    | Latest  | Local development          |

---

## 6. Deployment Architecture

### 6.1 Development Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Backend    │  │  Frontend   │  │   AI        │              │
│  │  (NestJS)   │  │  (Vite)     │  │  Service    │              │
│  │  :3000      │  │  :5173      │  │  :8001      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                                    │                  │
│         ▼                                    ▼                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │   MinIO     │  │   Redis     │              │
│  │  :5433      │  │  :9000/9001 │  │  :6379      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Production Environment (Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Load Balancer                            │
│                         (Nginx/HAProxy)                          │
└─────────────────────────────────────────────────────────────────┘
                    │                         │
                    ▼                         ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│      Application Server 1   │ │      Application Server 2   │
│  ┌───────────────────────┐  │ │  ┌───────────────────────┐  │
│  │   NestJS Backend      │  │ │  │   NestJS Backend      │  │
│  │   (PM2/Docker)        │  │ │  │   (PM2/Docker)        │  │
│  └───────────────────────┘  │ │  └───────────────────────┘  │
└─────────────────────────────┘ └─────────────────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Shared Services                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │   MinIO     │  │   Redis     │              │
│  │ (Primary +  │  │  Cluster    │  │  Cluster    │              │
│  │  Replica)   │  │             │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Security Architecture

### 7.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                            │
│                                                                  │
│  1. User Login                                                   │
│     ┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐             │
│     │Client│────>│Backend│────>│ DB   │────>│Verify│             │
│     └──────┘     └──────┘     └──────┘     └──────┘             │
│                                                                  │
│  2. JWT Generation                                               │
│     ┌──────┐     ┌──────┐     ┌──────┐                          │
│     │Payload│────>│Secret│────>│ JWT  │                          │
│     └──────┘     │ Key  │     └──────┘                          │
│                  └──────┘                                       │
│                                                                  │
│  3. Request Authentication                                       │
│     ┌──────┐     ┌──────┐     ┌──────┐     ┌──────┐             │
│     │Request│────>│Guard │────>│Verify│────>│Access│             │
│     │+ JWT  │     │      │     │ JWT  │     │      │             │
│     └──────┘     └──────┘     └──────┘     └──────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Security Layers

| Layer          | Security Measure                                 |
|----------------|--------------------------------------------------|
| Transport      | HTTPS/TLS encryption                             |
| Authentication | JWT with expiration                              |
| Authorization  | Role-based access control                        |
| Input          | Validation with class-validator                  |
| Database       | ORM parameterized queries                        |
| Files          | Type validation, size limits                     |
| Headers        | Helmet middleware                                |
| CORS           | Origin whitelist                                 |

### 7.3 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "iat": 1708867200,
    "exp": 1708870800
  },
  "signature": "HMACSHA256(base64(header) + '.' + base64(payload), secret)"
}
```

---

## 8. Scalability Design

### 8.1 Horizontal Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Horizontal Scaling                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Load Balancer                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                       │
│          ┌───────────────┼───────────────┐                      │
│          ▼               ▼               ▼                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │  Instance 1 │ │  Instance 2 │ │  Instance 3 │                │
│  │  (Stateless)│ │  (Stateless)│ │  (Stateless)│                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
│          │               │               │                      │
│          └───────────────┼───────────────┘                      │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Redis Pub/Sub                          │    │
│  │              (WebSocket Event Distribution)               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Scaling Components

| Component      | Scaling Strategy                                  |
|----------------|---------------------------------------------------|
| Backend        | Stateless, horizontal scaling                     |
| WebSocket      | Redis adapter for pub/sub                         |
| Database       | Read replicas, connection pooling                 |
| Storage        | MinIO distributed mode                            |
| Cache          | Redis cluster                                     |

---

## 9. Monitoring and Logging

### 9.1 Logging Strategy

| Log Level | Purpose                          | Example                    |
|-----------|----------------------------------|----------------------------|
| ERROR     | Application errors               | Database connection failed |
| WARN      | Warning conditions               | Rate limit approaching     |
| INFO      | Normal operations                | User logged in             |
| DEBUG     | Debug information                | Request payload            |

### 9.2 Metrics to Monitor

| Metric                    | Description                        |
|---------------------------|------------------------------------|
| Request latency           | API response time                  |
| WebSocket connections     | Active connections count           |
| Message throughput        | Messages per second                |
| Database connections      | Active/pool connections            |
| Error rate                | Errors per minute                  |
| CPU/Memory usage          | Resource utilization               |

---

## 10. Future Enhancements

### 10.1 Phase 2 Enhancements

- Redis-based session management
- WebSocket scaling with Redis adapter
- End-to-end encryption
- Push notifications
- Message search (Elasticsearch)
- Voice/video calling (WebRTC)

### 10.2 Phase 3 Enhancements

- Multi-tenant architecture
- Enterprise admin dashboard
- Audit logging
- Advanced analytics
- AI-powered features

---

## Document Approval

| Role           | Name              | Signature | Date       |
|----------------|-------------------|-----------|------------|
| Project Lead   | Pulse Team        |           | 2026-02-25 |
| Tech Lead      | Pulse Team        |           | 2026-02-25 |
| Architect      | Pulse Team        |           | 2026-02-25 |

---

## Revision History

| Version | Date       | Author      | Changes                |
|---------|------------|-------------|------------------------|
| 1.0     | 2026-02-25 | Pulse Team  | Initial HLD document   |