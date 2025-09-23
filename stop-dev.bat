@echo off
echo 🛑 Stopping StudioFlow Development Environment...

REM Stop all containers
docker-compose down

echo ✅ StudioFlow Development Environment Stopped!
echo.
echo 💡 To start again, run: start-dev.bat
echo 🔄 To reset all data, run: docker-compose down -v
echo 🏗️  To rebuild images, run: docker-compose up --build
pause