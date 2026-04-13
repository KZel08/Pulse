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

### Core Documentation

| File | Description |
|------|-------------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Complete setup guide for local development environment |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, design patterns, and technical overview |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | REST API endpoints and usage examples |
| [WEBSOCKET_EVENTS.md](./WEBSOCKET_EVENTS.md) | Real-time WebSocket events and event payloads |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide and strategies |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines and development workflow |

### Project Specifications

| File | Description |
|------|-------------|
| [SRS.md](./SRS.md) | Software Requirements Specification - Detailed requirements and functional specifications |
| [PRD.md](./PRD.md) | Product Requirements Document - Product goals, features, and roadmap |
| [HLD.md](./HLD.md) | High-Level Design - System architecture and component design |
| [LLD.md](./LLD.md) | Low-Level Design - Detailed component specifications and APIs |
| [ERM.md](./ERM.md) | Entity Relationship Model - Database schema and relationships |
| [testresult.md](./testresult.md) | Test results and quality assurance reports |

## Getting Started

### Quick Start (5 minutes)

For experienced developers:

1. Clone the repository
2. Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Quick Setup section
3. Run all services: `docker-compose -f infra/docker-compose.yml up -d`
4. Start frontend: `cd frontend && npm run dev`
5. Start backend: `cd backend && npm run start:dev`

### Complete Setup

For detailed step-by-step setup with troubleshooting:
- See [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete Setup Guide

### Prerequisites

- Node.js 18+
- Python 3.9+ (for AI service)
- PostgreSQL
- Redis
- Docker & Docker Compose

### Quick Installation

1. Clone the repository
   ```bash
   git clone https://github.com/KZel08/Pulse.git
   cd Pulse
   ```

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

4. Configure environment files:
   - Create `backend/.env` (see [SETUP_GUIDE.md](./SETUP_GUIDE.md))
   - Create `frontend/.env.local` (see [SETUP_GUIDE.md](./SETUP_GUIDE.md))
   - Create `ai-service/.env` (see [SETUP_GUIDE.md](./SETUP_GUIDE.md))

5. Start Docker services (PostgreSQL & Redis):
   ```bash
   docker-compose -f infra/docker-compose.yml up -d
   ```

6. Run migrations:
   ```bash
   cd backend
   npm run migration:run
   ```

### Running Locally

See [SETUP_GUIDE.md - Running the Application](./SETUP_GUIDE.md#running-the-application)

## Documentation Navigation

### For First-Time Setup
Start with: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### For Understanding the System
Read: [ARCHITECTURE.md](./ARCHITECTURE.md)

### For API Integration
Check: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### For Real-time Features
Review: [WEBSOCKET_EVENTS.md](./WEBSOCKET_EVENTS.md)

### For Deploying to Production
Follow: [DEPLOYMENT.md](./DEPLOYMENT.md)

### For Contributing Code
See: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Key Features

✨ **Real-time Messaging** - Instant message delivery via WebSocket
🔐 **Secure Authentication** - JWT-based user authentication
👥 **User Profiles** - Manage user information and preferences
🤖 **AI Integration** - AI-powered message processing and features
📱 **Responsive Design** - Works on desktop, tablet, and mobile
🚀 **Scalable Architecture** - Designed for horizontal scaling
📊 **Database Persistence** - PostgreSQL for reliable data storage
⚡ **Performance Optimized** - Redis caching and optimized queries

## Project Stats

- **Backend**: NestJS + TypeORM + Socket.io
- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Service**: Python Flask
- **Database**: PostgreSQL + Redis
- **Tests**: Jest + Vitest + Pytest

## Development Team

This project is maintained by the Pulse development team. For questions or contributions, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see LICENSE file for details.

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
