#!/bin/sh

# Exit on any error
set -e

echo "🚀 Starting StudioFlow Backend..."

# Wait for PostgreSQL using Django's built-in wait_for_db command
echo "⏳ Waiting for PostgreSQL..."
python manage.py wait_for_db

echo "✅ PostgreSQL is ready!"

# Execute the main command
exec "$@"