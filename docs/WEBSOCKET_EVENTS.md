# Pulse - WebSocket Events & Real-time Communication

This document describes all WebSocket events used in the Pulse application for real-time communication.

## Table of Contents

1. [Connection Events](#connection-events)
2. [Chat Events](#chat-events)
3. [Typing Events](#typing-events)
4. [Presence Events](#presence-events)
5. [Conversation Events](#conversation-events)
6. [Event Payloads](#event-payloads)

## Connection Events

### Server → Client: `connection` (auto)

Automatically emitted when a client connects to the WebSocket gateway.

```typescript
// Auto-emitted by Socket.io
socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Client → Server: `disconnect` (auto)

Automatically emitted when a client disconnects from the WebSocket gateway.

```typescript
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

## Chat Events

### Client → Server: `send_message`

Send a message in a conversation.

**Payload:**
```typescript
{
  toUserId: string;      // ID of recipient user
  content: string;       // Message content
}
```

**Example:**
```typescript
socket.emit('send_message', {
  toUserId: 'user-123',
  content: 'Hello! How are you?'
});
```

**Response:**
- Sender receives: `new_message` event
- Recipient receives: `new_message` event

### Server → Client: `new_message`

Received when a new message is sent or received.

**Payload:**
```typescript
{
  conversationId: string;  // ID of the conversation
  from: string;            // ID of message sender
  content: string;         // Message content
  createdAt: Date;         // Timestamp of message
}
```

**Example:**
```typescript
socket.on('new_message', (data) => {
  console.log(`Message from ${data.from}: ${data.content}`);
  console.log(`In conversation: ${data.conversationId}`);
});
```

## Typing Events

### Client → Server: `typing_start`

Notify others that user is typing.

**Payload:**
```typescript
{
  conversationId: string;  // ID of conversation where typing
}
```

**Example:**
```typescript
socket.emit('typing_start', {
  conversationId: 'conv-456'
});
```

**Broadcast:**
- All other users in the conversation room receive: `typing` event with `isTyping: true`

### Client → Server: `typing_stop`

Notify others that user stopped typing.

**Payload:**
```typescript
{
  conversationId: string;  // ID of conversation
}
```

**Example:**
```typescript
socket.emit('typing_stop', {
  conversationId: 'conv-456'
});
```

**Broadcast:**
- All other users in the conversation room receive: `typing` event with `isTyping: false`

### Server → Client: `typing`

Received when another user starts or stops typing.

**Payload:**
```typescript
{
  conversationId: string;  // ID of conversation
  userId: string;          // ID of user typing
  isTyping: boolean;       // true if typing, false if stopped
}
```

**Example:**
```typescript
socket.on('typing', (data) => {
  if (data.isTyping) {
    console.log(`${data.userId} is typing...`);
  } else {
    console.log(`${data.userId} stopped typing`);
  }
});
```

## Presence Events

### Server → Client: `presence`

Emitted when a user comes online or goes offline.

**Payload:**
```typescript
{
  userId: string;          // ID of user
  status: 'online' | 'offline';  // User status
}
```

**Example:**
```typescript
socket.on('presence', (data) => {
  if (data.status === 'online') {
    console.log(`${data.userId} came online`);
  } else {
    console.log(`${data.userId} went offline`);
  }
});
```

**When Emitted:**
- `online`: When a user authenticates and connects (after first connection)
- `offline`: When the last connection of a user disconnects

## Conversation Events

### Client → Server: `join_conversation`

Explicitly join a conversation room to receive room-specific events.

**Payload:**
```typescript
{
  conversationId: string;  // ID of conversation to join
}
```

**Example:**
```typescript
socket.emit('join_conversation', {
  conversationId: 'conv-789'
});
```

**Result:**
- Socket joins the conversation room
- Will receive all `typing` and `new_message` events for this conversation

### Client → Server: `leave_conversation`

Leave a conversation room (optional, automatic on disconnect).

**Payload:**
```typescript
{
  conversationId: string;  // ID of conversation to leave
}
```

**Example:**
```typescript
socket.emit('leave_conversation', {
  conversationId: 'conv-789'
});
```

## Event Payloads

### Message Object

```typescript
interface Message {
  conversationId: string;
  from: string;
  to: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}
```

### Conversation Object

```typescript
interface Conversation {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: Date;
}
```

### User Presence Object

```typescript
interface UserPresence {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  connectionCount?: number;
}
```

### Typing Indicator Object

```typescript
interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}
```

## Complete Example Flow

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// When connected
socket.on('connect', () => {
  console.log('Connected!');
});

// Listen for presence updates
socket.on('presence', (data) => {
  console.log(`User ${data.userId} is ${data.status}`);
});

// Join a conversation
socket.emit('join_conversation', { conversationId: 'conv-123' });

// Listen for new messages
socket.on('new_message', (message) => {
  console.log(`New message: ${message.content}`);
});

// Listen for typing indicators
socket.on('typing', (data) => {
  console.log(`${data.userId} is ${data.isTyping ? 'typing' : 'idle'}`);
});

// Send a message
socket.emit('send_message', {
  toUserId: 'user-456',
  content: 'Hello!'
});

// Start typing
socket.emit('typing_start', { conversationId: 'conv-123' });

// Stop typing
socket.emit('typing_stop', { conversationId: 'conv-123' });

// Clean up on disconnect
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

## Error Handling

All WebSocket events should be wrapped with proper error handling:

```typescript
socket.on('new_message', (data, error) => {
  if (error) {
    console.error('Failed to send message:', error);
    return;
  }
  console.log('Message sent successfully:', data);
});
```

## Broadcasting Behavior

- **User-targeted events** (sent to `user:{userId}` room): Only the specific user receives these
- **Conversation-targeted events** (sent to `{conversationId}` room): Only users in that conversation receive these
- **Broadcast events** (sent via `broadcast.emit`): All connected users except sender receive these

## Performance Considerations

1. **Typing Indicators**: Debounce `typing_start` and `typing_stop` events on client (suggest 300ms)
2. **Message History**: Use REST API endpoints instead of WebSocket for historical messages
3. **Room Joins**: Only join conversation rooms when opening a conversation
4. **Presence Tracking**: Presence events are broadcast to all clients; filter on client-side as needed

## Security Notes

- All WebSocket events are protected by JWT authentication
- User context is extracted from the JWT token on connection
- Events validate user permissions before broadcasting
- Conversation room access is restricted to conversation participants

## Future Enhancements

- Read receipts for messages
- Online status with timestamps
- Typing indicator duration auto-clear
- Group chat support (currently 1:1 conversations only)
- Voice/video signaling events
