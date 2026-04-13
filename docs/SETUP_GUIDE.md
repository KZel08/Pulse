# Pulse - Complete Setup Guide

This guide walks you through setting up the entire Pulse application locally.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [AI Service Setup](#ai-service-setup)
7. [Docker Compose Setup](#docker-compose-setup)
8. [Running the Application](#running-the-application)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: v18 or higher
- **Python**: v3.9 or higher
- **PostgreSQL**: v12 or higher
- **Redis**: v6 or higher
- **Docker**: v20 or higher (optional, for containerized setup)
- **Docker Compose**: v1.29 or higher (optional)
- **Git**: v2.30 or higher

### Verify Installation

```bash
# Check Node.js and npm
node --version
npm --version

# Check Python
python3 --version

# Check PostgreSQL
psql --version

# Check Redis (if installed locally)
redis-cli --version

# Check Docker (if installed)
docker --version
docker-compose --version
```

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KZel08/Pulse.git
cd Pulse
```

### 2. Backend Environment Configuration

Create `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

**Add the following environment variables** to `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pulse_user
DB_PASSWORD=your_secure_password
DB_NAME=pulse_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRATION=3600

# Server Configuration
PORT=3000
NODE_ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AI Service Configuration
AI_SERVICE_URL=http://localhost:8000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
FILE_UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Frontend Environment Configuration

Create `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env.local
```

**Add the following environment variables** to `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_AI_SERVICE_URL=http://localhost:8000
```

### 4. AI Service Environment Configuration

Create `.env` file in the `ai-service/` directory:

```bash
cd ai-service
touch .env
```

**Add the following environment variables** to `ai-service/.env`:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
PORT=8000

# AI Model Configuration
MODEL_NAME=gpt2
MODEL_PATH=./models

# Backend Service URL
BACKEND_URL=http://localhost:3000
```

## Database Setup

### Using PostgreSQL Locally

#### 1. Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell:
CREATE USER pulse_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE pulse_db OWNER pulse_user;
GRANT ALL PRIVILEGES ON DATABASE pulse_db TO pulse_user;
\q
```

#### 2. Run Migrations (from backend directory)

```bash
cd backend
npm run migration:run
```

### Using Docker (Recommended)

```bash
# Use Docker Compose to start PostgreSQL and Redis
docker-compose -f infra/docker-compose.yml up -d postgres redis
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Generate TypeORM Entities

```bash
npm run typeorm migration:generate
```

### 3. Run Database Migrations

```bash
npm run migration:run
```

### 4. Start the Backend

**Development Mode (with hot reload):**

```bash
npm run start:dev
```

**Production Mode:**

```bash
npm run build
npm run start:prod
```

The backend will be available at `http://localhost:3000`

### 5. Verify Backend

```bash
# In another terminal, test the health endpoint
curl http://localhost:3000/health
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

Output will be in `frontend/dist/`

## AI Service Setup

### 1. Create Virtual Environment

```bash
cd ai-service

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Download AI Models

```bash
python3 -c "import nltk; nltk.download('punkt')"
```

### 4. Start the AI Service

```bash
python3 ai_service.py
```

The AI service will be available at `http://localhost:8000`

## Docker Compose Setup

### 1. Start All Services

From the root directory:

```bash
docker-compose -f infra/docker-compose.yml up -d
```

### 2. View Service Status

```bash
docker-compose -f infra/docker-compose.yml ps
```

### 3. View Logs

```bash
# All services
docker-compose -f infra/docker-compose.yml logs -f

# Specific service
docker-compose -f infra/docker-compose.yml logs -f postgres
docker-compose -f infra/docker-compose.yml logs -f redis
```

### 4. Stop All Services

```bash
docker-compose -f infra/docker-compose.yml down
```

## Running the Application

### Development Setup (All Services)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
source venv/bin/activate
python3 ai_service.py
```

**Terminal 4 - Database & Redis (Docker):**
```bash
docker-compose -f infra/docker-compose.yml up -d
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **AI Service API**: http://localhost:8000

## Troubleshooting

### Connection Issues

#### Backend can't connect to PostgreSQL

```bash
# Check PostgreSQL is running
psql -U pulse_user -d pulse_db -c "SELECT 1"

# Verify environment variables in backend/.env
# Check DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### WebSocket Connection Fails

- Verify backend is running on port 3000
- Check `CORS_ORIGIN` in backend `.env`
- Ensure frontend and backend are on the same network

#### AI Service Not Responding

```bash
# Check AI service is running
curl http://localhost:8000/health

# Verify Python version
python3 --version

# Check dependencies
pip list | grep -E "flask|torch|transformers"
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Sync Issues

```bash
# Reset database (development only)
cd backend
npm run migration:revert
npm run migration:run
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API endpoints
- Review [WEBSOCKET_EVENTS.md](./WEBSOCKET_EVENTS.md) for real-time events
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review existing GitHub issues
3. Create a new GitHub issue with detailed information
