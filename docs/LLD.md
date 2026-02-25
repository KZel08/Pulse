# Low Level Design (LLD)

## Pulse - Real-Time Messaging System

---

## Document Information

| Item          | Value                          |
|---------------|--------------------------------|
| Document ID   | PULSE-LLD-001                  |
| Version       | 1.0                            |
| Date          | February 25, 2026              |
| Status        | Approved                       |
| Author        | Pulse Development Team         |

---

## 1. Introduction

### 1.1 Purpose

This Low Level Design (LLD) document provides detailed technical specifications for implementing the Pulse messaging system. It includes class diagrams, sequence diagrams, API specifications, and code-level design decisions.

### 1.2 Scope

This document covers:
- Detailed class/module design
- API endpoint specifications
- WebSocket event specifications
- Database query patterns
- Error handling strategies
- Code structure and organization

### 1.3 References

- PRD.md - Product Requirements Document
- SRS.md - Software Requirements Specification
- ERM.md - Entity Relationship Model
- HLD.md - High Level Design

---

## 2. Module Design

### 2.1 Auth Module

#### 2.1.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        AuthModule                                │
├─────────────────────────────────────────────────────────────────┤
│  imports:                                                        │
│  - UsersModule                                                   │
│  - PassportModule                                                │
│  - JwtModule                                                     │
│  - ConfigModule                                                  │
├─────────────────────────────────────────────────────────────────┤
│  providers:                                                      │
│  - AuthService                                                   │
│  - JwtStrategy                                                   │
│  - LocalStrategy (optional)                                      │
├─────────────────────────────────────────────────────────────────┤
│  controllers:                                                    │
│  - AuthController                                                │
├─────────────────────────────────────────────────────────────────┤
│  exports:                                                        │
│  - AuthService                                                   │
│  - JwtAuthGuard                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      AuthController                              │
├─────────────────────────────────────────────────────────────────┤
│  + register(dto: RegisterDto): Promise<User>                     │
│  + login(dto: LoginDto): Promise<{ access_token, user }>         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AuthService                                │
├─────────────────────────────────────────────────────────────────┤
│  - usersService: UsersService                                    │
│  - jwtService: JwtService                                        │
├─────────────────────────────────────────────────────────────────┤
│  + register(email, password, name): Promise<User>                │
│  + validateUser(email, password): Promise<User | null>           │
│  + login(user): Promise<{ access_token, user }>                  │
│  + generateToken(user): string                                   │
│  + hashPassword(password): string                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        JwtStrategy                               │
├─────────────────────────────────────────────────────────────────┤
│  + validate(payload: JwtPayload): Promise<User>                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       JwtAuthGuard                               │
├─────────────────────────────────────────────────────────────────┤
│  + canActivate(context: ExecutionContext): boolean               │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.1.2 AuthController Implementation

```typescript
// backend/src/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
```

#### 2.1.3 AuthService Implementation

```typescript
// backend/src/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser(email, hashedPassword, name);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
```

#### 2.1.4 DTOs

```typescript
// backend/src/auth/dto/register.dto.ts
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}

// backend/src/auth/dto/login.dto.ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

---

### 2.2 Users Module

#### 2.2.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        UsersModule                               │
├─────────────────────────────────────────────────────────────────┤
│  imports:                                                        │
│  - TypeOrmModule.forFeature([User])                             │
├─────────────────────────────────────────────────────────────────┤
│  providers:                                                      │
│  - UsersService                                                  │
├─────────────────────────────────────────────────────────────────┤
│  exports:                                                        │
│  - UsersService                                                  │
│  - TypeOrmModule                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       UsersService                               │
├─────────────────────────────────────────────────────────────────┤
│  - usersRepository: Repository<User>                             │
├─────────────────────────────────────────────────────────────────┤
│  + createUser(email, password, name): Promise<User>              │
│  + findByEmail(email): Promise<User | null>                      │
│  + findById(id): Promise<User | null>                            │
│  + updateLastSeen(id): Promise<void>                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          User Entity                             │
├─────────────────────────────────────────────────────────────────┤
│  + id: string (UUID)                                             │
│  + email: string                                                  │
│  + password: string                                               │
│  + name: string                                                   │
│  + createdAt: Date                                                │
│  + updatedAt: Date                                                │
│  + lastSeen: Date (nullable)                                      │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.2.2 UsersService Implementation

```typescript
// backend/src/users/users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.usersRepository.create({ email, password, name });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateLastSeen(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastSeen: new Date() });
  }
}
```

---

### 2.3 Chat Module

#### 2.3.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ChatModule                                │
├─────────────────────────────────────────────────────────────────┤
│  imports:                                                        │
│  - TypeOrmModule.forFeature([Message, Conversation,              │
│      ConversationMember])                                        │
│  - JwtModule                                                     │
│  - ConfigModule                                                  │
├─────────────────────────────────────────────────────────────────┤
│  providers:                                                      │
│  - ChatService                                                   │
│  - ChatGateway                                                   │
│  - StorageService                                                │
├─────────────────────────────────────────────────────────────────┤
│  controllers:                                                    │
│  - ChatController                                                │
├─────────────────────────────────────────────────────────────────┤
│  exports:                                                        │
│  - StorageService                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ChatController                              │
├─────────────────────────────────────────────────────────────────┤
│  + getConversations(req): Promise<Conversation[]>                │
│  + createGroup(req, dto): Promise<Conversation>                  │
│  + getMessages(conversationId, req): Promise<Message[]>          │
│  + addMember(conversationId, req, dto): Promise<void>            │
│  + removeMember(conversationId, req, dto): Promise<void>         │
│  + leaveGroup(conversationId, req): Promise<void>                │
│  + uploadFile(conversationId, file, req): Promise<Message>       │
│  + getSignedUrl(fileName, req): Promise<{ url }>                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       ChatService                                │
├─────────────────────────────────────────────────────────────────┤
│  - messageRepo: Repository<Message>                              │
│  - conversationRepo: Repository<Conversation>                    │
│  - memberRepo: Repository<ConversationMember>                    │
│  - storageService: StorageService                                │
├─────────────────────────────────────────────────────────────────┤
│  + getUserConversations(userId): Promise<Conversation[]>         │
│  + createGroupConversation(name, creatorId, memberIds): Promise  │
│  + getMessagesForConversation(conversationId, userId): Promise   │
│  + addMember(conversationId, adminId, userId): Promise<void>     │
│  + removeMember(conversationId, adminId, userId): Promise<void>  │
│  + leaveGroup(conversationId, userId): Promise<void>             │
│  + uploadAndSendFile(conversationId, userId, file): Promise      │
│  + saveMessage(conversationId, senderId, content, fileUrl): ...  │
│  + isUserInConversation(conversationId, userId): Promise<bool>   │
│  + getOrCreateDirectConversation(userAId, userBId): Promise      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       ChatGateway                                │
├─────────────────────────────────────────────────────────────────┤
│  - server: Server                                                │
│  - chatService: ChatService                                      │
│  - usersService: UsersService                                    │
├─────────────────────────────────────────────────────────────────┤
│  + handleConnection(client: Socket): void                        │
│  + handleDisconnect(client: Socket): void                        │
│  + handleSendMessage(client, payload): Promise<Message>          │
│  + handleTypingStart(client, payload): void                      │
│  + handleTypingStop(client, payload): void                       │
│  + handleJoinConversation(client, payload): void                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.3.2 ChatController Implementation

```typescript
// backend/src/chat/chat.controller.ts
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
    private readonly storageService: StorageService,
  ) {}

  @Get('conversations')
  async getConversations(@Req() req: any) {
    return this.chatService.getUserConversations(req.user.userId);
  }

  @Post('groups')
  async createGroup(
    @Req() req: any,
    @Body() body: { name: string; memberIds: string[] },
  ) {
    return this.chatService.createGroupConversation(
      body.name,
      req.user.userId,
      body.memberIds,
    );
  }

  @Get('conversations/:conversationId/messages')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Req() req: any,
  ) {
    const messages = await this.chatService.getMessagesForConversation(
      conversationId,
      req.user.userId,
    );
    if (messages === null) {
      throw new ForbiddenException('Access denied');
    }
    return messages;
  }

  @Post('conversations/:conversationId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('conversationId') conversationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.chatService.uploadAndSendFile(
      conversationId,
      req.user.userId,
      file,
    );
  }

  @Get('files/:fileName')
  async getSignedUrl(
    @Param('fileName') fileName: string,
    @Req() req: any,
  ) {
    const url = await this.storageService.generateSignedUrl(
      'pulse-files',
      fileName,
    );
    return { url };
  }
}
```

#### 2.3.3 ChatService Implementation

```typescript
// backend/src/chat/chat.service.ts
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(ConversationMember)
    private memberRepo: Repository<ConversationMember>,
    private storageService: StorageService,
  ) {}

  async getUserConversations(userId: string): Promise<Conversation[]> {
    const members = await this.memberRepo.find({
      where: { userId },
      relations: ['conversation'],
    });
    return members.map(m => m.conversation);
  }

  async createGroupConversation(
    name: string,
    creatorId: string,
    memberIds: string[],
  ): Promise<Conversation> {
    const conversation = this.conversationRepo.create({
      type: 'group',
      name,
    });
    const saved = await this.conversationRepo.save(conversation);

    // Add creator as admin
    await this.memberRepo.save({
      conversationId: saved.id,
      userId: creatorId,
      role: 'admin',
    });

    // Add other members
    for (const memberId of memberIds) {
      await this.memberRepo.save({
        conversationId: saved.id,
        userId: memberId,
        role: 'member',
      });
    }

    return saved;
  }

  async getMessagesForConversation(
    conversationId: string,
    userId: string,
  ): Promise<Message[] | null> {
    const isMember = await this.isUserInConversation(conversationId, userId);
    if (!isMember) return null;

    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      take: 30,
    });
  }

  async saveMessage(
    conversationId: string,
    senderId: string,
    content?: string,
    fileUrl?: string,
    fileName?: string,
  ): Promise<Message> {
    const message = this.messageRepo.create({
      conversationId,
      senderId,
      content,
      fileUrl,
      fileName,
    });
    return this.messageRepo.save(message);
  }

  async isUserInConversation(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const member = await this.memberRepo.findOne({
      where: { conversationId, userId },
    });
    return !!member;
  }

  async uploadAndSendFile(
    conversationId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Message> {
    const isMember = await this.isUserInConversation(conversationId, userId);
    if (!isMember) {
      throw new ForbiddenException('Not a member of this conversation');
    }

    const fileName = `${uuid()}${path.extname(file.originalname)}`;
    await this.storageService.uploadFile(
      'pulse-files',
      fileName,
      file.buffer,
      file.mimetype,
    );

    const fileUrl = `http://localhost:9000/pulse-files/${fileName}`;
    return this.saveMessage(conversationId, userId, undefined, fileUrl, file.originalname);
  }
}
```

#### 2.3.4 ChatGateway Implementation

```typescript
// backend/src/chat/chat.gateway.ts
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;
      await this.usersService.updateLastSeen(user.id);
      
      // Join user's personal room
      client.join(`user:${user.id}`);
      
      // Broadcast online status
      this.server.emit('user_online', { userId: user.id });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.user) {
      await this.usersService.updateLastSeen(client.data.user.id);
      this.server.emit('user_offline', { userId: client.data.user.id });
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; content: string },
  ) {
    const { user } = client.data;
    const isMember = await this.chatService.isUserInConversation(
      payload.conversationId,
      user.id,
    );

    if (!isMember) {
      throw new WsException('Not a member of this conversation');
    }

    const message = await this.chatService.saveMessage(
      payload.conversationId,
      user.id,
      payload.content,
    );

    this.server.to(payload.conversationId).emit('new_message', message);
    return message;
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const { user } = client.data;
    client.to(payload.conversationId).emit('user_typing', {
      userId: user.id,
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const { user } = client.data;
    client.to(payload.conversationId).emit('user_stopped_typing', {
      userId: user.id,
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const { user } = client.data;
    const isMember = await this.chatService.isUserInConversation(
      payload.conversationId,
      user.id,
    );

    if (isMember) {
      client.join(payload.conversationId);
    }
  }
}
```

---

### 2.4 Storage Module

#### 2.4.1 Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      StorageService                              │
├─────────────────────────────────────────────────────────────────┤
│  - client: MinioClient                                           │
├─────────────────────────────────────────────────────────────────┤
│  + uploadFile(bucket, fileName, buffer, mimeType): Promise<url> │
│  + generateSignedUrl(bucket, fileName, expirySeconds): Promise  │
│  + ensureBucketExists(bucket): Promise<void>                     │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.4.2 StorageService Implementation

```typescript
// backend/src/storage/storage.service.ts
@Injectable()
export class StorageService {
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<{ url: string }> {
    await this.ensureBucketExists(bucket);
    
    await this.client.putObject(
      bucket,
      fileName,
      buffer,
      undefined,
      { 'Content-Type': mimeType },
    );

    return {
      url: `${process.env.MINIO_ENDPOINT || 'http://localhost:9000'}/${bucket}/${fileName}`,
    };
  }

  async generateSignedUrl(
    bucket: string,
    fileName: string,
    expirySeconds = 300,
  ): Promise<string> {
    return this.client.presignedGetObject(
      bucket,
      fileName,
      expirySeconds,
    );
  }

  private async ensureBucketExists(bucket: string): Promise<void> {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket);
    }
  }
}
```

---

## 3. API Specifications

### 3.1 REST API Endpoints

#### 3.1.1 Authentication Endpoints

**POST /auth/register**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response (201):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-02-25T00:00:00.000Z",
  "updatedAt": "2026-02-25T00:00:00.000Z"
}
```

Error Responses:
- 409: Email already exists
- 400: Validation error

---

**POST /auth/login**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Error Responses:
- 401: Invalid credentials

---

#### 3.1.2 Conversation Endpoints

**GET /chat/conversations**

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
[
  {
    "id": "uuid",
    "type": "direct",
    "name": null,
    "createdAt": "2026-02-25T00:00:00.000Z"
  },
  {
    "id": "uuid",
    "type": "group",
    "name": "Project Team",
    "createdAt": "2026-02-25T00:00:00.000Z"
  }
]
```

---

**POST /chat/groups**

Request:
```json
{
  "name": "Project Team",
  "memberIds": ["uuid1", "uuid2"]
}
```

Response (201):
```json
{
  "id": "uuid",
  "type": "group",
  "name": "Project Team",
  "createdAt": "2026-02-25T00:00:00.000Z"
}
```

---

#### 3.1.3 Message Endpoints

**GET /chat/conversations/:conversationId/messages**

Response (200):
```json
[
  {
    "id": "uuid",
    "conversationId": "uuid",
    "senderId": "uuid",
    "content": "Hello!",
    "fileUrl": null,
    "fileName": null,
    "isRead": false,
    "createdAt": "2026-02-25T00:00:00.000Z"
  }
]
```

Error Responses:
- 403: Not a member of conversation

---

**POST /chat/conversations/:conversationId/upload**

Request: multipart/form-data
- file: (binary)

Response (201):
```json
{
  "id": "uuid",
  "conversationId": "uuid",
  "senderId": "uuid",
  "content": null,
  "fileUrl": "http://localhost:9000/pulse-files/uuid.pdf",
  "fileName": "document.pdf",
  "isRead": false,
  "createdAt": "2026-02-25T00:00:00.000Z"
}
```

---

**GET /chat/files/:fileName**

Response (200):
```json
{
  "url": "http://localhost:9000/pulse-files/uuid.pdf?X-Amz-..."
}
```

---

### 3.2 WebSocket Events

#### 3.2.1 Client to Server Events

**send_message**
```typescript
{
  conversationId: string;
  content: string;
}
```

**typing_start**
```typescript
{
  conversationId: string;
}
```

**typing_stop**
```typescript
{
  conversationId: string;
}
```

**join_conversation**
```typescript
{
  conversationId: string;
}
```

#### 3.2.2 Server to Client Events

**new_message**
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  isRead: boolean;
  createdAt: Date;
}
```

**user_typing**
```typescript
{
  userId: string;
  conversationId: string;
}
```

**user_stopped_typing**
```typescript
{
  userId: string;
  conversationId: string;
}
```

**user_online**
```typescript
{
  userId: string;
}
```

**user_offline**
```typescript
{
  userId: string;
}
```

---

## 4. Sequence Diagrams

### 4.1 User Registration Sequence

```
┌────────┐     ┌────────────────┐     ┌──────────────┐     ┌──────────┐
│ Client │     │ AuthController │     │ AuthService  │     │ Database │
└───┬────┘     └───────┬────────┘     └──────┬───────┘     └────┬─────┘
    │                  │                     │                  │
    │ POST /auth/register                   │                  │
    │─────────────────>│                     │                  │
    │                  │                     │                  │
    │                  │ register(dto)       │                  │
    │                  │────────────────────>│                  │
    │                  │                     │                  │
    │                  │                     │ hash password    │
    │                  │                     │ (bcrypt)         │
    │                  │                     │                  │
    │                  │                     │ findByEmail()    │
    │                  │                     │─────────────────>│
    │                  │                     │                  │
    │                  │                     │ null             │
    │                  │                     │<─────────────────│
    │                  │                     │                  │
    │                  │                     │ save(user)       │
    │                  │                     │─────────────────>│
    │                  │                     │                  │
    │                  │                     │ user             │
    │                  │                     │<─────────────────│
    │                  │                     │                  │
    │                  │ user                │                  │
    │                  │<────────────────────│                  │
    │                  │                     │                  │
    │ 201 Created      │                     │                  │
    │<─────────────────│                     │                  │
    │                  │                     │                  │
```

### 4.2 WebSocket Message Sequence

```
┌────────┐     ┌────────────┐     ┌────────────┐     ┌──────────┐     ┌────────┐
│Client A│     │ ChatGateway│     │ ChatService│     │ Database │     │Client B│
└───┬────┘     └─────┬──────┘     └─────┬──────┘     └────┬─────┘     └───┬────┘
    │                │                   │                 │               │
    │ connect(JWT)   │                   │                 │               │
    │───────────────>│                   │                 │               │
    │                │                   │                 │               │
    │                │ verify JWT        │                 │               │
    │                │                   │                 │               │
    │ connection ack │                   │                 │               │
    │<───────────────│                   │                 │               │
    │                │                   │                 │               │
    │ send_message   │                   │                 │               │
    │───────────────>│                   │                 │               │
    │                │                   │                 │               │
    │                │ isUserInConv()    │                 │               │
    │                │──────────────────>│                 │               │
    │                │                   │                 │               │
    │                │                   │ findById()      │               │
    │                │                   │────────────────>│               │
    │                │                   │                 │               │
    │                │                   │ member          │               │
    │                │                   │<────────────────│               │
    │                │                   │                 │               │
    │                │ true              │                 │               │
    │                │<──────────────────│                 │               │
    │                │                   │                 │               │
    │                │ saveMessage()     │                 │               │
    │                │──────────────────>│                 │               │
    │                │                   │                 │               │
    │                │                   │ insert()        │               │
    │                │                   │────────────────>│               │
    │                │                   │                 │               │
    │                │                   │ message         │               │
    │                │                   │<────────────────│               │
    │                │                   │                 │               │
    │                │ message           │                 │               │
    │                │<──────────────────│                 │               │
    │                │                   │                 │               │
    │                │ broadcast new_message              │               │
    │                │───────────────────────────────────────────────────>│
    │                │                   │                 │               │
    │ new_message    │                   │                 │               │
    │<───────────────│                   │                 │               │
    │                │                   │                 │               │
```

---

## 5. Error Handling

### 5.1 Exception Filters

```typescript
// backend/src/common/filters/all-exceptions.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

### 5.2 Error Response Format

```json
{
  "statusCode": 400,
  "timestamp": "2026-02-25T00:00:00.000Z",
  "path": "/auth/register",
  "message": [
    "email must be a valid email",
    "password must be longer than 6 characters"
  ]
}
```

### 5.3 WebSocket Error Handling

```typescript
@SubscribeMessage('send_message')
async handleMessage(
  @ConnectedSocket() client: Socket,
  @MessageBody() payload: any,
) {
  try {
    // Validate payload
    if (!payload.conversationId || !payload.content) {
      throw new WsException('Invalid payload');
    }

    // Process message
    const message = await this.chatService.saveMessage(/* ... */);
    return message;
  } catch (error) {
    if (error instanceof WsException) {
      throw error;
    }
    throw new WsException('Internal server error');
  }
}
```

---

## 6. Configuration

### 6.1 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USER=pulse
DB_PASS=pulse
DB_NAME=pulse

# JWT
JWT_SECRET=supersecret_jwt_key
JWT_EXPIRES_IN=3600s

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false

# AI Service
AI_SERVICE_URL=http://localhost:8001
```

### 6.2 TypeORM Configuration

```typescript
// backend/src/app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
})
```

---

## 7. Testing Strategy

### 7.1 Unit Tests

```typescript
// backend/src/auth/auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findByEmail: jest.fn(), createUser: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const dto = { email: 'test@test.com', password: 'password', name: 'Test' };
      jest.spyOn(usersService, 'createUser').mockResolvedValue({ id: '1', ...dto });

      const result = await service.register(dto.email, dto.password, dto.name);
      expect(result.email).toBe(dto.email);
    });
  });
});
```

### 7.2 E2E Tests

```typescript
// backend/test/auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'password', name: 'Test' })
        .expect(201);
    });
  });
});
```

---

## 8. File Structure

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── chat/
│   │   ├── chat.module.ts
│   │   ├── chat.controller.ts
│   │   ├── chat.service.ts
│   │   ├── chat.gateway.ts
│   │   └── entities/
│   │       ├── message.entity.ts
│   │       ├── conversation.entity.ts
│   │       └── conversation-member.entity.ts
│   ├── storage/
│   │   └── storage.service.ts
│   └── common/
│       ├── filters/
│       │   └── all-exceptions.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── decorators/
│           └── current-user.decorator.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env
```

---

## Document Approval

| Role           | Name              | Signature | Date       |
|----------------|-------------------|-----------|------------|
| Project Lead   | Pulse Team        |           | 2026-02-25 |
| Tech Lead      | Pulse Team        |           | 2026-02-25 |
| Developer      | Pulse Team        |           | 2026-02-25 |

---

## Revision History

| Version | Date       | Author      | Changes                |
|---------|------------|-------------|------------------------|
| 1.0     | 2026-02-25 | Pulse Team  | Initial LLD document   |