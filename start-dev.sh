#!/bin/bash

# StudioFlow Development Startup Script
echo "🚀 Starting StudioFlow Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

# Create .env files if they don't exist
echo "📝 Setting up environment files..."

# Backend .env
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << EOF
DEBUG=1
SECRET_KEY=dev_secret_key_change_in_production_$(openssl rand -hex 32)
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,[::1]
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=studioflow
SQL_USER=studioflow_user
SQL_PASSWORD=studioflow_password
SQL_HOST=db
SQL_PORT=5432
REDIS_URL=redis://redis:6379/0
VAPID_PRIVATE_KEY=dev_vapid_private_key_change_in_production
VAPID_PUBLIC_KEY=dev_vapid_public_key_change_in_production
EOF
fi

# Frontend .env.local
if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend/.env.local..."
    cat > frontend/.env.local << EOF
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_VAPID_KEY=dev_vapid_public_key_change_in_production
NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws/
EOF
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check backend
if curl -f http://localhost:5000/api/health/ > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:5000"
else
    echo "⚠️  Backend might still be starting up..."
fi

# Check frontend
if curl -f http://localhost:5102 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:5102"
else
    echo "⚠️  Frontend might still be starting up..."
fi

# Check database
if docker-compose exec -T db pg_isready -U studioflow_user > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "⚠️  Database might still be starting up..."
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "⚠️  Redis might still be starting up..."
fi

echo ""
echo "🎉 StudioFlow Development Environment Started!"
echo ""
echo "📱 Frontend (PWA): http://localhost:5102"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 API Docs: http://localhost:5000/swagger/"
echo "🗄️  Database: localhost:5433"
echo "🔴 Redis: localhost:6379"
echo ""
echo "📋 Useful commands:"
echo "  docker-compose logs -f          # View all logs"
echo "  docker-compose logs -f frontend # View frontend logs"
echo "  docker-compose logs -f backend  # View backend logs"
echo "  docker-compose down             # Stop all services"
echo "  docker-compose exec backend python manage.py shell  # Django shell"
echo ""
echo "🔧 To install PWA dependencies:"
echo "  docker-compose exec frontend bun install"
echo ""