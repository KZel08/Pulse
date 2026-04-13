# Pulse - Deployment Guide

This guide covers deployment strategies for the Pulse application to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [AI Service Deployment](#ai-service-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Environment Configuration](#environment-configuration)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Monitoring & Logs](#monitoring--logs)
10. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Dependencies updated and audited
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] SSL/TLS certificates ready
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Load testing completed
- [ ] Security audit completed

## Database Setup

### Production PostgreSQL

#### 1. Create Dedicated User

```sql
CREATE USER pulse_prod WITH ENCRYPTED PASSWORD 'strong_password';
CREATE DATABASE pulse_production OWNER pulse_prod;
GRANT ALL PRIVILEGES ON DATABASE pulse_production TO pulse_prod;

-- Connection limit
ALTER USER pulse_prod WITH CONNECTION LIMIT 50;
```

#### 2. Enable SSL Connections

```sql
-- In postgresql.conf
ssl = on
ssl_cert_file = '/etc/postgresql/server.crt'
ssl_key_file = '/etc/postgresql/server.key'
```

#### 3. Configure Connection Pooling (PgBouncer)

```ini
[databases]
pulse_production = host=localhost port=5432 dbname=pulse_production

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3
```

#### 4. Run Migrations

```bash
cd backend
npm run migration:run -- --database production
```

### Production Redis

```bash
# Update redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
requirepass strong_redis_password

# Start Redis
redis-server /etc/redis/redis.conf
```

## Backend Deployment

### 1. Build the Application

```bash
cd backend

# Install dependencies
npm ci --only=production

# Build
npm run build

# Verify build
ls dist/
```

### 2. Configure Environment

Create production `.env`:

```env
# Database
DB_HOST=prod-db.example.com
DB_PORT=5432
DB_USERNAME=pulse_prod
DB_PASSWORD=<strong_password>
DB_NAME=pulse_production
DB_SSL=true

# JWT
JWT_SECRET=<very_long_secure_random_string>
JWT_EXPIRATION=86400

# Server
PORT=3000
NODE_ENV=production

# Redis
REDIS_HOST=prod-redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=<strong_password>

# CORS
CORS_ORIGIN=https://pulse.example.com

# AI Service
AI_SERVICE_URL=https://ai.pulse.example.com
```

### 3. Deploy Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'pulse-backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Setup Nginx Reverse Proxy

```nginx
upstream pulse_backend {
  server localhost:3000;
}

server {
  listen 443 ssl http2;
  server_name api.pulse.example.com;

  ssl_certificate /etc/ssl/certs/pulse.crt;
  ssl_certificate_key /etc/ssl/private/pulse.key;
  
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  client_max_body_size 10M;

  # WebSocket support
  map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
  }

  location / {
    proxy_pass http://pulse_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name api.pulse.example.com;
  return 301 https://$server_name$request_uri;
}
```

## Frontend Deployment

### 1. Build the Application

```bash
cd frontend

npm ci

# Build for production
npm run build

# Output directory: dist/
```

### 2. Deploy to CDN/Static Host

#### Option A: AWS S3 + CloudFront

```bash
# Upload build to S3
aws s3 sync dist/ s3://pulse-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id E123ABC --paths "/*"
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Vercel

```bash
npm install -g vercel

vercel --prod
```

### 3. Configure Environment

Create production environment file for frontend:

```bash
# frontend/.env.production
VITE_API_URL=https://api.pulse.example.com
VITE_SOCKET_URL=https://api.pulse.example.com
VITE_AI_SERVICE_URL=https://ai.pulse.example.com
```

### 4. Configure Headers

For S3/CloudFront, set security headers:

```json
{
  "headers": [
    {
      "key": "Strict-Transport-Security",
      "value": "max-age=31536000; includeSubDomains"
    },
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "Content-Security-Policy",
      "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    }
  ]
}
```

## AI Service Deployment

### 1. Build Docker Image

```bash
cd ai-service

docker build -t pulse-ai:latest .
```

### 2. Deploy to Container Registry

```bash
# Tag image
docker tag pulse-ai:latest myregistry.azurecr.io/pulse-ai:latest

# Login to registry
az acr login --name myregistry

# Push image
docker push myregistry.azurecr.io/pulse-ai:latest
```

### 3. Deploy to Production

#### Using Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d ai-service
```

#### Using Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pulse-ai
spec:
  replicas: 2
  selector:
    matchLabels:
      app: pulse-ai
  template:
    metadata:
      labels:
        app: pulse-ai
    spec:
      containers:
      - name: pulse-ai
        image: myregistry.azurecr.io/pulse-ai:latest
        ports:
        - containerPort: 8000
        env:
        - name: FLASK_ENV
          value: "production"
        - name: BACKEND_URL
          value: "https://api.pulse.example.com"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: pulse-ai-service
spec:
  selector:
    app: pulse-ai
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

## Docker Deployment

### 1. Build All Images

```bash
# Build images
docker-compose -f infra/docker-compose.yml build

# Tag for registry
docker tag pulse-backend:latest myregistry.azurecr.io/pulse-backend:latest
docker tag pulse-ai:latest myregistry.azurecr.io/pulse-ai:latest
docker tag pulse-frontend:latest myregistry.azurecr.io/pulse-frontend:latest

# Push to registry
docker push myregistry.azurecr.io/pulse-backend:latest
docker push myregistry.azurecr.io/pulse-ai:latest
docker push myregistry.azurecr.io/pulse-frontend:latest
```

### 2. Production Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pulse_production
      POSTGRES_USER: pulse_prod
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  backend:
    image: myregistry.azurecr.io/pulse-backend:latest
    environment:
      - DB_HOST=postgres
      - DB_PASSWORD=${DB_PASSWORD}
      - REDIS_HOST=redis
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    ports:
      - "3000:3000"

  ai-service:
    image: myregistry.azurecr.io/pulse-ai:latest
    environment:
      - FLASK_ENV=production
      - BACKEND_URL=http://backend:3000
    depends_on:
      - backend
    ports:
      - "8000:8000"

volumes:
  postgres_data:
  redis_data:
```

## Environment Configuration

### Production Environment Variables

```bash
# backend/.env.production
NODE_ENV=production
PORT=3000

DB_HOST=prod-db.example.com
DB_PORT=5432
DB_USERNAME=pulse_prod
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=pulse_production

JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=86400

REDIS_HOST=prod-redis.example.com
REDIS_PASSWORD=${REDIS_PASSWORD}

CORS_ORIGIN=https://pulse.example.com
AI_SERVICE_URL=https://ai.pulse.example.com
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: cd backend && npm ci && npm run test
    - run: cd frontend && npm ci && npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build backend
      run: cd backend && npm ci && npm run build
    
    - name: Build frontend
      run: cd frontend && npm ci && npm run build
    
    - name: Deploy to production
      env:
        DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
      run: |
        mkdir -p ~/.ssh
        echo "$DEPLOY_KEY" > ~/.ssh/id_rsa
        chmod 600 ~/.ssh/id_rsa
        ssh -i ~/.ssh/id_rsa deploy@prod-server.com "cd pulse && git pull && npm run deploy"
```

## Monitoring & Logs

### Application Monitoring

```bash
# Using PM2
pm2 monit

# Using Prometheus
docker run -d -p 9090:9090 prom/prometheus

# Using Grafana
docker run -d -p 3001:3000 grafana/grafana
```

### Log Aggregation

```bash
# Using ELK Stack (Elasticsearch, Logstash, Kibana)
docker-compose -f elk-stack.yml up -d

# Backend logs
tail -f /var/log/pulse-backend/error.log
tail -f /var/log/pulse-backend/access.log
```

### Health Checks

```bash
# Backend health
curl https://api.pulse.example.com/health

# Database
psql -h prod-db.example.com -U pulse_prod -d pulse_production -c "SELECT 1"

# Redis
redis-cli -h prod-redis.example.com ping

# AI Service
curl https://ai.pulse.example.com/health
```

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs pulse-backend

# Verify environment
env | grep DB_

# Check database connection
npm run typeorm migration:show
```

### High CPU Usage

```bash
# Check running processes
pm2 monit

# Profile with clinic.js
npm install -g clinic
clinic doctor -- node dist/main.js
```

### Database Performance

```sql
-- Check slow queries
SELECT query, mean_time FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;

-- Analyze table
ANALYZE messages;

-- Create indexes
CREATE INDEX idx_conversations_users ON conversations(userAId, userBId);
```

### Memory Leaks

```bash
# Using heapdump
npm install heapdump

# In code
const heapdump = require('heapdump');

# Generate dumps and compare
node --expose-gc app.js
kill -USR2 <pid>
```
