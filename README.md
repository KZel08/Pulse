# Pulse - Secure Real-Time Messaging Platform

A comprehensive messaging platform with AI-powered safety features, real-time communication, and enterprise-grade security. Built with modern web technologies and designed for privacy-first communication.

## 🚀 Features

- **Real-Time Messaging**: Instant messaging with WebSocket support
- **AI Safety Monitoring**: Automated content validation and toxicity detection
- **Group Chat**: Create and manage group conversations
- **File Sharing**: Secure file uploads with cloud storage
- **User Authentication**: JWT-based secure authentication
- **Voice Messages**: Record and send voice messages
- **Message Reactions**: Add reactions and emojis to messages
- **Ghost Mode**: Anonymous messaging capabilities
- **Cross-Platform**: Responsive web interface
- **Docker Support**: Containerized deployment ready

## 📸 Screenshots

![Screenshot 1](screenshots/1.jpeg)
![Screenshot 2](screenshots/2.jpeg)
![Screenshot 3](screenshots/3.jpeg)
![Screenshot 4](screenshots/4.jpeg)
![Screenshot 5](screenshots/5.jpeg)
![Screenshot 6](screenshots/6.jpeg)
![Screenshot 7](screenshots/7.jpeg)
![Screenshot 8](screenshots/8.jpeg)
![Screenshot 9](screenshots/9.jpeg)
![Screenshot 10](screenshots/10.jpeg)

## 🏗️ Architecture

The platform consists of three main services:

- **Frontend**: React-based web application with TypeScript
- **Backend**: NestJS API server with WebSocket support
- **AI Service**: Python FastAPI service for content analysis

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for AI service development)
- Git

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pulse
   ```

2. **Start all services**
   ```bash
   cd infra
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - AI Service: http://localhost:8001
   - MinIO Console: http://localhost:9001 (admin/admin)

The application will be fully running with all services orchestrated via Docker Compose.

## 🛠️ Local Development Setup

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Configure API URLs
npm run dev
```

### AI Service Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn ai_service:app --reload --host 0.0.0.0 --port 8001
```

## 🔧 Environment Configuration

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://pulse:pulse@localhost:5433/pulse
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
AI_SERVICE_URL=http://localhost:8001
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## 🏃 Running the Application

### Development Mode

```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: AI Service
cd ai-service && uvicorn ai_service:app --reload --host 0.0.0.0 --port 8001

# Terminal 4: Database & Redis (if not using Docker)
# Ensure PostgreSQL and Redis are running locally
```

### Production Mode

```bash
cd infra
docker-compose -f docker-compose.prod.yml up --build
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### WebSocket Testing

Use the provided test script:

```bash
cd backend
node ws-test.js <JWT_TOKEN> <RECEIVER_ID> "Test message"
```

## 📡 API Documentation

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Chat
- `GET /chat/conversations` - Get user conversations
- `POST /chat/groups` - Create group chat
- WebSocket events for real-time messaging

### AI Service
- `POST /ai/validate-safety` - Content safety check
- `POST /ai/smart-reply` - Generate reply suggestions
- `POST /ai/summarize` - Summarize conversations

## 🔒 Security Features

- JWT token authentication
- Real-time content moderation
- End-to-end encrypted messaging
- Rate limiting and abuse prevention
- Ghost mode for anonymity

## 🐳 Docker Services

The `infra/docker-compose.yml` includes:

- **PostgreSQL**: Database
- **Redis**: Caching and session store
- **MinIO**: Object storage
- **OnlyOffice**: Document editing
- **Backend**: NestJS API
- **Frontend**: React app
- **AI Service**: Python API

## 🚀 Deployment

### Using Docker Compose

```bash
cd infra
docker-compose up -d --build
```

### Manual Deployment

1. Build and deploy backend
2. Build and deploy frontend (static files)
3. Deploy AI service
4. Configure reverse proxy (nginx)
5. Set up SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Check the documentation in `docs/`
- Open an issue on GitHub
- Contact the development team</content>
<parameter name="filePath">README.md