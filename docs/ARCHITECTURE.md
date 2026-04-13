# Pulse - Architecture & System Design

This document describes the overall architecture and design of the Pulse real-time chat application.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Components](#components)
4. [Data Flow](#data-flow)
5. [Technology Stack](#technology-stack)
6. [Design Patterns](#design-patterns)
7. [Security Architecture](#security-architecture)
8. [Scalability Considerations](#scalability-considerations)

## System Overview

Pulse is a full-stack, real-time chat application with the following characteristics:

- **Real-time Communication**: WebSocket-based instant messaging
- **User Authentication**: JWT-based secure authentication
- **Persistent Storage**: PostgreSQL database for messages and user data
- **Caching Layer**: Redis for session and real-time data
- **AI Integration**: Python-based service for message processing
- **Responsive UI**: React frontend with TypeScript
- **Microservices-Ready**: Modular backend architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Components:                                              │   │
│  │  - Login/Register                                         │   │
│  │  - Chat Window                                            │   │
│  │  - Conversation List                                      │   │
│  │  - User Profile                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/WebSocket
         ┌─────────────────┴─────────────────┐
         │                                   │
┌────────▼──────────────┐        ┌──────────▼─────────────┐
│   Backend (NestJS)    │        │  AI Service (Python)   │
├───────────────────────┤        ├───────────────────────┤
│ Modules:              │        │ Components:           │
│ - Auth Module         │        │ - Message Processing  │
│ - Chat Module         │        │ - Sentiment Analysis  │
│ - Users Module        │        │ - Content Filtering   │
│ - WebSocket Gateway   │        │ - Recommendations     │
│ - Documents Module    │        └───────────────────────┘
└────────┬──────────────┘
         │
    ┌────┴──────────────────┬────────────────┐
    │                       │                │
┌───▼────────────┐  ┌──────▼──────┐  ┌─────▼──────┐
│   PostgreSQL   │  │    Redis    │  │   Logs     │
│   Database     │  │   Cache     │  │            │
└────────────────┘  └─────────────┘  └────────────┘
```

## Components

### Frontend (React)

**Location**: `frontend/`

**Responsibilities**:
- User interface and interactions
- Real-time updates via WebSocket
- State management using Zustand
- Authentication token handling

**Key Technologies**:
- React 18+ with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Socket.io client for WebSocket

**Directory Structure**:
```
frontend/src/
├── components/        # React components
├── pages/            # Page-level components
├── services/         # Business logic (Socket.io)
├── store/            # State management
├── api/              # HTTP client setup
├── types/            # TypeScript types
└── assets/           # Images, icons
```

### Backend (NestJS)

**Location**: `backend/`

**Responsibilities**:
- API endpoints
- Business logic
- Database operations
- WebSocket event handling
- Authentication
- Real-time communication

**Key Technologies**:
- NestJS framework
- TypeORM for database
- Socket.io for WebSocket
- JWT for authentication
- PostgreSQL client

**Core Modules**:

1. **Auth Module** (`src/auth/`)
   - User registration and login
   - JWT token generation
   - Password validation
   - Guard implementations

2. **Chat Module** (`src/chat/`)
   - Message handling
   - Conversation management
   - WebSocket gateway
   - Typing indicators
   - Presence tracking

3. **Users Module** (`src/users/`)
   - User profile management
   - User search
   - User information endpoints

4. **Documents Module** (`src/documents/`)
   - File management
   - Document storage

5. **Workspaces Module** (`src/workspaces/`)
   - Workspace operations
   - Workspace settings

### AI Service (Python)

**Location**: `ai-service/`

**Responsibilities**:
- Message analysis
- Content filtering
- Sentiment analysis
- Recommendations
- AI-powered features

**Key Technologies**:
- Flask web framework
- PyTorch/TensorFlow for ML
- NLTK for NLP

## Data Flow

### Authentication Flow

```
1. User submits credentials (email, password)
   └─> Frontend: POST /auth/login
       └─> Backend: Validates credentials
           └─> Database: Queries user
               └─> Generates JWT token
                   └─> Returns token to frontend
2. Frontend stores JWT token
3. Subsequent requests include: Authorization: Bearer <token>
```

### Message Sending Flow

```
1. User types and sends message in chat window
   └─> Frontend: emit('send_message', {toUserId, content})
       └─> WebSocket: Transmits to backend
           └─> Backend Gateway: handleMessage()
               ├─> Extracts sender from JWT
               ├─> Gets/creates conversation
               ├─> Saves message to database
               ├─> Joins sender to conversation room
               └─> Broadcasts to both users
                   └─> Frontend: on('new_message')
                       └─> Updates chat display
2. Optional: Send to AI service for processing
   └─> Backend: POST http://ai-service:8000/analyze
```

### Real-time Presence Flow

```
1. User connects to WebSocket
   └─> Backend: handleConnection()
       ├─> Verifies JWT token
       ├─> Increments onlineUsers map
       └─> broadcast.emit('presence', {userId, status: 'online'})
2. Other users receive presence update
   └─> Frontend: on('presence')
       └─> Updates user status in UI
```

## Technology Stack

### Frontend
- **Language**: TypeScript
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **WebSocket**: Socket.io client
- **Testing**: Vitest, React Testing Library

### Backend
- **Language**: TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Cache**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator
- **Testing**: Jest

### AI Service
- **Language**: Python 3.9+
- **Framework**: Flask
- **ML Libraries**: PyTorch, TensorFlow, scikit-learn
- **NLP**: NLTK, spaCy
- **API Client**: Requests

### Infrastructure
- **Container**: Docker
- **Orchestration**: Docker Compose
- **Database**: PostgreSQL 12+
- **Cache**: Redis 6+
- **Version Control**: Git

## Design Patterns

### 1. Gateway Pattern (WebSocket)

The ChatGateway handles all WebSocket connections and events, providing a centralized point for real-time communication.

```typescript
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  async handleConnection(client: Socket) { /* ... */ }
  handleDisconnect(client: Socket) { /* ... */ }
  
  @SubscribeMessage('send_message')
  handleMessage(payload: SendMessageDto, client: Socket) { /* ... */ }
}
```

### 2. Service Layer Pattern

Business logic is encapsulated in services, separated from controllers and gateways.

```typescript
@Injectable()
export class ChatService {
  async saveMessage(conversationId: string, senderId: string, content: string) {
    // Business logic here
  }
}
```

### 3. Dependency Injection

NestJS uses constructor injection for managing dependencies.

```typescript
constructor(
  private readonly chatService: ChatService,
  private readonly jwtService: JwtService,
  private readonly configService: ConfigService,
) {}
```

### 4. Guard Pattern

Authentication and authorization are handled via guards.

```typescript
@UseGuards(JwtAuthGuard)
@Get('conversations')
async getConversations(@Req() req) {
  // Only authenticated users reach this
}
```

### 5. Module Pattern

Features are organized into cohesive modules.

```typescript
@Module({
  imports: [JwtModule, ConfigModule, TypeOrmModule.forFeature([Message])],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
```

## Security Architecture

### 1. Authentication

- **JWT Tokens**: Stateless authentication
- **Expiration**: Tokens expire after configurable time (default: 1 hour)
- **Refresh Tokens**: Support for token renewal (future enhancement)

### 2. Authorization

- **Role-Based Access Control (RBAC)**: Guards enforce user permissions
- **Conversation Ownership**: Users can only access their own conversations
- **Message Visibility**: Only conversation participants see messages

### 3. Data Protection

- **CORS**: Configured to allow specific origins
- **HTTPS**: Required in production
- **Input Validation**: All inputs validated with class-validator
- **SQL Injection Prevention**: TypeORM parameterized queries

### 4. WebSocket Security

- **JWT Verification**: Token verified on connection
- **User Context**: User info attached to socket after verification
- **Event Authorization**: Events validated for user permissions

```typescript
async handleConnection(client: Socket) {
  const token = client.handshake.auth?.token;
  const payload = this.jwtService.verify(token);
  client.data.user = { id: payload.sub, email: payload.email };
}
```

## Scalability Considerations

### 1. Database

- **Indexing**: Keys on `conversationId`, `senderId`, `createdAt`
- **Partitioning**: Messages table can be partitioned by date
- **Read Replicas**: PostgreSQL streaming replication
- **Connection Pooling**: Managed via TypeORM

### 2. Caching

- **Redis Caching**: Cache user sessions, conversation metadata
- **Cache Invalidation**: Update cache on message creation
- **TTL Strategy**: Sessions expire after inactivity

### 3. WebSocket Scaling

- **Adapter Pattern**: Socket.io Redis adapter for distributed connections
- **Room-Based Broadcasting**: Efficient message targeting
- **Namespace Isolation**: Separate namespaces for different features

### 4. Horizontal Scaling

```yaml
# Docker Compose with multiple backend instances
services:
  backend_1:
    image: pulse-backend
    ports: ["3001:3000"]
  backend_2:
    image: pulse-backend
    ports: ["3002:3000"]
  nginx:
    image: nginx
    ports: ["3000:80"]
    # Load balancing config
```

### 5. Message Queue (Future)

Consider implementing message queue for:
- Async message processing
- Decoupling frontend from backend
- Handling message spikes

```typescript
// Example with Bull queue
@Processor('chat')
export class ChatProcessor {
  @Process('process-message')
  async handleProcessMessage(job: Job) {
    // Process message asynchronously
  }
}
```

## Performance Optimization

### Frontend

- **Code Splitting**: Route-based code splitting with React.lazy
- **Image Optimization**: Lazy load images, use WebP format
- **Bundle Analysis**: Monitor bundle size
- **Memoization**: React.memo for preventing unnecessary renders

### Backend

- **Query Optimization**: Use `select`, `relation` loading
- **Pagination**: Limit results in list endpoints
- **Caching**: Cache frequently accessed data
- **Database Indexing**: Strategic indexes on common queries

### AI Service

- **Model Caching**: Keep models in memory
- **Batch Processing**: Process multiple messages together
- **Result Caching**: Cache model predictions

## Monitoring & Logging

### Backend Logging

```typescript
// NestJS built-in logger
private readonly logger = new Logger(ChatGateway.name);

this.logger.log('User connected');
this.logger.error('Connection failed', error);
```

### Metrics Collection

- Request response times
- WebSocket connection counts
- Message processing latency
- Database query performance
- Error rates

## Future Enhancements

- [ ] Message encryption (E2E)
- [ ] Voice/video calling
- [ ] Group conversations
- [ ] Message reactions
- [ ] File sharing
- [ ] Message search with full-text search
- [ ] Read receipts
- [ ] Message editing/deletion
- [ ] Custom status messages
- [ ] Notification system
