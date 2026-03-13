# Pulse - Real-time Chat Application

Welcome to the Pulse project documentation. This README provides an overview of the available documentation and helps you navigate the project.

## Project Overview

Pulse is a real-time chat application built with modern technologies, featuring instant messaging, user authentication, and conversation management.

## Technology Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis
- **Real-time**: WebSocket (Socket.io)
- **Authentication**: JWT (JSON Web Tokens)
- **AI Service**: Python-based AI service

## Documentation Structure

| File | Description |
|------|-------------|
| [SRS.md](./SRS.md) | Software Requirements Specification - Detailed requirements and functional specifications |
| [PRD.md](./PRD.md) | Product Requirements Document - Product goals, features, and roadmap |
| [HLD.md](./HLD.md) | High-Level Design - System architecture and component design |
| [LLD.md](./LLD.md) | Low-Level Design - Detailed component specifications and APIs |
| [ERM.md](./ERM.md) | Entity Relationship Model - Database schema and relationships |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (for AI service)
- PostgreSQL
- Redis
- Docker & Docker Compose

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install AI service dependencies:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   ```

4. Start infrastructure services:
   ```bash
   cd infra
   docker-compose up -d
   ```

5. Run the backend:
   ```bash
   cd backend
   npm run start:dev
   ```

6. Run the AI service:
   ```bash
   cd ai-service
   python main.py
   ```

## API Documentation

The backend runs on `http://localhost:3000` by default. REST endpoints and WebSocket connections are available for:

- User authentication (login, register)
- Conversation management (create, list, update, delete)
- Message handling (send, receive, mark as read)
- Real-time updates via WebSocket

## Project Structure

```
pulse/
├── backend/           # NestJS backend application
│   └── src/
│       ├── auth/     # Authentication module
│       ├── chat/     # Chat and messaging module
│       ├── users/    # User management module
│       └── storage/  # File storage service
├── ai-service/       # Python AI service
├── docs/             # Project documentation
└── infra/            # Infrastructure configuration
```

## License

This project is proprietary and confidential.
