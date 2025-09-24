# 🧪 Guia de Testes - StudioFlow

**Versão:** 1.0  
**Última Atualização:** 24 de Julho de 2025  
**Tempo de Leitura:** 12 minutos

---

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🏗️ Estrutura de Testes](#️-estrutura-de-testes)
- [🐍 Testes Backend (Django)](#-testes-backend-django)
- [⚛️ Testes Frontend (React/Next.js)](#️-testes-frontend-reactnextjs)
- [🔗 Testes de Integração](#-testes-de-integração)
- [🎭 Testes E2E (End-to-End)](#-testes-e2e-end-to-end)
- [📊 Cobertura de Código](#-cobertura-de-código)
- [🚀 Testes de Performance](#-testes-de-performance)
- [🔒 Testes de Segurança](#-testes-de-segurança)
- [🤖 Automação e CI/CD](#-automação-e-cicd)

---

## 🎯 Visão Geral

O StudioFlow implementa uma estratégia abrangente de testes que garante qualidade, confiabilidade e manutenibilidade do código.

### 🏆 Pirâmide de Testes

```mermaid
graph TD
    subgraph "Pirâmide de Testes"
        E2E["🎭 E2E Tests<br/>Poucos, Lentos, Caros"]
        INT["🔗 Integration Tests<br/>Alguns, Médios"]
        UNIT["⚡ Unit Tests<br/>Muitos, Rápidos, Baratos"]
    end
    
    E2E --> INT
    INT --> UNIT
    
    style E2E fill:#ff6b6b
    style INT fill:#ffd93d
    style UNIT fill:#6bcf7f
```

### 📊 Métricas de Qualidade

| Tipo de Teste | Cobertura Alvo | Tempo Execução | Frequência |
|---------------|----------------|----------------|------------|
| **Unit Tests** | 90%+ | < 30s | A cada commit |
| **Integration** | 80%+ | < 2min | A cada PR |
| **E2E** | 70%+ | < 10min | Deploy |
| **Performance** | N/A | < 5min | Semanal |
| **Security** | N/A | < 3min | A cada release |

### 🛠️ Stack de Testes

| Camada | Tecnologia | Propósito |
|--------|------------|----------|
| **Backend** | pytest, Django TestCase | Testes unitários e integração |
| **Frontend** | Jest, React Testing Library | Testes de componentes |
| **E2E** | Playwright, Cypress | Testes de fluxo completo |
| **API** | pytest-django, requests | Testes de endpoints |
| **Performance** | Locust, Artillery | Testes de carga |
| **Security** | Bandit, Safety | Análise de vulnerabilidades |

---

## 🏗️ Estrutura de Testes

### 📁 Organização de Arquivos

```
studioflow/
├── backend/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py              # Configurações pytest
│   │   ├── factories.py             # Factory Boy factories
│   │   ├── test_models.py           # Testes de modelos
│   │   ├── test_views.py            # Testes de views/APIs
│   │   ├── test_utils.py            # Testes de utilitários
│   │   └── integration/
│   │       ├── test_auth_flow.py    # Fluxos de autenticação
│   │       ├── test_booking_flow.py # Fluxos de agendamento
│   │       └── test_payment_flow.py # Fluxos de pagamento
│   └── apps/
│       └── bookings/
│           └── tests/
│               ├── test_models.py
│               ├── test_views.py
│               └── test_serializers.py
├── frontend/
│   ├── __tests__/
│   │   ├── components/              # Testes de componentes
│   │   ├── pages/                   # Testes de páginas
│   │   ├── hooks/                   # Testes de hooks
│   │   ├── utils/                   # Testes de utilitários
│   │   └── integration/             # Testes de integração
│   ├── e2e/
│   │   ├── auth.spec.ts             # Testes E2E de auth
│   │   ├── booking.spec.ts          # Testes E2E de booking
│   │   └── dashboard.spec.ts        # Testes E2E de dashboard
│   └── src/
│       └── components/
│           └── Button/
│               ├── Button.tsx
│               └── Button.test.tsx  # Teste co-localizado
└── tests/
    ├── performance/
    │   ├── locustfile.py            # Testes de carga
    │   └── artillery.yml            # Configuração Artillery
    └── security/
        ├── test_auth.py             # Testes de segurança
        └── test_permissions.py     # Testes de permissões
```

### ⚙️ Configuração Base

#### Backend - `conftest.py`
```python
import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from factories import UserFactory, StudioFactory, BookingFactory

User = get_user_model()

@pytest.fixture
def api_client():
    """Cliente API para testes."""
    return APIClient()

@pytest.fixture
def user():
    """Usuário padrão para testes."""
    return UserFactory()

@pytest.fixture
def authenticated_client(api_client, user):
    """Cliente autenticado."""
    api_client.force_authenticate(user=user)
    return api_client

@pytest.fixture
def studio(user):
    """Estúdio padrão para testes."""
    return StudioFactory(owner=user)

@pytest.fixture
def booking(user, studio):
    """Agendamento padrão para testes."""
    return BookingFactory(user=user, studio=studio)

@pytest.fixture(scope='session')
def django_db_setup():
    """Configuração do banco de testes."""
    from django.conf import settings
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
```

#### Frontend - `jest.config.js`
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1'
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}

module.exports = createJestConfig(customJestConfig)
```

---

## 🐍 Testes Backend (Django)

### ⚡ Testes Unitários

#### Testes de Modelos
```python
# backend/tests/test_models.py
import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from apps.bookings.models import Booking, Studio
from factories import UserFactory, StudioFactory, BookingFactory

@pytest.mark.django_db
class TestStudioModel:
    """Testes para o modelo Studio."""
    
    def test_create_studio_success(self):
        """Teste criação de estúdio com sucesso."""
        user = UserFactory()
        studio = StudioFactory(owner=user)
        
        assert studio.name
        assert studio.owner == user
        assert studio.is_active is True
        assert str(studio) == studio.name
    
    def test_studio_slug_generation(self):
        """Teste geração automática de slug."""
        studio = StudioFactory(name="Estúdio de Teste")
        assert studio.slug == "estudio-de-teste"
    
    def test_studio_unique_slug(self):
        """Teste unicidade do slug."""
        StudioFactory(name="Teste")
        studio2 = StudioFactory(name="Teste")
        
        assert studio2.slug != "teste"
        assert "teste-" in studio2.slug

@pytest.mark.django_db
class TestBookingModel:
    """Testes para o modelo Booking."""
    
    def test_create_booking_success(self):
        """Teste criação de agendamento com sucesso."""
        booking = BookingFactory()
        
        assert booking.user
        assert booking.studio
        assert booking.start_time
        assert booking.end_time
        assert booking.status == 'pending'
    
    def test_booking_duration_calculation(self):
        """Teste cálculo de duração do agendamento."""
        start = timezone.now()
        end = start + timedelta(hours=2)
        
        booking = BookingFactory(
            start_time=start,
            end_time=end
        )
        
        assert booking.duration == timedelta(hours=2)
    
    def test_booking_overlap_validation(self):
        """Teste validação de sobreposição de agendamentos."""
        studio = StudioFactory()
        start = timezone.now()
        end = start + timedelta(hours=2)
        
        # Primeiro agendamento
        BookingFactory(
            studio=studio,
            start_time=start,
            end_time=end
        )
        
        # Segundo agendamento sobreposto
        with pytest.raises(ValidationError):
            BookingFactory(
                studio=studio,
                start_time=start + timedelta(minutes=30),
                end_time=end + timedelta(minutes=30)
            )
    
    def test_booking_past_date_validation(self):
        """Teste validação de data no passado."""
        past_date = timezone.now() - timedelta(days=1)
        
        with pytest.raises(ValidationError):
            BookingFactory(
                start_time=past_date,
                end_time=past_date + timedelta(hours=1)
            )
```

#### Testes de Views/APIs
```python
# backend/tests/test_views.py
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from factories import UserFactory, StudioFactory, BookingFactory

@pytest.mark.django_db
class TestStudioAPI:
    """Testes para API de estúdios."""
    
    def test_list_studios_unauthenticated(self, api_client):
        """Teste listagem de estúdios sem autenticação."""
        StudioFactory.create_batch(3)
        
        url = reverse('studio-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 3
    
    def test_create_studio_authenticated(self, authenticated_client):
        """Teste criação de estúdio autenticado."""
        data = {
            'name': 'Novo Estúdio',
            'description': 'Descrição do estúdio',
            'address': 'Rua Teste, 123'
        }
        
        url = reverse('studio-list')
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == data['name']
    
    def test_create_studio_unauthenticated(self, api_client):
        """Teste criação de estúdio sem autenticação."""
        data = {'name': 'Estúdio Teste'}
        
        url = reverse('studio-list')
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_update_studio_owner(self, authenticated_client, user):
        """Teste atualização de estúdio pelo proprietário."""
        studio = StudioFactory(owner=user)
        data = {'name': 'Nome Atualizado'}
        
        url = reverse('studio-detail', kwargs={'pk': studio.pk})
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == data['name']
    
    def test_update_studio_non_owner(self, authenticated_client):
        """Teste atualização de estúdio por não proprietário."""
        studio = StudioFactory()  # Outro usuário
        data = {'name': 'Nome Atualizado'}
        
        url = reverse('studio-detail', kwargs={'pk': studio.pk})
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
class TestBookingAPI:
    """Testes para API de agendamentos."""
    
    def test_create_booking_success(self, authenticated_client, user):
        """Teste criação de agendamento com sucesso."""
        studio = StudioFactory()
        data = {
            'studio': studio.id,
            'start_time': '2025-12-01T10:00:00Z',
            'end_time': '2025-12-01T12:00:00Z',
            'notes': 'Sessão de fotos'
        }
        
        url = reverse('booking-list')
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == user.id
        assert response.data['studio'] == studio.id
    
    def test_list_user_bookings(self, authenticated_client, user):
        """Teste listagem de agendamentos do usuário."""
        # Agendamentos do usuário
        BookingFactory.create_batch(2, user=user)
        # Agendamentos de outros usuários
        BookingFactory.create_batch(3)
        
        url = reverse('booking-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2
    
    def test_cancel_booking_owner(self, authenticated_client, user):
        """Teste cancelamento de agendamento pelo proprietário."""
        booking = BookingFactory(user=user)
        
        url = reverse('booking-cancel', kwargs={'pk': booking.pk})
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        booking.refresh_from_db()
        assert booking.status == 'cancelled'
```

### 🔗 Testes de Integração

```python
# backend/tests/integration/test_booking_flow.py
import pytest
from django.utils import timezone
from datetime import timedelta
from django.urls import reverse
from rest_framework import status
from factories import UserFactory, StudioFactory

@pytest.mark.django_db
class TestBookingFlow:
    """Testes de fluxo completo de agendamento."""
    
    def test_complete_booking_flow(self, api_client):
        """Teste fluxo completo: registro → login → agendamento → pagamento."""
        # 1. Registro de usuário
        register_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123'
        }
        
        register_url = reverse('auth-register')
        response = api_client.post(register_url, register_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        # 2. Login
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        
        login_url = reverse('auth-login')
        response = api_client.post(login_url, login_data)
        assert response.status_code == status.HTTP_200_OK
        
        token = response.data['access']
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # 3. Listar estúdios disponíveis
        studio = StudioFactory()
        studios_url = reverse('studio-list')
        response = api_client.get(studios_url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        
        # 4. Verificar disponibilidade
        start_time = timezone.now() + timedelta(days=1)
        end_time = start_time + timedelta(hours=2)
        
        availability_url = reverse('studio-availability', kwargs={'pk': studio.pk})
        params = {
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat()
        }
        response = api_client.get(availability_url, params)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['available'] is True
        
        # 5. Criar agendamento
        booking_data = {
            'studio': studio.id,
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat(),
            'notes': 'Sessão de fotos de produto'
        }
        
        booking_url = reverse('booking-list')
        response = api_client.post(booking_url, booking_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        booking_id = response.data['id']
        
        # 6. Confirmar agendamento
        confirm_url = reverse('booking-confirm', kwargs={'pk': booking_id})
        response = api_client.post(confirm_url)
        assert response.status_code == status.HTTP_200_OK
        
        # 7. Verificar status final
        detail_url = reverse('booking-detail', kwargs={'pk': booking_id})
        response = api_client.get(detail_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'confirmed'
```

---

## ⚛️ Testes Frontend (React/Next.js)

### 🧩 Testes de Componentes

```typescript
// frontend/src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-primary')
  })
  
  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
  
  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })
})
```

### 📄 Testes de Páginas

```typescript
// frontend/__tests__/pages/login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'
import LoginPage from '@/pages/login'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

// Mock da API
jest.mock('@/services/api', () => ({
  auth: {
    login: jest.fn()
  }
}))

const mockPush = jest.fn()
;(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
  query: {},
  pathname: '/login'
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('renders login form', () => {
    renderWithProviders(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })
  
  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
    })
  })
  
  it('submits form with valid data', async () => {
    const { auth } = require('@/services/api')
    auth.login.mockResolvedValue({
      access: 'fake-token',
      user: { id: 1, email: 'test@example.com' }
    })
    
    renderWithProviders(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(auth.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })
  
  it('shows error message on login failure', async () => {
    const { auth } = require('@/services/api')
    auth.login.mockRejectedValue(new Error('Credenciais inválidas'))
    
    renderWithProviders(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
    })
  })
})
```

### 🪝 Testes de Hooks

```typescript
// frontend/__tests__/hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { AuthProvider } from '@/contexts/AuthContext'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('useAuth Hook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })
  
  it('logs in user successfully', async () => {
    const { auth } = require('@/services/api')
    auth.login.mockResolvedValue({
      access: 'fake-token',
      user: { id: 1, email: 'test@example.com' }
    })
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    })
    
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      })
    })
    
    expect(result.current.user).toEqual({
      id: 1,
      email: 'test@example.com'
    })
    expect(result.current.isAuthenticated).toBe(true)
  })
  
  it('logs out user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper()
    })
    
    // Primeiro fazer login
    await act(async () => {
      result.current.setUser({ id: 1, email: 'test@example.com' })
    })
    
    // Depois fazer logout
    await act(async () => {
      result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
```

---

## 🔗 Testes de Integração

### 🌐 Testes de API

```python
# tests/integration/test_api_integration.py
import pytest
import requests
from django.test import LiveServerTestCase
from django.contrib.auth import get_user_model
from factories import UserFactory, StudioFactory

User = get_user_model()

class TestAPIIntegration(LiveServerTestCase):
    """Testes de integração da API."""
    
    def setUp(self):
        self.base_url = self.live_server_url
        self.user = UserFactory()
        self.studio = StudioFactory(owner=self.user)
    
    def get_auth_headers(self):
        """Obter headers de autenticação."""
        login_data = {
            'username': self.user.username,
            'password': 'testpass123'
        }
        
        response = requests.post(
            f'{self.base_url}/api/auth/login/',
            json=login_data
        )
        
        token = response.json()['access']
        return {'Authorization': f'Bearer {token}'}
    
    def test_full_booking_api_flow(self):
        """Teste fluxo completo da API de agendamentos."""
        headers = self.get_auth_headers()
        
        # 1. Listar estúdios
        response = requests.get(
            f'{self.base_url}/api/studios/',
            headers=headers
        )
        assert response.status_code == 200
        studios = response.json()['results']
        assert len(studios) == 1
        
        # 2. Verificar disponibilidade
        studio_id = studios[0]['id']
        response = requests.get(
            f'{self.base_url}/api/studios/{studio_id}/availability/',
            params={
                'start_time': '2025-12-01T10:00:00Z',
                'end_time': '2025-12-01T12:00:00Z'
            },
            headers=headers
        )
        assert response.status_code == 200
        assert response.json()['available'] is True
        
        # 3. Criar agendamento
        booking_data = {
            'studio': studio_id,
            'start_time': '2025-12-01T10:00:00Z',
            'end_time': '2025-12-01T12:00:00Z',
            'notes': 'Teste de integração'
        }
        
        response = requests.post(
            f'{self.base_url}/api/bookings/',
            json=booking_data,
            headers=headers
        )
        assert response.status_code == 201
        booking = response.json()
        
        # 4. Verificar agendamento criado
        response = requests.get(
            f'{self.base_url}/api/bookings/{booking["id"]}/',
            headers=headers
        )
        assert response.status_code == 200
        assert response.json()['status'] == 'pending'
        
        # 5. Confirmar agendamento
        response = requests.post(
            f'{self.base_url}/api/bookings/{booking["id"]}/confirm/',
            headers=headers
        )
        assert response.status_code == 200
        
        # 6. Verificar status atualizado
        response = requests.get(
            f'{self.base_url}/api/bookings/{booking["id"]}/',
            headers=headers
        )
        assert response.status_code == 200
        assert response.json()['status'] == 'confirmed'
```

---

## 🎭 Testes E2E (End-to-End)

### 🎪 Playwright

```typescript
// frontend/e2e/booking.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: criar usuário e estúdio via API
    await page.request.post('/api/test/setup', {
      data: {
        user: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpass123'
        },
        studio: {
          name: 'Estúdio Teste',
          description: 'Estúdio para testes E2E'
        }
      }
    })
  })
  
  test('complete booking flow', async ({ page }) => {
    // 1. Ir para página de login
    await page.goto('/login')
    
    // 2. Fazer login
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'testpass123')
    await page.click('[data-testid="login-button"]')
    
    // 3. Verificar redirecionamento para dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // 4. Navegar para página de agendamento
    await page.click('[data-testid="new-booking-button"]')
    await expect(page).toHaveURL('/booking/new')
    
    // 5. Selecionar estúdio
    await page.click('[data-testid="studio-select"]')
    await page.click('[data-testid="studio-option-1"]')
    
    // 6. Selecionar data e hora
    await page.click('[data-testid="date-picker"]')
    await page.click('[data-testid="date-tomorrow"]')
    
    await page.click('[data-testid="time-start"]')
    await page.selectOption('[data-testid="time-start"]', '10:00')
    
    await page.click('[data-testid="time-end"]')
    await page.selectOption('[data-testid="time-end"]', '12:00')
    
    // 7. Adicionar observações
    await page.fill(
      '[data-testid="notes-textarea"]',
      'Sessão de fotos para produto'
    )
    
    // 8. Confirmar agendamento
    await page.click('[data-testid="confirm-booking-button"]')
    
    // 9. Verificar confirmação
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Agendamento criado com sucesso')
    
    // 10. Verificar na lista de agendamentos
    await page.goto('/bookings')
    await expect(page.locator('[data-testid="booking-item"]')).toBeVisible()
    await expect(page.locator('[data-testid="booking-status"]'))
      .toContainText('Pendente')
  })
  
  test('booking validation errors', async ({ page }) => {
    await page.goto('/login')
    
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'testpass123')
    await page.click('[data-testid="login-button"]')
    
    // Ir para nova reserva
    await page.goto('/booking/new')
    
    // Tentar confirmar sem preencher campos
    await page.click('[data-testid="confirm-booking-button"]')
    
    // Verificar mensagens de erro
    await expect(page.locator('[data-testid="studio-error"]'))
      .toContainText('Selecione um estúdio')
    await expect(page.locator('[data-testid="date-error"]'))
      .toContainText('Selecione uma data')
    await expect(page.locator('[data-testid="time-error"]'))
      .toContainText('Selecione um horário')
  })
  
  test('booking conflict detection', async ({ page }) => {
    // Criar agendamento existente via API
    await page.request.post('/api/bookings/', {
      data: {
        studio: 1,
        start_time: '2025-12-01T10:00:00Z',
        end_time: '2025-12-01T12:00:00Z'
      },
      headers: {
        'Authorization': 'Bearer fake-token'
      }
    })
    
    await page.goto('/login')
    
    // Login e navegação
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'testpass123')
    await page.click('[data-testid="login-button"]')
    await page.goto('/booking/new')
    
    // Tentar agendar no mesmo horário
    await page.click('[data-testid="studio-select"]')
    await page.click('[data-testid="studio-option-1"]')
    
    await page.click('[data-testid="date-picker"]')
    await page.click('[data-testid="date-2025-12-01"]')
    
    await page.selectOption('[data-testid="time-start"]', '10:00')
    await page.selectOption('[data-testid="time-end"]', '12:00')
    
    await page.click('[data-testid="confirm-booking-button"]')
    
    // Verificar mensagem de conflito
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Horário não disponível')
  })
})
```

### 🌊 Cypress

```typescript
// frontend/cypress/e2e/auth.cy.ts
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.task('db:seed')
  })
  
  it('should register new user', () => {
    cy.visit('/register')
    
    cy.get('[data-cy="username-input"]').type('newuser')
    cy.get('[data-cy="email-input"]').type('newuser@example.com')
    cy.get('[data-cy="password-input"]').type('password123')
    cy.get('[data-cy="password-confirm-input"]').type('password123')
    
    cy.get('[data-cy="register-button"]').click()
    
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy="welcome-message"]')
      .should('contain', 'Bem-vindo, newuser!')
  })
  
  it('should login existing user', () => {
    cy.visit('/login')
    
    cy.get('[data-cy="email-input"]').type('test@example.com')
    cy.get('[data-cy="password-input"]').type('testpass123')
    
    cy.get('[data-cy="login-button"]').click()
    
    cy.url().should('include', '/dashboard')
    cy.get('[data-cy="user-menu"]').should('be.visible')
  })
  
  it('should logout user', () => {
    cy.login('test@example.com', 'testpass123')
    cy.visit('/dashboard')
    
    cy.get('[data-cy="user-menu"]').click()
    cy.get('[data-cy="logout-button"]').click()
    
    cy.url().should('include', '/login')
    cy.get('[data-cy="login-form"]').should('be.visible')
  })
  
  it('should show validation errors', () => {
    cy.visit('/login')
    
    cy.get('[data-cy="login-button"]').click()
    
    cy.get('[data-cy="email-error"]')
      .should('contain', 'Email é obrigatório')
    cy.get('[data-cy="password-error"]')
      .should('contain', 'Senha é obrigatória')
  })
  
  it('should handle invalid credentials', () => {
    cy.visit('/login')
    
    cy.get('[data-cy="email-input"]').type('wrong@example.com')
    cy.get('[data-cy="password-input"]').type('wrongpassword')
    
    cy.get('[data-cy="login-button"]').click()
    
    cy.get('[data-cy="error-message"]')
      .should('contain', 'Credenciais inválidas')
  })
})
```

---

## 📊 Cobertura de Código

### 🐍 Backend (Coverage.py)

```bash
# Executar testes com cobertura
cd backend
coverage run --source='.' manage.py test
coverage report
coverage html

# Configuração em .coveragerc
[run]
source = .
omit = 
    */venv/*
    */migrations/*
    */settings/*
    manage.py
    */tests/*
    */test_*.py

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
    if __name__ == .__main__.:

[html]
directory = htmlcov
```

### ⚛️ Frontend (Jest)

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/pages/_app.tsx",
      "!src/pages/_document.tsx"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### 📈 Relatórios de Cobertura

```bash
# Script para gerar relatório completo
#!/bin/bash
# scripts/coverage-report.sh

echo "📊 Gerando relatório de cobertura..."

# Backend
echo "🐍 Backend Coverage:"
cd backend
coverage run --source='.' manage.py test
coverage report --format=markdown > ../coverage-backend.md
coverage html --directory=../coverage-backend-html
cd ..

# Frontend
echo "⚛️ Frontend Coverage:"
cd frontend
npm run test:coverage
cp coverage/lcov-report/* ../coverage-frontend-html/
cd ..

# Combinar relatórios
echo "📋 Relatório combinado gerado em coverage-report.html"
```

---

## 🚀 Testes de Performance

### 🦗 Locust

```python
# tests/performance/locustfile.py
from locust import HttpUser, task, between
import random

class StudioFlowUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        """Setup inicial - fazer login."""
        response = self.client.post("/api/auth/login/", json={
            "username": "testuser",
            "password": "testpass123"
        })
        
        if response.status_code == 200:
            token = response.json()["access"]
            self.client.headers.update({
                "Authorization": f"Bearer {token}"
            })
    
    @task(3)
    def view_studios(self):
        """Visualizar lista de estúdios."""
        self.client.get("/api/studios/")
    
    @task(2)
    def view_studio_detail(self):
        """Visualizar detalhes de um estúdio."""
        studio_id = random.randint(1, 10)
        self.client.get(f"/api/studios/{studio_id}/")
    
    @task(2)
    def check_availability(self):
        """Verificar disponibilidade."""
        studio_id = random.randint(1, 10)
        self.client.get(
            f"/api/studios/{studio_id}/availability/",
            params={
                "start_time": "2025-12-01T10:00:00Z",
                "end_time": "2025-12-01T12:00:00Z"
            }
        )
    
    @task(1)
    def create_booking(self):
        """Criar agendamento."""
        studio_id = random.randint(1, 10)
        hour = random.randint(9, 17)
        
        self.client.post("/api/bookings/", json={
            "studio": studio_id,
            "start_time": f"2025-12-01T{hour:02d}:00:00Z",
            "end_time": f"2025-12-01T{hour+2:02d}:00:00Z",
            "notes": "Teste de performance"
        })
    
    @task(1)
    def view_bookings(self):
        """Visualizar agendamentos do usuário."""
        self.client.get("/api/bookings/")

class AdminUser(HttpUser):
    wait_time = between(2, 5)
    weight = 1  # Menos usuários admin
    
    def on_start(self):
        response = self.client.post("/api/auth/login/", json={
            "username": "admin",
            "password": "adminpass123"
        })
        
        if response.status_code == 200:
            token = response.json()["access"]
            self.client.headers.update({
                "Authorization": f"Bearer {token}"
            })
    
    @task
    def view_dashboard(self):
        """Visualizar dashboard admin."""
        self.client.get("/api/admin/dashboard/")
    
    @task
    def view_analytics(self):
        """Visualizar analytics."""
        self.client.get("/api/admin/analytics/")
```

### ⚡ Artillery

```yaml
# tests/performance/artillery.yml
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 20
      name: "Sustained load"
  payload:
    path: "./users.csv"
    fields:
      - "username"
      - "password"

scenarios:
  - name: "User Journey"
    weight: 80
    flow:
      - post:
          url: "/api/auth/login/"
          json:
            username: "{{ username }}"
            password: "{{ password }}"
          capture:
            - json: "$.access"
              as: "token"
      
      - get:
          url: "/api/studios/"
          headers:
            Authorization: "Bearer {{ token }}"
      
      - get:
          url: "/api/studios/{{ $randomInt(1, 10) }}/"
          headers:
            Authorization: "Bearer {{ token }}"
      
      - post:
          url: "/api/bookings/"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            studio: "{{ $randomInt(1, 10) }}"
            start_time: "2025-12-01T{{ $randomInt(9, 17) }}:00:00Z"
            end_time: "2025-12-01T{{ $randomInt(11, 19) }}:00:00Z"
            notes: "Performance test booking"
  
  - name: "Browse Only"
    weight: 20
    flow:
      - get:
          url: "/api/studios/"
      
      - get:
          url: "/api/studios/{{ $randomInt(1, 10) }}/"
```

---

## 🔒 Testes de Segurança

### 🛡️ Bandit (Python)

```bash
# Instalar e executar
pip install bandit
bandit -r backend/ -f json -o security-report.json

# Configuração em .bandit
[bandit]
exclude_dirs = ["/tests", "/migrations"]
skips = ["B101", "B601"]
```

### 🔍 Safety (Dependências)

```bash
# Verificar vulnerabilidades em dependências
pip install safety
safety check --json --output safety-report.json

# Integrar no CI
safety check --short-report
```

### 🧪 Testes de Autenticação

```python
# tests/security/test_auth_security.py
import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class TestAuthSecurity(TestCase):
    """Testes de segurança de autenticação."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='strongpassword123'
        )
    
    def test_password_strength_validation(self):
        """Teste validação de força da senha."""
        weak_passwords = [
            '123',
            'password',
            '12345678',
            'qwerty',
            'abc123'
        ]
        
        for weak_password in weak_passwords:
            response = self.client.post('/api/auth/register/', {
                'username': 'newuser',
                'email': 'new@example.com',
                'password': weak_password,
                'password_confirm': weak_password
            })
            
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('password', response.data)
    
    def test_rate_limiting(self):
        """Teste rate limiting em login."""
        login_data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        
        # Tentar login 6 vezes com senha errada
        for i in range(6):
            response = self.client.post('/api/auth/login/', login_data)
            
            if i < 5:
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            else:
                # 6ª tentativa deve ser bloqueada
                self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
    
    def test_jwt_token_expiration(self):
        """Teste expiração de token JWT."""
        # Login válido
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'strongpassword123'
        })
        
        token = response.data['access']
        
        # Usar token válido
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/user/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Simular token expirado (mockear tempo)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = timezone.now() + timedelta(hours=25)
            
            response = self.client.get('/api/user/profile/')
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_sql_injection_protection(self):
        """Teste proteção contra SQL injection."""
        malicious_inputs = [
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "admin'--",
            "' UNION SELECT * FROM users--"
        ]
        
        for malicious_input in malicious_inputs:
            response = self.client.post('/api/auth/login/', {
                'username': malicious_input,
                'password': 'anypassword'
            })
            
            # Deve retornar erro de autenticação, não erro de SQL
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_xss_protection(self):
        """Teste proteção contra XSS."""
        xss_payloads = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src=x onerror=alert('xss')>",
            "<svg onload=alert('xss')>"
        ]
        
        for payload in xss_payloads:
            response = self.client.post('/api/studios/', {
                'name': payload,
                'description': 'Test studio'
            })
            
            if response.status_code == 201:
                # Se criado, verificar se foi sanitizado
                studio_name = response.data['name']
                self.assertNotIn('<script>', studio_name)
                self.assertNotIn('javascript:', studio_name)
```

---

## 🤖 Automação e CI/CD

### 🐙 GitHub Actions

```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_studioflow
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Cache pip dependencies
      uses: actions/cache@v3
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ hashFiles('backend/requirements.txt') }}
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
        pip install coverage pytest-cov
    
    - name: Run tests with coverage
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_studioflow
        REDIS_URL: redis://localhost:6379/0
      run: |
        cd backend
        coverage run --source='.' manage.py test
        coverage xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: backend/coverage.xml
        flags: backend
    
    - name: Security scan
      run: |
        cd backend
        bandit -r . -f json -o bandit-report.json
        safety check

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run linting
      run: |
        cd frontend
        npm run lint
    
    - name: Run type checking
      run: |
        cd frontend
        npm run type-check
    
    - name: Run tests
      run: |
        cd frontend
        npm run test:ci
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: frontend/coverage/lcov.info
        flags: frontend

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Start services
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 30
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Playwright
      run: |
        cd frontend
        npm ci
        npx playwright install
    
    - name: Run E2E tests
      run: |
        cd frontend
        npm run test:e2e
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: frontend/playwright-report/
    
    - name: Stop services
      if: always()
      run: docker-compose -f docker-compose.test.yml down

  performance-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install Locust
      run: pip install locust
    
    - name: Start services
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 60
    
    - name: Run performance tests
      run: |
        cd tests/performance
        locust --headless --users 50 --spawn-rate 5 --run-time 5m --host http://localhost:8000
    
    - name: Stop services
      if: always()
      run: docker-compose -f docker-compose.test.yml down
```

### 🦊 GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - security
  - e2e
  - performance
  - deploy

variables:
  POSTGRES_DB: test_studioflow
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_HOST_AUTH_METHOD: trust

backend-tests:
  stage: test
  image: python:3.11
  
  services:
    - postgres:15
    - redis:7
  
  variables:
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/test_studioflow
    REDIS_URL: redis://redis:6379/0
  
  before_script:
    - cd backend
    - pip install -r requirements.txt
    - pip install coverage pytest-cov
  
  script:
    - coverage run --source='.' manage.py test
    - coverage report
    - coverage xml
  
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: backend/coverage.xml
    paths:
      - backend/htmlcov/
    expire_in: 1 week
  
  coverage: '/TOTAL.+ ([0-9]{1,3}%)$/'

frontend-tests:
  stage: test
  image: node:18
  
  before_script:
    - cd frontend
    - npm ci
  
  script:
    - npm run lint
    - npm run type-check
    - npm run test:ci
  
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: frontend/coverage/cobertura-coverage.xml
    paths:
      - frontend/coverage/
    expire_in: 1 week

security-scan:
  stage: security
  image: python:3.11
  
  before_script:
    - pip install bandit safety
  
  script:
    - bandit -r backend/ -f json -o bandit-report.json
    - safety check --json --output safety-report.json
  
  artifacts:
    paths:
      - bandit-report.json
      - safety-report.json
    expire_in: 1 week
  
  allow_failure: true

e2e-tests:
  stage: e2e
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  
  services:
    - docker:dind
  
  before_script:
    - docker-compose -f docker-compose.test.yml up -d
    - sleep 30
    - cd frontend
    - npm ci
  
  script:
    - npm run test:e2e
  
  after_script:
    - docker-compose -f docker-compose.test.yml down
  
  artifacts:
    when: always
    paths:
      - frontend/playwright-report/
      - frontend/test-results/
    expire_in: 1 week

performance-tests:
  stage: performance
  image: python:3.11
  
  services:
    - docker:dind
  
  before_script:
    - pip install locust
    - docker-compose -f docker-compose.test.yml up -d
    - sleep 60
  
  script:
    - cd tests/performance
    - locust --headless --users 50 --spawn-rate 5 --run-time 5m --host http://localhost:8000
  
  after_script:
    - docker-compose -f docker-compose.test.yml down
  
  only:
    - main
    - develop
```

---

## 📋 Comandos Úteis

### 🐍 Backend

```bash
# Executar todos os testes
cd backend
python manage.py test

# Executar testes específicos
python manage.py test apps.bookings.tests.test_models
python manage.py test apps.bookings.tests.test_models.TestBookingModel.test_create_booking_success

# Executar com pytest
pytest
pytest apps/bookings/tests/
pytest -v --tb=short
pytest -k "test_booking"

# Cobertura de código
coverage run --source='.' manage.py test
coverage report
coverage html
coverage xml

# Testes de performance
locust --host=http://localhost:8000
locust --headless --users 10 --spawn-rate 2 --run-time 1m

# Segurança
bandit -r . -f json
safety check
```

### ⚛️ Frontend

```bash
# Executar todos os testes
cd frontend
npm test

# Modo watch
npm run test:watch

# Cobertura
npm run test:coverage

# Testes específicos
npm test -- Button.test.tsx
npm test -- --testNamePattern="should render"

# E2E com Playwright
npx playwright test
npx playwright test --headed
npx playwright test --debug
npx playwright test auth.spec.ts

# E2E com Cypress
npx cypress open
npx cypress run
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Linting e formatação
npm run lint
npm run lint:fix
npm run format
```

### 🐳 Docker

```bash
# Executar testes em containers
docker-compose -f docker-compose.test.yml up --build
docker-compose -f docker-compose.test.yml run backend python manage.py test
docker-compose -f docker-compose.test.yml run frontend npm test

# Limpar após testes
docker-compose -f docker-compose.test.yml down -v
docker system prune -f
```

---

## 🎯 Melhores Práticas

### ✅ Do's (Faça)

- **Escreva testes antes do código** (TDD quando possível)
- **Mantenha testes simples e focados** (um conceito por teste)
- **Use nomes descritivos** para testes e funções
- **Organize testes em grupos lógicos** (classes/describes)
- **Mock dependências externas** (APIs, banco de dados)
- **Teste casos de borda** e cenários de erro
- **Mantenha alta cobertura** (>80% para código crítico)
- **Execute testes frequentemente** (a cada commit)
- **Documente testes complexos** com comentários
- **Use factories/fixtures** para dados de teste

### ❌ Don'ts (Não Faça)

- **Não teste implementação**, teste comportamento
- **Não crie testes dependentes** entre si
- **Não ignore testes falhando** ("flaky tests")
- **Não teste código de terceiros** (bibliotecas)
- **Não use dados reais** em testes
- **Não deixe testes lentos** sem necessidade
- **Não duplique lógica** entre testes
- **Não teste getters/setters** simples
- **Não commite código** sem executar testes
- **Não ignore cobertura baixa** em código crítico

### 🏆 Estratégias Avançadas

#### 🔄 Test-Driven Development (TDD)

```python
# 1. Red: Escrever teste que falha
def test_calculate_booking_price():
    booking = BookingFactory(duration=timedelta(hours=2))
    studio = booking.studio
    studio.hourly_rate = Decimal('50.00')
    
    expected_price = Decimal('100.00')
    actual_price = booking.calculate_price()
    
    assert actual_price == expected_price

# 2. Green: Implementar código mínimo
class Booking(models.Model):
    def calculate_price(self):
        hours = self.duration.total_seconds() / 3600
        return self.studio.hourly_rate * Decimal(str(hours))

# 3. Refactor: Melhorar código mantendo testes
class Booking(models.Model):
    def calculate_price(self):
        """Calcula preço baseado na duração e taxa horária."""
        if not self.duration or not self.studio.hourly_rate:
            return Decimal('0.00')
        
        hours = Decimal(str(self.duration.total_seconds() / 3600))
        return self.studio.hourly_rate * hours
```

#### 🎭 Behavior-Driven Development (BDD)

```python
# tests/bdd/test_booking_scenarios.py
import pytest
from pytest_bdd import scenarios, given, when, then
from factories import UserFactory, StudioFactory

scenarios('booking.feature')

@given('um usuário autenticado')
def authenticated_user(api_client):
    user = UserFactory()
    api_client.force_authenticate(user=user)
    return user

@given('um estúdio disponível')
def available_studio():
    return StudioFactory()

@when('o usuário cria um agendamento válido')
def create_valid_booking(api_client, authenticated_user, available_studio):
    booking_data = {
        'studio': available_studio.id,
        'start_time': '2025-12-01T10:00:00Z',
        'end_time': '2025-12-01T12:00:00Z'
    }
    
    response = api_client.post('/api/bookings/', booking_data)
    return response

@then('o agendamento deve ser criado com sucesso')
def booking_created_successfully(create_valid_booking):
    assert create_valid_booking.status_code == 201
    assert create_valid_booking.data['status'] == 'pending'
```

```gherkin
# tests/bdd/booking.feature
Feature: Agendamento de Estúdios
  Como um usuário do StudioFlow
  Eu quero agendar um estúdio
  Para poder usar suas instalações

  Scenario: Criar agendamento válido
    Given um usuário autenticado
    And um estúdio disponível
    When o usuário cria um agendamento válido
    Then o agendamento deve ser criado com sucesso
    And o status deve ser "pending"

  Scenario: Agendamento com conflito de horário
    Given um usuário autenticado
    And um estúdio com agendamento existente
    When o usuário tenta agendar no mesmo horário
    Then deve receber erro de conflito
    And o agendamento não deve ser criado
```

---

## 📚 Recursos Adicionais

### 📖 Documentação

- [Django Testing](https://docs.djangoproject.com/en/4.2/topics/testing/)
- [Django REST Framework Testing](https://www.django-rest-framework.org/api-guide/testing/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Cypress Documentation](https://docs.cypress.io/)

### 🛠️ Ferramentas

- **Coverage.py**: Cobertura de código Python
- **pytest**: Framework de testes Python
- **Factory Boy**: Geração de dados de teste
- **Jest**: Framework de testes JavaScript
- **Testing Library**: Utilitários de teste React
- **Playwright**: Testes E2E modernos
- **Locust**: Testes de performance
- **Bandit**: Análise de segurança Python

### 📊 Métricas e Monitoramento

- **Codecov**: Relatórios de cobertura
- **SonarQube**: Qualidade de código
- **Sentry**: Monitoramento de erros
- **New Relic**: Performance monitoring
- **Grafana**: Dashboards de métricas

---

## 🎉 Conclusão

Este guia estabelece uma base sólida para testes no StudioFlow, cobrindo desde testes unitários básicos até estratégias avançadas de E2E e performance. A implementação gradual dessas práticas garantirá:

- ✅ **Qualidade de código** consistente
- 🐛 **Detecção precoce** de bugs
- 🔒 **Segurança** robusta
- ⚡ **Performance** otimizada
- 🚀 **Deploy** confiável
- 🛠️ **Manutenibilidade** a longo prazo

### 🎯 Próximos Passos

1. **Implementar testes unitários** para modelos críticos
2. **Configurar CI/CD** com GitHub Actions
3. **Estabelecer métricas** de cobertura
4. **Criar testes E2E** para fluxos principais
5. **Implementar testes de performance** regulares
6. **Configurar monitoramento** de qualidade

---

**💡 Lembre-se:** Testes não são apenas sobre encontrar bugs - eles são sobre construir confiança no seu código e permitir refatorações seguras. Invista tempo em testes de qualidade e colha os benefícios a longo prazo!

---

*Documento mantido pela equipe de desenvolvimento do StudioFlow*  
*Para dúvidas ou sugestões, abra uma issue no repositório*