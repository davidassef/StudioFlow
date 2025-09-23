#!/bin/bash

# StudioFlow Development Stop Script
echo "🛑 Stopping StudioFlow Development Environment..."

# Stop all containers
docker-compose down

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "🗑️  Removing volumes..."
# docker-compose down -v

# Optional: Remove images (uncomment if you want to rebuild from scratch)
# echo "🗑️  Removing images..."
# docker-compose down --rmi all

echo "✅ StudioFlow Development Environment Stopped!"
echo ""
echo "💡 To start again, run: ./start-dev.sh"
echo "🔄 To reset all data, run: docker-compose down -v"
echo "🏗️  To rebuild images, run: docker-compose up --build"