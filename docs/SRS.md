# Software Requirements Specification (SRS)

## Pulse - Real-Time Messaging System

---

## Document Information

| Item          | Value                          |
|---------------|--------------------------------|
| Document ID   | PULSE-SRS-001                  |
| Version       | 1.0                            |
| Date          | February 25, 2026              |
| Status        | Approved                       |
| Author        | Pulse Development Team         |

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for Pulse, a real-time messaging web application. It serves as the foundation for development, testing, and validation of the system.

### 1.2 Scope

Pulse is a secure, scalable messaging platform that supports:
- One-to-one (direct) messaging
- Group conversations with role-based permissions
- File sharing with secure storage
- Real-time features (typing indicators, read receipts, presence)
- JWT-based authentication

### 1.3 Definitions, Acronyms, and Abbreviations

| Term        | Definition                                      |
|-------------|-------------------------------------------------|
| JWT         | JSON Web Token                                  |
| WebSocket   | Protocol for full-duplex communication          |
| REST        | Representational State Transfer                 |
| ORM         | Object-Relational Mapping                       |
| UUID        | Universally Unique Identifier                   |
| MinIO       | S3-compatible object storage                    |
| TypeORM     | TypeScript ORM for Node.js                      |
| Socket.IO   | WebSocket library for real-time communication   |

### 1.4 References

- PRD.md - Product Requirements Document
- ERM.md - Entity Relationship Model
- NestJS Documentation - https://docs.nestjs.com
- TypeORM Documentation - https://typeorm.io
- Socket.IO Documentation - https://socket.io/docs

### 1.5 Overview

This document is organized as follows:
- Section 2: Overall Description
- Section 3: Specific Requirements
- Section 4: Interface Requirements
- Section 5: Non-Functional Requirements
- Section 6: Appendices

---

## 2. Overall Description

### 2.1 Product Perspective

Pulse is a standalone web application with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Auth UI   │  │  Chat UI    │  │  File Upload UI     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST + WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (NestJS)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Auth Module │  │ Chat Module │  │  Storage Module     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ User Module │  │ WebSocket   │  │  Guards & Filters   │  │
│  │             │  │ Gateway     │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌───────────┐       ┌───────────┐       ┌───────────┐
    │ PostgreSQL│       │   MinIO   │       │   Redis   │
    │  (Data)   │       │ (Files)   │       │ (Future)  │
    └───────────┘       └───────────┘       └───────────┘
```

### 2.2 Product Functions

#### 2.2.1 Authentication Functions
- User registration with email and password
- User login with JWT token generation
- Token refresh mechanism
- Password hashing with bcrypt

#### 2.2.2 Conversation Functions
- Create direct (1-to-1) conversations
- Create group conversations
- List user's conversations
- Add/remove members in groups
- Leave group conversations

#### 2.2.3 Messaging Functions
- Send text messages
- Send file messages
- Retrieve paginated message history
- Real-time message delivery

#### 2.2.4 Real-Time Functions
- Typing indicators
- Read receipts
- Online/offline presence
- WebSocket room management

#### 2.2.5 File Functions
- Upload files to MinIO storage
- Generate signed URLs for secure access
- Support multiple file types (PDF, DOCX, PNG, JPG)

### 2.3 User Classes

| User Class | Description                          | Permissions                    |
|------------|--------------------------------------|--------------------------------|
| Guest      | Unauthenticated user                 | Register, Login                |
| Member     | Authenticated user                   | All messaging features         |
| Admin      | Group admin                          | Member management, group admin |

### 2.4 Operating Environment

| Component    | Technology        | Version    |
|--------------|-------------------|------------|
| Backend      | NestJS            | 11.x       |
| Frontend     | React             | 18.x       |
| Database     | PostgreSQL        | 15.x       |
| Storage      | MinIO             | Latest     |
| Cache/PubSub | Redis             | 7.x        |
| Runtime      | Node.js           | 20.x+      |
| Container    | Docker            | Latest     |

### 2.5 Design and Implementation Constraints

1. **Security Constraints**
   - All passwords must be hashed with bcrypt (cost factor 10+)
   - JWT tokens must have expiration times
   - File uploads must be validated for type and size

2. **Performance Constraints**
   - API response time must be under 300ms
   - Message delivery latency must be under 200ms
   - Pagination must be cursor-based for scalability

3. **Technology Constraints**
   - Backend must use NestJS framework
   - Database must use PostgreSQL
   - ORM must use TypeORM
   - Real-time must use Socket.IO

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Users have modern web browsers with WebSocket support
- Network connectivity is stable for real-time features
- File storage requirements are under 10MB per file

**Dependencies:**
- PostgreSQL database server
- MinIO object storage server
- Redis server (for future scaling)

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Authentication Requirements

| ID      | Requirement                                      | Priority |
|---------|--------------------------------------------------|----------|
| AUTH-01 | System shall allow user registration with email, password, and name | High |
| AUTH-02 | System shall validate email uniqueness           | High     |
| AUTH-03 | System shall hash passwords using bcrypt         | High     |
| AUTH-04 | System shall allow user login with email and password | High |
| AUTH-05 | System shall generate JWT access token on successful login | High |
| AUTH-06 | System shall validate JWT on protected routes    | High     |
| AUTH-07 | System shall return 401 for invalid/expired tokens | High |
| AUTH-08 | System shall support token refresh mechanism     | Medium   |

#### 3.1.2 Conversation Requirements

| ID      | Requirement                                      | Priority |
|---------|--------------------------------------------------|----------|
| CONV-01 | System shall allow creating direct conversations between two users | High |
| CONV-02 | System shall prevent duplicate direct conversations | High |
| CONV-03 | System shall allow creating group conversations with name and members | High |
| CONV-04 | System shall list all conversations for authenticated user | High |
| CONV-05 | System shall allow adding members to group conversations | High |
| CONV-06 | System shall allow removing members from group conversations | High |
| CONV-07 | System shall allow members to leave group conversations | High |
| CONV-08 | System shall enforce admin-only operations for member management | High |

#### 3.1.3 Messaging Requirements

| ID      | Requirement                                      | Priority |
|---------|--------------------------------------------------|----------|
| MSG-01  | System shall allow sending text messages         | High     |
| MSG-02  | System shall allow sending file messages         | High     |
| MSG-03  | System shall store messages with sender, conversation, content, and timestamp | High |
| MSG-04  | System shall retrieve paginated messages for a conversation | High |
| MSG-05  | System shall deliver messages in real-time via WebSocket | High |
| MSG-06  | System shall mark messages as read               | Medium   |
| MSG-07  | System shall support cursor-based pagination     | High     |

#### 3.1.4 Real-Time Requirements

| ID      | Requirement                                      | Priority |
|---------|--------------------------------------------------|----------|
| RT-01   | System shall establish WebSocket connection with JWT authentication | High |
| RT-02   | System shall broadcast messages to conversation rooms | High |
| RT-03   | System shall emit typing indicators             | Medium   |
| RT-04   | System shall emit read receipts                 | Medium   |
| RT-05   | System shall track online/offline presence      | Medium   |
| RT-06   | System shall handle reconnection gracefully     | High     |

#### 3.1.5 File Upload Requirements

| ID      | Requirement                                      | Priority |
|---------|--------------------------------------------------|----------|
| FILE-01 | System shall allow file uploads up to 10MB       | High     |
| FILE-02 | System shall validate file types (PDF, DOCX, PNG, JPG) | High |
| FILE-03 | System shall store files in MinIO with UUID naming | High |
| FILE-04 | System shall generate signed URLs for file access | High |
| FILE-05 | System shall associate files with messages       | High     |

### 3.2 Use Cases

#### UC-01: User Registration

| Item          | Description                                      |
|---------------|--------------------------------------------------|
| ID            | UC-01                                            |
| Name          | User Registration                                |
| Actor         | Guest                                            |
| Precondition  | User is not registered                           |
| Main Flow     | 1. User provides email, password, name           |
|               | 2. System validates input                        |
|               | 3. System checks email uniqueness                |
|               | 4. System hashes password                        |
|               | 5. System creates user record                    |
|               | 6. System returns user data                      |
| Postcondition | User account is created                          |
| Exceptions    | E1: Email already exists - return 409            |
|               | E2: Invalid input - return 400                   |

#### UC-02: User Login

| Item          | Description                                      |
|---------------|--------------------------------------------------|
| ID            | UC-02                                            |
| Name          | User Login                                       |
| Actor         | Registered User                                  |
| Precondition  | User has valid credentials                       |
| Main Flow     | 1. User provides email and password              |
|               | 2. System validates input                        |
|               | 3. System verifies credentials                   |
|               | 4. System generates JWT token                    |
|               | 5. System returns token and user data            |
| Postcondition | User is authenticated                            |
| Exceptions    | E1: Invalid credentials - return 401             |
|               | E2: User not found - return 401                  |

#### UC-03: Send Message

| Item          | Description                                      |
|---------------|--------------------------------------------------|
| ID            | UC-03                                            |
| Name          | Send Message                                     |
| Actor         | Authenticated User                               |
| Precondition  | User is member of conversation                   |
| Main Flow     | 1. User sends message via WebSocket              |
|               | 2. System validates JWT                          |
|               | 3. System verifies conversation membership       |
|               | 4. System stores message in database             |
|               | 5. System broadcasts to conversation room        |
| Postcondition | Message is delivered to all participants         |
| Exceptions    | E1: Not a member - return 403                    |
|               | E2: Invalid token - disconnect socket            |

#### UC-04: Upload File

| Item          | Description                                      |
|---------------|--------------------------------------------------|
| ID            | UC-04                                            |
| Name          | Upload File                                      |
| Actor         | Authenticated User                               |
| Precondition  | User is member of conversation                   |
| Main Flow     | 1. User uploads file via REST API                |
|               | 2. System validates file type and size           |
|               | 3. System stores file in MinIO                   |
|               | 4. System creates message with file URL          |
|               | 5. System broadcasts message via WebSocket       |
| Postcondition | File is stored and message is sent               |
| Exceptions    | E1: File too large - return 413                  |
|               | E2: Invalid type - return 400                    |

---

## 4. Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Login Page
- Email input field
- Password input field
- Login button
- Link to registration

#### 4.1.2 Registration Page
- Email input field
- Password input field
- Name input field
- Register button
- Link to login

#### 4.1.3 Chat Interface
- Conversation list sidebar
- Message display area
- Message input field
- File upload button
- Typing indicator display
- Online status indicators

### 4.2 API Interfaces

#### 4.2.1 REST API Endpoints

**Authentication**
```
POST /auth/register
POST /auth/login
POST /auth/refresh
```

**Conversations**
```
GET  /chat/conversations
POST /chat/groups
POST /chat/groups/:conversationId/add
POST /chat/groups/:conversationId/remove
POST /chat/groups/:conversationId/leave
```

**Messages**
```
GET  /chat/conversations/:conversationId/messages
POST /chat/conversations/:conversationId/upload
```

**Files**
```
GET /chat/files/:fileName
```

#### 4.2.2 WebSocket Events

**Client to Server**
| Event           | Payload                              | Description              |
|-----------------|--------------------------------------|--------------------------|
| send_message    | { conversationId, content, type }    | Send a message           |
| typing_start    | { conversationId }                   | Start typing indicator   |
| typing_stop     | { conversationId }                   | Stop typing indicator    |
| join_conversation| { conversationId }                  | Join conversation room   |

**Server to Client**
| Event           | Payload                              | Description              |
|-----------------|--------------------------------------|--------------------------|
| new_message     | { id, senderId, content, ... }       | New message received     |
| user_typing     | { userId, conversationId }           | User typing indicator    |
| user_online     | { userId }                           | User came online         |
| user_offline    | { userId }                           | User went offline        |

### 4.3 Database Interfaces

The system interfaces with PostgreSQL database through TypeORM. See ERM.md for detailed schema.

### 4.4 External Interfaces

#### 4.4.1 MinIO Object Storage
- Endpoint: Configured via environment variable
- Bucket: `pulse-files`
- Operations: Upload, Get Signed URL

#### 4.4.2 Redis (Future)
- Host: Configured via environment variable
- Port: 6379
- Usage: Socket.IO adapter for scaling

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID      | Requirement                                      | Metric           |
|---------|--------------------------------------------------|------------------|
| PERF-01 | API response time shall be under 300ms           | 95th percentile  |
| PERF-02 | Message delivery latency shall be under 200ms    | 95th percentile  |
| PERF-03 | System shall support 1000 concurrent connections | Per instance     |
| PERF-04 | Pagination shall return 30 messages per request  | Default limit    |

### 5.2 Scalability Requirements

| ID      | Requirement                                      |
|---------|--------------------------------------------------|
| SCALE-01| Backend shall be stateless for horizontal scaling|
| SCALE-02| WebSocket shall use Redis adapter for scaling    |
| SCALE-03| Database shall use connection pooling            |
| SCALE-04| File storage shall be external (MinIO)           |

### 5.3 Security Requirements

| ID      | Requirement                                      |
|---------|--------------------------------------------------|
| SEC-01  | All passwords shall be hashed with bcrypt        |
| SEC-02  | JWT tokens shall have expiration times           |
| SEC-03  | All protected routes shall require JWT validation|
| SEC-04  | File uploads shall be validated for type and size|
| SEC-05  | SQL injection shall be prevented via ORM         |
| SEC-06  | CORS shall be configured for allowed origins     |
| SEC-07  | Helmet middleware shall be used for HTTP headers |

### 5.4 Reliability Requirements

| ID      | Requirement                                      |
|---------|--------------------------------------------------|
| REL-01  | System shall handle WebSocket reconnection       |
| REL-02  | System shall gracefully handle database errors   |
| REL-03  | System shall log errors for debugging            |
| REL-04  | System shall not lose messages on transient failures |

### 5.5 Availability Requirements

| ID      | Requirement                                      |
|---------|--------------------------------------------------|
| AVAIL-01| System shall be available 99.5% of the time      |
| AVAIL-02| Docker containers shall restart on failure       |
| AVAIL-03| Database shall use persistent volumes            |

### 5.6 Maintainability Requirements

| ID      | Requirement                                      |
|---------|--------------------------------------------------|
| MAINT-01| Code shall follow TypeScript best practices      |
| MAINT-02| Code shall have unit tests                       |
| MAINT-03| API shall be documented                          |
| MAINT-04| Configuration shall be externalized              |

---

## 6. Appendices

### 6.1 Error Codes

| Code | Description                    |
|------|--------------------------------|
| 400  | Bad Request - Invalid input    |
| 401  | Unauthorized - Invalid token   |
| 403  | Forbidden - No permission      |
| 404  | Not Found                      |
| 409  | Conflict - Duplicate resource  |
| 413  | Payload Too Large              |
| 500  | Internal Server Error          |

### 6.2 Environment Variables

| Variable        | Description                    | Default        |
|-----------------|--------------------------------|----------------|
| DB_HOST         | PostgreSQL host                | localhost      |
| DB_PORT         | PostgreSQL port                | 5433           |
| DB_USER         | PostgreSQL user                | pulse          |
| DB_PASS         | PostgreSQL password            | pulse          |
| DB_NAME         | PostgreSQL database            | pulse          |
| JWT_SECRET      | JWT signing secret             | -              |
| JWT_EXPIRES_IN  | JWT expiration time            | 3600s          |
| REDIS_HOST      | Redis host                     | localhost      |
| REDIS_PORT      | Redis port                     | 6379           |
| AI_SERVICE_URL  | AI service URL                 | localhost:8001 |

### 6.3 File Type Validation

| Type   | Extension | MIME Type                    |
|--------|-----------|------------------------------|
| PDF    | .pdf      | application/pdf              |
| DOCX   | .docx     | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| PNG    | .png      | image/png                    |
| JPG    | .jpg, .jpeg | image/jpeg                 |

---

## Document Approval

| Role           | Name              | Signature | Date       |
|----------------|-------------------|-----------|------------|
| Project Lead   | Pulse Team        |           | 2026-02-25 |
| Tech Lead      | Pulse Team        |           | 2026-02-25 |
| QA Lead        | Pulse Team        |           | 2026-02-25 |

---

## Revision History

| Version | Date       | Author      | Changes                |
|---------|------------|-------------|------------------------|
| 1.0     | 2026-02-25 | Pulse Team  | Initial SRS document   |