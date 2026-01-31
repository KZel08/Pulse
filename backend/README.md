# Pulse Backend

<p align="center">
  A NestJS-based backend service for the Pulse application, providing API endpoints for user management, authentication, chat functionality, document handling, and workspace management.
</p>

## Description

The Pulse backend is built with [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. This service handles core business logic, authentication, user management, and real-time communication features for the Pulse platform.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A database instance (configured via environment variables)

## Project Structure

```
src/
├── auth/          # Authentication & JWT strategy
├── chat/          # Chat functionality
├── documents/     # Document management
├── users/         # User management & profiles
├── workspaces/    # Workspace operations
├── app.module.ts  # Root module
├── app.controller.ts
├── app.service.ts
└── main.ts        # Application entry point
```

## Installation

```bash
$ npm install
```

## Configuration

Create a `.env` file in the root directory with necessary environment variables (database connection, JWT secrets, etc.).

## Running the Application

```bash
# development mode (with hot reload)
$ npm run start:dev

# production mode
$ npm run start:prod

# debug mode
$ npm run start:debug
```

The API will be available at `http://localhost:3000` by default.

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### WebSocket Testing

Use the included `ws-test.js` script to test real-time chat. Run in two terminals with different JWT tokens:

```bash
# Terminal 1 (User A connects and sends message)
TOKEN=<USER_A_JWT> node ws-test.js <USER_A_JWT> <USER_B_UUID> "Hello from A!"

# Terminal 2 (User B connects and sends reply)
TOKEN=<USER_B_JWT> node ws-test.js <USER_B_JWT> <USER_A_UUID> "Hi back from B!"
```

Each client will receive `new_message` events containing the conversation and message data.

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user account

### Chat (REST endpoints - see WebSocket section for real-time)
- `GET /chat/conversations` - Get user conversations
- `GET /chat/conversations/:id/messages` - Get messages for conversation
- `POST /chat/conversations` - Create conversation

### WebSocket Events (Real-time Chat)
Connect to WebSocket with JWT token in auth payload:
- **send_message** - Emit: `{ toUserId: string; content: string }` - Send private message to another user
- **new_message** - Listen: `{ conversationId: string; from: string; content: string; createdAt: Date }` - Receive new messages
- **chat_history** - Listen: Array of recent messages on connection (if enabled)

Clients automatically join `user:{userId}` room on connection for targeted message delivery.

### Documents
- `GET /documents` - List documents
- `POST /documents` - Upload document
- `GET /documents/:id` - Get document details
- `DELETE /documents/:id` - Delete document

### Workspaces
- `GET /workspaces` - Get user workspaces
- `POST /workspaces` - Create workspace
- `GET /workspaces/:id` - Get workspace details
- `PATCH /workspaces/:id` - Update workspace
- `DELETE /workspaces/:id` - Delete workspace

## Features

- **JWT Authentication** - Secure user authentication with JWT tokens
- **User Management** - Complete user profile and account management
- **Chat System** - Real-time messaging and conversation management
- **Document Handling** - Upload and manage documents
- **Workspace Management** - Multi-workspace support for users
- **TypeScript** - Fully typed codebase for better development experience
- **Modular Architecture** - Feature-based module structure for scalability

## System Requirements

### User Requirements
- Internet connection to access the API
- Valid credentials (email and password) for authentication
- Supported browser for web client integration (Chrome, Firefox, Safari, Edge)

### Development Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn v3.0.0+)
- **Git**: For version control
- **Code Editor**: VS Code, WebStorm, or equivalent
- **Database**: PostgreSQL, MySQL, or MongoDB (depending on configuration)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 500MB for node_modules and dependencies
- **Operating System**: Windows, macOS, or Linux

## Environment Variables

Key environment variables required:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=...
JWT_SECRET=...
JWT_EXPIRATION=3600
```

## Troubleshooting

- **Port already in use**: Change the PORT in environment variables or kill the process using the port
- **Database connection issues**: Verify DATABASE_URL and ensure the database service is running
- **JWT errors**: Check that JWT_SECRET is properly configured

## Support & Documentation

- [NestJS Documentation](https://docs.nestjs.com) - Framework documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript reference

## License

This project is proprietary software. All rights reserved.
