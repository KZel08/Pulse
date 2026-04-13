# Pulse - API Documentation

Complete REST API documentation for the Pulse backend service.

## Table of Contents

1. [Authentication](#authentication)
2. [Auth Endpoints](#auth-endpoints)
3. [Chat Endpoints](#chat-endpoints)
4. [User Endpoints](#user-endpoints)
5. [Response Formats](#response-formats)
6. [Error Handling](#error-handling)

## Authentication

All protected endpoints require a valid JWT token in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer <jwt-token>
```

**Token Structure:**
```typescript
{
  sub: string;           // User ID
  email: string;
  iat: number;           // Issued at timestamp
  exp: number;           // Expiration timestamp
}
```

## Auth Endpoints

### POST `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-uuid-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Invalid email format or password too weak
- `409`: User already exists

### POST `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Errors:**
- `401`: Invalid email or password
- `404`: User not found

### GET `/auth/me`

Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": "user-uuid-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
- `401`: Unauthorized (invalid token)

## Chat Endpoints

### GET `/chat/conversations`

Get list of all conversations for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `limit` (optional, default: 50): Maximum number of conversations to return
- `offset` (optional, default: 0): Number of conversations to skip

**Response (200 OK):**
```json
[
  {
    "conversationId": "conv-uuid-456",
    "otherUserId": "user-uuid-789",
    "otherUserEmail": "other@example.com",
    "lastMessage": {
      "content": "Hey, how are you?",
      "createdAt": "2024-01-15T12:45:00Z",
      "senderId": "user-uuid-789"
    },
    "unreadCount": 2,
    "createdAt": "2024-01-14T15:20:00Z"
  }
]
```

**Errors:**
- `401`: Unauthorized

### GET `/chat/conversations/:conversationId/messages`

Get messages from a specific conversation.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `conversationId`: ID of the conversation

**Query Parameters:**
- `limit` (optional, default: 100): Maximum number of messages to return
- `offset` (optional, default: 0): Number of messages to skip

**Response (200 OK):**
```json
[
  {
    "id": "msg-uuid-001",
    "conversationId": "conv-uuid-456",
    "senderId": "user-uuid-123",
    "content": "Hi there!",
    "createdAt": "2024-01-15T11:20:00Z",
    "isRead": true
  },
  {
    "id": "msg-uuid-002",
    "conversationId": "conv-uuid-456",
    "senderId": "user-uuid-789",
    "content": "Hey! How's it going?",
    "createdAt": "2024-01-15T11:25:00Z",
    "isRead": true
  }
]
```

**Errors:**
- `401`: Unauthorized
- `403`: Access denied (user not in conversation)
- `404`: Conversation not found

## User Endpoints

### GET `/users/:userId`

Get public profile of a user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `userId`: ID of the user to fetch

**Response (200 OK):**
```json
{
  "id": "user-uuid-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "isOnline": true,
  "lastSeen": "2024-01-15T14:30:00Z"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: User not found

### PUT `/users/profile`

Update authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": "user-uuid-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatar.jpg",
  "updatedAt": "2024-01-15T14:35:00Z"
}
```

**Errors:**
- `400`: Invalid request body
- `401`: Unauthorized

### GET `/users/search`

Search for users by email or name.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional, default: 20): Maximum results

**Response (200 OK):**
```json
[
  {
    "id": "user-uuid-456",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "isOnline": true
  }
]
```

**Errors:**
- `400`: Missing search query
- `401`: Unauthorized

## Response Formats

### Success Response

```json
{
  "data": {},
  "message": "Operation successful",
  "statusCode": 200
}
```

### Error Response

```json
{
  "error": "Error message",
  "statusCode": 400,
  "message": "Bad Request",
  "timestamp": "2024-01-15T14:40:00Z"
}
```

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

### Error Response Example

```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-15T14:40:00Z"
}
```

## Rate Limiting

Currently not enforced but planned for production. Endpoints may implement rate limiting with headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

## Pagination

List endpoints support pagination through query parameters:

```
GET /chat/conversations?limit=10&offset=0
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

## Timestamps

All timestamps are in ISO 8601 format with UTC timezone:

```
2024-01-15T14:40:00Z
```

## Testing API Endpoints

### Using cURL

```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get current user (use token from login)
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Import collection from `docs/postman_collection.json`
2. Set `{{base_url}}` to `http://localhost:3000`
3. Set `{{token}}` from login response
4. Run requests

## Future API Enhancements

- [ ] Message encryption
- [ ] File upload/download
- [ ] Message reactions
- [ ] Group conversations
- [ ] Call history
- [ ] Message search
- [ ] Custom user statuses
