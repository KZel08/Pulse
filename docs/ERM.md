# Entity Relationship Model (ERM)

## Pulse - Real-Time Messaging System

---

## 1. Overview

This document defines the Entity Relationship Model for the Pulse messaging system, including all entities, attributes, relationships, and constraints.

---

## 2. Entity Definitions

### 2.1 User Entity

Represents a registered user in the system.

| Attribute     | Type        | Constraints                    | Description                    |
|---------------|-------------|--------------------------------|--------------------------------|
| id            | UUID        | PRIMARY KEY, NOT NULL          | Unique identifier              |
| email         | VARCHAR(255)| UNIQUE, NOT NULL, INDEXED      | User email address             |
| password      | VARCHAR(255)| NOT NULL                      | Bcrypt hashed password         |
| name          | VARCHAR(100)| NOT NULL                      | Display name                   |
| createdAt     | TIMESTAMP   | NOT NULL, DEFAULT NOW()       | Account creation timestamp     |
| updatedAt     | TIMESTAMP   | NOT NULL, DEFAULT NOW()       | Last update timestamp          |
| lastSeen      | TIMESTAMP   | NULLABLE                      | Last online timestamp          |

**Indexes:**
- Primary Key: `id`
- Unique Index: `email`

---

### 2.2 Conversation Entity

Represents a conversation (direct or group) between users.

| Attribute  | Type        | Constraints                    | Description                    |
|------------|-------------|--------------------------------|--------------------------------|
| id         | UUID        | PRIMARY KEY, NOT NULL          | Unique identifier              |
| type       | ENUM        | NOT NULL                       | 'direct' or 'group'            |
| name       | VARCHAR(100)| NULLABLE                       | Group name (null for direct)   |
| userAId    | UUID        | NULLABLE, FK -> User.id        | First user (direct chats)      |
| userBId    | UUID        | NULLABLE, FK -> User.id        | Second user (direct chats)     |
| createdAt  | TIMESTAMP   | NOT NULL, DEFAULT NOW()       | Creation timestamp             |

**Indexes:**
- Primary Key: `id`
- Index: `type`
- Composite Unique: `(userAId, userBId)` for direct conversations

**Business Rules:**
- For direct conversations: `type = 'direct'`, `name` is NULL, `userAId` and `userBId` are required
- For group conversations: `type = 'group'`, `name` is required, `userAId` and `userBId` are NULL

---

### 2.3 ConversationMember Entity

Represents a user's participation in a conversation.

| Attribute       | Type        | Constraints                    | Description                    |
|-----------------|-------------|--------------------------------|--------------------------------|
| id              | UUID        | PRIMARY KEY, NOT NULL          | Unique identifier              |
| conversationId  | UUID        | NOT NULL, FK -> Conversation.id| Conversation reference         |
| userId          | UUID        | NOT NULL, FK -> User.id        | User reference                 |
| role            | ENUM        | NOT NULL, DEFAULT 'member'     | 'admin' or 'member'            |
| joinedAt        | TIMESTAMP   | NOT NULL, DEFAULT NOW()       | Join timestamp                 |

**Indexes:**
- Primary Key: `id`
- Index: `conversationId`
- Index: `userId`
- Unique Composite: `(conversationId, userId)`

**Business Rules:**
- Each user can only be a member of a conversation once
- Group conversations have at least one admin
- Direct conversations have two members with 'member' role

---

### 2.4 Message Entity

Represents a message sent in a conversation.

| Attribute       | Type        | Constraints                    | Description                    |
|-----------------|-------------|--------------------------------|--------------------------------|
| id              | UUID        | PRIMARY KEY, NOT NULL          | Unique identifier              |
| conversationId  | UUID        | NOT NULL, FK -> Conversation.id| Conversation reference         |
| senderId        | UUID        | NOT NULL, FK -> User.id        | Sender reference               |
| content         | TEXT        | NULLABLE                       | Message text content           |
| fileUrl         | VARCHAR(500)| NULLABLE                       | File URL (MinIO)               |
| fileName        | VARCHAR(255)| NULLABLE                       | Original file name             |
| isRead          | BOOLEAN     | NOT NULL, DEFAULT FALSE        | Read status                    |
| createdAt       | TIMESTAMP   | NOT NULL, DEFAULT NOW()       | Creation timestamp             |

**Indexes:**
- Primary Key: `id`
- Index: `conversationId`
- Index: `senderId`
- Index: `createdAt` (for pagination)

**Business Rules:**
- Either `content` or `fileUrl` must be present
- File messages have `content` as NULL
- Text messages have `fileUrl` as NULL

---

## 3. Entity Relationship Diagram

```
+-------------+       +------------------+       +-------------+
|    User     |       | Conversation     |       |    User     |
+-------------+       +------------------+       +-------------+
| id (PK)     |<----->| id (PK)          |<----->| id (PK)     |
| email       |       | type             |       | email       |
| password    |       | name             |       | password    |
| name        |       | userAId (FK)     |       | name        |
| createdAt   |       | userBId (FK)     |       | createdAt   |
| updatedAt   |       | createdAt        |       | updatedAt   |
| lastSeen    |       +------------------+       | lastSeen    |
+-------------+              |                  +-------------+
       |                      |                        |
       |                      |                        |
       v                      v                        v
+--------------------------------------------------------------------------------+
|                           ConversationMember                                   |
+--------------------------------------------------------------------------------+
| id (PK) | conversationId (FK) | userId (FK) | role | joinedAt                 |
+--------------------------------------------------------------------------------+
                              |
                              |
                              v
+--------------------------------------------------------------------------------+
|                                  Message                                       |
+--------------------------------------------------------------------------------+
| id (PK) | conversationId (FK) | senderId (FK) | content | fileUrl | createdAt |
+--------------------------------------------------------------------------------+
```

---

## 4. Relationship Definitions

### 4.1 User - Conversation (Direct)

**Relationship:** One-to-Many (on each side)

- A user can participate in many direct conversations
- A direct conversation has exactly two users (userA and userB)
- Implemented via `userAId` and `userBId` foreign keys

```
User (1) <-----> (N) Conversation (N) <-----> (1) User
```

### 4.2 User - Conversation (via ConversationMember)

**Relationship:** Many-to-Many

- A user can be a member of many conversations
- A conversation can have many members
- Resolved through `ConversationMember` junction table

```
User (M) <-----> (M) Conversation
           |
           v
    ConversationMember
```

### 4.3 User - Message

**Relationship:** One-to-Many

- A user can send many messages
- A message has exactly one sender

```
User (1) --------< (N) Message
```

### 4.4 Conversation - Message

**Relationship:** One-to-Many

- A conversation can have many messages
- A message belongs to exactly one conversation

```
Conversation (1) --------< (N) Message
```

---

## 5. Cardinality Summary

| Entity A          | Relationship | Entity B          | Cardinality |
|-------------------|--------------|-------------------|-------------|
| User              | sends        | Message           | 1:N         |
| Conversation      | contains     | Message           | 1:N         |
| User              | member of    | Conversation      | M:N         |
| User              | userA of     | Conversation      | 1:N         |
| User              | userB of     | Conversation      | 1:N         |

---

## 6. Data Integrity Constraints

### 6.1 Referential Integrity

| Constraint                          | On Delete | On Update |
|-------------------------------------|-----------|-----------|
| Message.senderId -> User.id         | CASCADE   | CASCADE   |
| Message.conversationId -> Conversation.id | CASCADE | CASCADE |
| ConversationMember.userId -> User.id | CASCADE  | CASCADE   |
| ConversationMember.conversationId -> Conversation.id | CASCADE | CASCADE |
| Conversation.userAId -> User.id     | SET NULL  | CASCADE   |
| Conversation.userBId -> User.id     | SET NULL  | CASCADE   |

### 6.2 Business Rule Constraints

1. **Unique Email:** Each user must have a unique email address
2. **Unique Direct Conversation:** A pair of users can only have one direct conversation
3. **Unique Membership:** A user can only be a member of a conversation once
4. **Valid Message Content:** A message must have either text content or a file URL
5. **Group Admin:** A group conversation must have at least one admin member

---

## 7. Physical Schema (PostgreSQL)

### 7.1 users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "lastSeen" TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### 7.2 conversations Table

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(10) NOT NULL CHECK (type IN ('direct', 'group')),
    name VARCHAR(100),
    "userAId" UUID REFERENCES users(id) ON DELETE SET NULL,
    "userBId" UUID REFERENCES users(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_type ON conversations(type);
CREATE UNIQUE INDEX idx_conversations_direct_pair 
    ON conversations("userAId", "userBId") 
    WHERE type = 'direct';
```

### 7.3 conversation_members Table

```sql
CREATE TABLE conversation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "conversationId" UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    "joinedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE("conversationId", "userId")
);

CREATE INDEX idx_conversation_members_conversation 
    ON conversation_members("conversationId");
CREATE INDEX idx_conversation_members_user 
    ON conversation_members("userId");
```

### 7.4 messages Table

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "conversationId" UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    "senderId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    "fileUrl" VARCHAR(500),
    "fileName" VARCHAR(255),
    "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation 
    ON messages("conversationId");
CREATE INDEX idx_messages_sender 
    ON messages("senderId");
CREATE INDEX idx_messages_created 
    ON messages("createdAt");
```

---

## 8. TypeORM Entity Mapping

### 8.1 User Entity

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastSeen: Date;
}
```

### 8.2 Conversation Entity

```typescript
@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: 'direct' | 'group';

  @Column({ nullable: true })
  userAId?: string;

  @Column({ nullable: true })
  userBId?: string;

  @Column({ nullable: true })
  name?: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 8.3 ConversationMember Entity

```typescript
@Entity('conversation_members')
export class ConversationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column()
  userId: string;

  @Column({ default: 'member' })
  role: 'admin' | 'member';

  @CreateDateColumn()
  joinedAt: Date;
}
```

### 8.4 Message Entity

```typescript
@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column()
  senderId: string;

  @Column('text', { nullable: true })
  content?: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 9. Future Extensions

### 9.1 MessageRead Entity (Phase 2)

```sql
CREATE TABLE message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "messageId" UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "readAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE("messageId", "userId")
);
```

### 9.2 RefreshToken Entity (Phase 2)

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 10. Migration Strategy

1. **Initial Migration:** Create all core tables
2. **Seed Data:** Create default buckets in MinIO
3. **Index Optimization:** Add indexes based on query patterns
4. **Future Migrations:** Add new entities as features are implemented

---

## Document Version

| Version | Date       | Author   | Changes                |
|---------|------------|----------|------------------------|
| 1.0     | 2026-02-25 | Pulse Team | Initial ERM document |