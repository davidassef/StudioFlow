# StudioFlow AI Coding Guidelines

## 🏗️ Architecture Overview

**StudioFlow** is a music studio management PWA built as a monorepo with:
- **Backend**: Django 5+ REST API with PostgreSQL, Redis, and Celery
- **Frontend**: Next.js 14 PWA with TypeScript, Zustand state management
- **Infrastructure**: Docker Compose for development, production-ready PWA features

### Key Components
- `backend/`: Django apps (users, studios, bookings) with DRF serializers
- `frontend/src/`: Next.js App Router with Zustand stores and TypeScript interfaces
- `packages/`: Shared code between web/mobile platforms
- PWA features: Service Worker, push notifications, offline-first with IndexedDB

## 🚀 Development Workflow

### Quick Start
```bash
# Start full development environment (Linux/Mac)
./start-dev.sh

# Start full development environment (Windows)
start-dev.bat

# Access app at http://localhost:5102
```

### Environment Setup
- Backend runs on port 5000, frontend on 5102
- Auto-generates `.env` files with dev defaults
- Uses PostgreSQL + Redis containers via Docker Compose

### Testing Commands
```bash
# Backend tests (Django)
cd backend && python manage.py test

# Frontend tests (Jest)
cd frontend && npm test

# PWA validation scripts
cd scripts/pwa && npm run test:all
```

## 📝 Code Patterns & Conventions

### Backend (Django)
- **Models**: Use Portuguese field names (`sala`, `agendamento`, `cliente`)
- **Authentication**: JWT via `djangorestframework-simplejwt`
- **API Structure**: `/api/v1/` prefix with standard REST endpoints
- **Database**: PostgreSQL with Django migrations
- **Example**: `Agendamento` model with `StatusAgendamento` choices enum

### Frontend (Next.js + TypeScript)
- **State Management**: Zustand stores with TypeScript interfaces
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS with custom components
- **API Calls**: Axios with JWT token handling
- **Example Store Pattern**:
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  // Actions
  login: (email: string, password: string) => Promise<void>
}
```

### PWA Features
- **Service Worker**: `next-pwa` for caching and offline support
- **Push Notifications**: Web Push API with VAPID keys
- **Offline Storage**: IndexedDB for local data persistence
- **Manifest**: Web App Manifest for installable PWA

## 🔧 Common Tasks

### Adding New Features
1. **Backend**: Create Django app, add models/serializers/views, update URLs
2. **Frontend**: Add Zustand store, create components, update API calls
3. **Database**: Run `python manage.py makemigrations && python manage.py migrate`

### API Integration
- Use `axios` with interceptors for JWT token refresh
- Handle 401 responses by redirecting to login
- Follow REST conventions: `GET /api/v1/studios/`, `POST /api/v1/bookings/`

### State Management
- Create typed interfaces for all data structures
- Use Zustand's `set` function for immutable updates
- Separate async actions from synchronous state updates

## 📋 Key Files to Reference

- `docker-compose.yml`: Service orchestration and environment variables
- `backend/studios/models.py`: Core business models (Sala, Agendamento)
- `frontend/src/stores/authStore.ts`: Authentication state management pattern
- `frontend/src/lib/api.ts`: API client configuration
- `docs/architecture.md`: Detailed technical specifications

## ⚠️ Important Notes

- **Language**: Backend models use Portuguese field names (don't translate to English)
- **PWA First**: Always consider offline capabilities and push notifications
- **Monorepo**: Use npm workspaces for shared packages
- **Testing**: Maintain 85%+ coverage target with Jest/Pytest
- **Docker**: Development environment requires Docker Compose running

## 🔍 Debugging Tips

- Check Docker containers: `docker-compose ps`
- View backend logs: `docker-compose logs backend`
- Frontend dev server: `cd frontend && npm run dev`
- Database migrations: `cd backend && python manage.py showmigrations`