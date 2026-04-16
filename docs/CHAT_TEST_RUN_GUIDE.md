# Running Chat Communication Test

This document provides step-by-step instructions to run the end-to-end test for verifying that two users can communicate via WebSocket on the same port from different browser windows, along with setting up and running the entire Pulse application.

## Prerequisites

Before running the tests, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- Python (v3.9 or higher)
- Docker and Docker Compose (optional, for containerized database)

## Environment Setup

### 1. Clone and Navigate to Project

```bash
git clone <repository-url>
cd pulse
```

### 2. Set Up Backend Environment

```bash
cd backend
cp .env.example .env  # Or create .env with the following content
```

Add to `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pulse_user
DB_PASSWORD=your_secure_password
DB_NAME=pulse_db

JWT_SECRET=your_jwt_secret_key_min_32_characters_long
JWT_EXPIRATION=3600

PORT=3000
NODE_ENV=test

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

AI_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173

FILE_UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Set Up Database

**Option A: Using Docker (Recommended)**

```bash
# From project root
docker-compose -f infra/docker-compose.yml up -d postgres redis
```

**Option B: Local PostgreSQL Setup**

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell:
CREATE USER pulse_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE pulse_db OWNER pulse_user;
GRANT ALL PRIVILEGES ON DATABASE pulse_db TO pulse_user;
\q
```

### 4. Set Up AI Service (Optional for Chat Test)

```bash
cd ../ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Full Application

### Start All Services

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm run migration:run
npm run start:dev
```

**Terminal 2 - AI Service (Optional):**

```bash
cd ai-service
source venv/bin/activate
python3 ai_service.py
```

**Terminal 3 - Frontend (Optional):**

```bash
cd frontend  # Assuming frontend directory exists
npm install
npm run dev
```

### Verify Services are Running

```bash
# Check backend health
curl http://localhost:3000/health

# Check AI service (if running)
curl http://localhost:8000/health
```

## Running the Chat Communication Test

### Prerequisites for Running Tests

The chat communication test requires a PostgreSQL database and Redis instance to be running. You can either:

**Option A: Use Docker (Recommended)**

```bash
# From project root
docker-compose -f infra/docker-compose.yml up -d postgres redis
```

**Option B: Local Database Setup**

Ensure PostgreSQL and Redis are running locally with the configuration matching `backend/.env`.

### 1. Install Test Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Create or update `backend/.env` with test database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pulse_user
DB_PASSWORD=your_secure_password
DB_NAME=pulse_db

JWT_SECRET=your_jwt_secret_key_min_32_characters_long
JWT_EXPIRATION=3600

PORT=3000
NODE_ENV=test

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

AI_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173

FILE_UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Run Database Migrations

```bash
cd backend
npm run migration:run
```

### 4. Run the Specific Chat Test

```bash
# Run only the chat e2e test
npm run test:e2e -- --testNamePattern="should allow 2 users to communicate via WebSocket"
```

### 5. Run All E2E Tests

```bash
# Run all end-to-end tests
npm run test:e2e
```

### 6. Run Tests with Coverage

```bash
# Run tests with coverage report
npm run test:cov
```

### Test Implementation Notes

The test (`backend/test/chat.e2e-spec.ts`) simulates two users connecting to the same WebSocket server:

1. **Setup**: Creates mock user authentication and conversation data
2. **Connection**: Establishes two separate WebSocket connections to the same server port
3. **Authentication**: Each connection authenticates using JWT tokens
4. **Messaging**: User 1 sends a message to the conversation
5. **Verification**: User 2 receives the message via their WebSocket connection
6. **Cleanup**: Disconnects both WebSocket connections

**Note**: The current test implementation uses mocked services to avoid database dependencies. For a full integration test, you would need to set up actual database connections and user authentication.

## Test Details

The chat communication test (`chat.e2e-spec.ts`) performs the following:

1. **Setup**: Creates two test users and obtains JWT tokens
2. **Connection**: Establishes two separate WebSocket connections to the same server port (simulating different browser windows/tabs)
3. **Authentication**: Each connection authenticates using JWT tokens
4. **Conversation**: Creates a direct message conversation between the two users
5. **Messaging**: User 1 sends a message to the conversation
6. **Verification**: User 2 receives the message via their WebSocket connection
7. **Cleanup**: Disconnects both WebSocket connections

## Troubleshooting

### Test Failures

**WebSocket Connection Issues:**

```bash
# Check if backend is running
curl http://localhost:3000/health

# Check port availability
lsof -i :3000
```

**Database Connection Issues:**

```bash
# Verify PostgreSQL is running
psql -U pulse_user -d pulse_db -c "SELECT 1"

# Check environment variables
cat backend/.env
```

**Redis Connection Issues:**

```bash
# Check Redis is running
redis-cli ping
```

### Port Conflicts

If port 3000 is in use:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Clean Up

To stop all services after testing:

```bash
# Stop Docker services
docker-compose -f infra/docker-compose.yml down

# Kill Node.js processes
pkill -f "nest start"
```

## Expected Test Output

When the test passes, you should see output similar to:

```
PASS  test/chat.e2e-spec.ts
Chat (e2e)
  ✓ should allow 2 users to communicate via WebSocket on same port (500ms)
```

The test verifies that:
- Two users can connect simultaneously to the same WebSocket server
- Authentication works for both connections
- Messages sent by one user are received by the other user in real-time
- The WebSocket implementation supports multiple concurrent connections on the same port