@echo off
echo 🚀 Starting StudioFlow Development Environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Create .env files if they don't exist
echo 📝 Setting up environment files...

REM Backend .env
if not exist backend\.env (
    echo Creating backend/.env...
    (
        echo DEBUG=1
        echo SECRET_KEY=dev_secret_key_change_in_production
        echo DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,[::1]
        echo SQL_ENGINE=django.db.backends.postgresql
        echo SQL_DATABASE=studioflow
        echo SQL_USER=studioflow_user
        echo SQL_PASSWORD=studioflow_password
        echo SQL_HOST=db
        echo SQL_PORT=5432
        echo REDIS_URL=redis://redis:6379/0
        echo VAPID_PRIVATE_KEY=dev_vapid_private_key_change_in_production
        echo VAPID_PUBLIC_KEY=dev_vapid_public_key_change_in_production
    ) > backend\.env
)

REM Frontend .env.local
if not exist frontend\.env.local (
    echo Creating frontend/.env.local...
    (
        echo NODE_ENV=development
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
        echo NEXT_PUBLIC_VAPID_KEY=dev_vapid_public_key_change_in_production
        echo NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws/
    ) > frontend\.env.local
)

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Build and start services
echo 🏗️  Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 StudioFlow Development Environment Started!
echo.
echo 📱 Frontend (PWA): http://localhost:5102
echo 🔧 Backend API: http://localhost:5000
echo 📊 API Docs: http://localhost:5000/swagger/
echo 🗄️  Database: localhost:5433
echo 🔴 Redis: localhost:6379
echo.
echo 📋 Useful commands:
echo   docker-compose logs -f          # View all logs
echo   docker-compose logs -f frontend # View frontend logs
echo   docker-compose logs -f backend  # View backend logs
echo   docker-compose down             # Stop all services
echo.
echo 🔧 To install PWA dependencies:
echo   docker-compose exec frontend npm install
echo.
pause