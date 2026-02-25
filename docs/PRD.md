# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product Name: Pulse

---

## 1. Product Overview

### 1.1 Product Vision

Pulse is a secure, real-time messaging web application that supports:

- 1-to-1 messaging
- Group chats with role-based permissions
- File sharing
- Read receipts
- Typing indicators
- Online/offline presence
- Scalable backend architecture

**Primary focus:**

Production-grade real-time communication system using WebSockets with strong authentication and data integrity.

---

## 2. Goals & Non-Goals

### 2.1 Goals

- Deliver low-latency real-time chat
- Maintain strong data consistency
- Provide secure JWT-based authentication
- Ensure horizontal scalability
- Enable file uploads with persistent object storage
- Support future extension (voice/video, encryption)

### 2.2 Non-Goals (Phase 1)

- Video calling
- Voice calling
- End-to-end encryption (E2EE)
- Public channels
- Social feed

---

## 3. Target Users

- Students
- Small teams
- Developers
- Internal organization communication
- Study groups

**Expected user base:**

- Phase 1: 1k–10k users
- Phase 2: 100k+ scalable architecture

---

## 4. Core Features

### 4.1 Authentication & Authorization

#### Functional Requirements

- User registration
- Login with JWT
- Refresh token support
- Password hashing (bcrypt)
- Role-based access in groups (Admin, Member)

#### Non-Functional

- Access tokens expire in 15 min
- Refresh tokens stored securely (HTTP-only cookies)
- Rate limiting on login attempts

### 4.2 Conversations

#### 4.2.1 1-to-1 Conversations

- Unique conversation between 2 users
- Auto-create if not exists
- Cannot duplicate conversation

#### 4.2.2 Group Conversations

- Multiple participants
- Roles:
  - Admin
  - Member
- Admin can:
  - Add/remove members
  - Delete group
  - Promote member

### 4.3 Messaging

#### Functional Requirements

- Send text message
- Send file message
- Edit message (within 10 minutes)
- Delete message (soft delete)
- Pagination (cursor-based)

#### Message Metadata

- senderId
- conversationId
- content
- type (TEXT, FILE)
- fileUrl
- createdAt
- updatedAt
- readStatus

### 4.4 Real-Time Features (WebSocket)

- Message delivery
- Typing indicator
- Read receipt update
- Online/offline presence

#### Protocol

- Socket authentication via JWT
- Room-based communication (conversationId)
- Redis adapter required for scaling

### 4.5 File Upload

#### Supported Types

- PDF
- DOCX
- PNG
- JPG

#### Storage

- MinIO (S3-compatible)
- Bucket: pulse-files
- File stored with UUID naming
- Max file size: 10MB

### 4.6 Presence System

- Online when socket connected
- Offline when disconnect
- Last seen stored in DB
- Broadcast status to conversation members

---

## 5. System Architecture

### 5.1 High-Level Architecture

```
Client (React)
     |
REST + WebSocket
     |
NestJS Backend
     |
-----------------------------------------
| PostgreSQL | MinIO | Redis (future) |
-----------------------------------------
```

### 5.2 Backend Stack

- Framework: NestJS
- ORM: TypeORM
- Database: PostgreSQL
- Storage: MinIO
- Auth: JWT
- Realtime: Socket.IO
- Containerization: Docker
- Reverse Proxy: Nginx (future)

---

## 6. Database Schema (Core Entities)

### 6.1 User

| Field        | Type    | Description           |
|--------------|---------|-----------------------|
| id           | UUID    | Primary key           |
| email        | String  | Unique email          |
| passwordHash | String  | Bcrypt hashed password|
| name         | String  | Display name          |
| createdAt    | Date    | Account creation      |
| updatedAt    | Date    | Last update           |
| lastSeen     | Date    | Last online time      |

### 6.2 Conversation

| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| id       | UUID   | Primary key                    |
| type     | Enum   | DIRECT, GROUP                  |
| name     | String | Group name (nullable)          |
| createdAt| Date   | Creation timestamp             |

### 6.3 ConversationParticipant

| Field          | Type   | Description              |
|----------------|--------|--------------------------|
| id             | UUID   | Primary key              |
| userId         | UUID   | FK to User               |
| conversationId | UUID   | FK to Conversation       |
| role           | Enum   | ADMIN, MEMBER            |
| joinedAt       | Date   | Join timestamp           |

### 6.4 Message

| Field          | Type    | Description              |
|----------------|---------|--------------------------|
| id             | UUID    | Primary key              |
| conversationId | UUID    | FK to Conversation       |
| senderId       | UUID    | FK to User               |
| content        | Text    | Message content          |
| type           | Enum    | TEXT, FILE               |
| fileUrl        | String  | File URL (nullable)      |
| isEdited       | Boolean | Edit flag                |
| isDeleted      | Boolean | Soft delete flag         |
| createdAt      | Date    | Creation timestamp       |

### 6.5 MessageRead

| Field     | Type | Description        |
|-----------|------|--------------------|
| id        | UUID | Primary key        |
| messageId | UUID | FK to Message      |
| userId    | UUID | FK to User         |
| readAt    | Date | Read timestamp     |

---

## 7. API Specifications (High-Level)

### Auth

| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| POST   | /auth/register    | Register user     |
| POST   | /auth/login       | Login user        |
| POST   | /auth/refresh     | Refresh token     |

### Conversations

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /conversations/direct     | Create direct chat       |
| POST   | /conversations/group      | Create group chat        |
| GET    | /conversations            | List user conversations  |
| GET    | /conversations/:id        | Get conversation details |

### Messages

| Method | Endpoint                              | Description           |
|--------|---------------------------------------|-----------------------|
| POST   | /messages                             | Send message          |
| GET    | /messages/:conversationId?cursor=     | Get paginated messages|
| DELETE | /messages/:id                         | Delete message        |
| PATCH  | /messages/:id                         | Edit message          |

### File Upload

| Method | Endpoint                           | Description         |
|--------|------------------------------------|---------------------|
| POST   | /chat/conversations/:id/upload     | Upload file         |
| GET    | /chat/files/:fileName              | Get signed URL      |

> **JWT Required** for all endpoints.

---

## 8. Non-Functional Requirements

### 8.1 Performance

- Message latency < 200ms
- API response < 300ms
- Pagination limit: 30 messages per fetch

### 8.2 Scalability

- Stateless backend
- Horizontal scaling
- Redis pub/sub for socket scaling
- Load balancer ready

### 8.3 Security

- Helmet middleware
- CORS restrictions
- Rate limiting
- Input validation (class-validator)
- File type validation
- SQL injection prevention (ORM)

---

## 9. DevOps & Deployment

### Development

- Docker Compose
- PostgreSQL container
- MinIO container

### Production (Phase 2)

- VPS or Cloud
- Nginx reverse proxy
- HTTPS (Let's Encrypt)
- PM2 or container orchestration
- Redis for scaling

---

## 10. Future Roadmap

### Phase 2

- End-to-end encryption
- Voice/video calls
- Push notifications
- Mobile app
- Message reactions
- Search functionality
- AI summarization

### Phase 3

- Enterprise admin dashboard
- Audit logs
- Multi-tenant architecture

---

## 11. Risks & Mitigation

| Risk                 | Mitigation              |
|----------------------|-------------------------|
| WebSocket scaling    | Redis adapter           |
| Large file abuse     | Size limits             |
| JWT theft            | Short expiry + refresh  |
| DB bottlenecks       | Indexing                |
| Message duplication  | Unique constraints      |

---

## 12. Metrics & Success Criteria

- DAU / MAU ratio
- Message delivery latency
- Crash-free sessions
- File upload success rate
- WebSocket reconnect success %

---

## 13. Definition of Done (Phase 1)

- [x] Users can register/login
- [x] Create direct conversation
- [x] Create group conversation
- [x] Send text message
- [x] Send file message
- [x] See typing indicator
- [x] See read receipts
- [x] See online presence
- [x] Paginated message history
- [x] Dockerized environment

---

## Final Evaluation

Your Pulse architecture is already well-aligned with a scalable chat system.

**You are not building a demo.**
**You are building a real distributed system foundation.**
