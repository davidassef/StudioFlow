# 🔌 API Documentation - StudioFlow

**Versão:** 1.0  
**Base URL:** `http://localhost:8000/api/v1/`  
**Autenticação:** JWT Bearer Token  
**Última Atualização:** 24 de Julho de 2025

---

## 📋 Índice

- [🔐 Autenticação](#-autenticação)
- [👥 Usuários](#-usuários)
- [🏢 Estúdios](#-estúdios)
- [📅 Agendamentos](#-agendamentos)
- [🏠 Salas](#-salas)
- [📊 Dashboard](#-dashboard)
- [❌ Códigos de Erro](#-códigos-de-erro)
- [🔧 Utilitários](#-utilitários)

---

## 🔐 Autenticação

O StudioFlow utiliza autenticação JWT (JSON Web Tokens) para proteger os endpoints da API.

### Header de Autorização

```http
Authorization: Bearer <seu_token_jwt>
```

## Endpoints de Autenticação

### POST /api/auth/login/

Realiza o login do usuário.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "user_type": "PRESTADOR"
  }
}
```

### POST /api/auth/register/

Registra um novo usuário.

**Request Body:**
```json
{
  "email": "novo@exemplo.com",
  "password": "senha123",
  "name": "Novo Usuário",
  "phone": "+5511999999999",
  "user_type": "PRESTADOR"
}
```

**Response (201 Created):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 2,
    "email": "novo@exemplo.com",
    "name": "Novo Usuário",
    "user_type": "PRESTADOR"
  }
}
```

### POST /api/auth/refresh/

Renova o token de acesso.

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### POST /api/auth/logout/

Realiza o logout do usuário (invalida o refresh token).

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

## 👥 Usuários

### Listar Usuários

**Endpoint:** `GET /api/v1/users/`  
**Autenticação:** Requerida (Admin)

**Response (200 OK):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "email": "usuario@exemplo.com",
      "name": "Nome do Usuário",
      "phone": "+5511999999999",
      "user_type": "PRESTADOR",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Obter Usuário

**Endpoint:** `GET /api/v1/users/{id}/`  
**Autenticação:** Requerida

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "phone": "+5511999999999",
  "user_type": "PRESTADOR",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Atualizar Usuário

**Endpoint:** `PUT /api/v1/users/{id}/`  
**Autenticação:** Requerida

**Request Body:**
```json
{
  "name": "Nome Atualizado",
  "phone": "+5511888888888"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "usuario@exemplo.com",
  "name": "Nome Atualizado",
  "phone": "+5511888888888",
  "user_type": "PRESTADOR",
  "is_active": true,
  "updated_at": "2024-01-15T11:30:00Z"
}
```

## Endpoints de Estúdios

### GET /api/v1/studios/

Lista todos os estúdios.

**Response (200 OK):**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "name": "Studio Musical XYZ",
      "description": "Estúdio profissional com equipamentos de alta qualidade",
      "address": "Rua da Música, 123",
      "phone": "+5511999999999",
      "email": "contato@studioxyz.com",
      "website": "https://studioxyz.com",
      "owner": 1,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/v1/studios/

Cria um novo estúdio.

**Request Body:**
```json
{
  "name": "Novo Studio",
  "description": "Descrição do estúdio",
  "address": "Endereço completo",
  "phone": "+5511999999999",
  "email": "contato@novostudio.com",
  "website": "https://novostudio.com"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Novo Studio",
  "description": "Descrição do estúdio",
  "address": "Endereço completo",
  "phone": "+5511999999999",
  "email": "contato@novostudio.com",
  "website": "https://novostudio.com",
  "owner": 1,
  "created_at": "2024-01-15T12:00:00Z"
}
```

## Endpoints de Salas

### GET /api/v1/rooms/

Lista todas as salas.

**Query Parameters:**
- `studio` (int): Filtrar por ID do estúdio
- `available` (bool): Filtrar por disponibilidade
- `capacity_min` (int): Capacidade mínima
- `capacity_max` (int): Capacidade máxima

**Response (200 OK):**
```json
{
  "count": 8,
  "results": [
    {
      "id": 1,
      "name": "Sala A - Gravação",
      "description": "Sala profissional para gravação",
      "capacity": 10,
      "hourly_rate": "150.00",
      "equipment": [
        "Mesa de som 32 canais",
        "Microfones Shure SM57",
        "Monitores KRK"
      ],
      "amenities": [
        "Ar condicionado",
        "Isolamento acústico",
        "Cabine vocal"
      ],
      "studio": 1,
      "is_available": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/v1/rooms/

Cria uma nova sala.

**Request Body:**
```json
{
  "name": "Sala B - Ensaio",
  "description": "Sala para ensaios de banda",
  "capacity": 6,
  "hourly_rate": "80.00",
  "equipment": [
    "Bateria completa",
    "Amplificadores",
    "Microfones"
  ],
  "amenities": [
    "Ar condicionado",
    "Isolamento acústico"
  ],
  "studio": 1
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Sala B - Ensaio",
  "description": "Sala para ensaios de banda",
  "capacity": 6,
  "hourly_rate": "80.00",
  "equipment": [
    "Bateria completa",
    "Amplificadores",
    "Microfones"
  ],
  "amenities": [
    "Ar condicionado",
    "Isolamento acústico"
  ],
  "studio": 1,
  "is_available": true,
  "created_at": "2024-01-15T12:30:00Z"
}
```

## Endpoints de Agendamentos

### GET /api/v1/bookings/

Lista todos os agendamentos.

**Query Parameters:**
- `room` (int): Filtrar por ID da sala
- `client` (int): Filtrar por ID do cliente
- `status` (string): Filtrar por status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- `date_from` (date): Data inicial (YYYY-MM-DD)
- `date_to` (date): Data final (YYYY-MM-DD)

**Response (200 OK):**
```json
{
  "count": 15,
  "results": [
    {
      "id": 1,
      "room": {
        "id": 1,
        "name": "Sala A - Gravação",
        "hourly_rate": "150.00"
      },
      "client": {
        "id": 2,
        "name": "João Silva",
        "email": "joao@exemplo.com"
      },
      "start_time": "2024-01-20T14:00:00Z",
      "end_time": "2024-01-20T18:00:00Z",
      "total_amount": "600.00",
      "status": "CONFIRMED",
      "notes": "Gravação de álbum",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/v1/bookings/

Cria um novo agendamento.

**Request Body:**
```json
{
  "room": 1,
  "client": 2,
  "start_time": "2024-01-25T10:00:00Z",
  "end_time": "2024-01-25T14:00:00Z",
  "notes": "Sessão de ensaio"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "room": {
    "id": 1,
    "name": "Sala A - Gravação",
    "hourly_rate": "150.00"
  },
  "client": {
    "id": 2,
    "name": "João Silva",
    "email": "joao@exemplo.com"
  },
  "start_time": "2024-01-25T10:00:00Z",
  "end_time": "2024-01-25T14:00:00Z",
  "total_amount": "600.00",
  "status": "PENDING",
  "notes": "Sessão de ensaio",
  "created_at": "2024-01-15T15:30:00Z"
}
```

### GET /api/v1/bookings/availability/

Verifica disponibilidade de salas.

**Query Parameters:**
- `room` (int): ID da sala
- `date` (date): Data para verificar (YYYY-MM-DD)
- `start_time` (time): Hora inicial (HH:MM)
- `end_time` (time): Hora final (HH:MM)

**Response (200 OK):**
```json
{
  "available": true,
  "conflicts": [],
  "suggested_times": [
    {
      "start_time": "09:00",
      "end_time": "13:00"
    },
    {
      "start_time": "15:00",
      "end_time": "19:00"
    }
  ]
}
```

## Endpoints de Relatórios

### GET /api/v1/reports/financial/

Relatório financeiro.

**Query Parameters:**
- `period` (string): Período (daily, weekly, monthly, yearly)
- `start_date` (date): Data inicial
- `end_date` (date): Data final
- `studio` (int): ID do estúdio

**Response (200 OK):**
```json
{
  "period": "monthly",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "total_revenue": "15000.00",
  "total_expenses": "5000.00",
  "net_profit": "10000.00",
  "bookings_count": 45,
  "average_booking_value": "333.33",
  "revenue_by_room": [
    {
      "room_name": "Sala A - Gravação",
      "revenue": "8000.00",
      "bookings": 20
    },
    {
      "room_name": "Sala B - Ensaio",
      "revenue": "7000.00",
      "bookings": 25
    }
  ],
  "daily_revenue": [
    {
      "date": "2024-01-01",
      "revenue": "500.00"
    }
  ]
}
```

### GET /api/v1/reports/bookings/

Relatório de agendamentos.

**Query Parameters:**
- `period` (string): Período (daily, weekly, monthly, yearly)
- `start_date` (date): Data inicial
- `end_date` (date): Data final
- `studio` (int): ID do estúdio
- `room` (int): ID da sala

**Response (200 OK):**
```json
{
  "period": "monthly",
  "total_bookings": 45,
  "confirmed_bookings": 40,
  "cancelled_bookings": 3,
  "pending_bookings": 2,
  "occupancy_rate": 75.5,
  "average_session_duration": 3.2,
  "peak_hours": [
    {
      "hour": 14,
      "bookings": 12
    },
    {
      "hour": 15,
      "bookings": 10
    }
  ],
  "bookings_by_day": [
    {
      "day": "Monday",
      "bookings": 8
    }
  ]
}
```

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos na requisição
- `401 Unauthorized`: Token de autenticação inválido ou ausente
- `403 Forbidden`: Usuário não tem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex: horário já agendado)
- `422 Unprocessable Entity`: Dados válidos mas não processáveis
- `500 Internal Server Error`: Erro interno do servidor

## Tratamento de Erros

Todos os erros retornam um objeto JSON com a seguinte estrutura:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos fornecidos",
    "details": {
      "email": ["Este campo é obrigatório"]
    }
  }
}
```

## Paginação

Endpoints que retornam listas utilizam paginação:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/v1/bookings/?page=3",
  "previous": "http://localhost:8000/api/v1/bookings/?page=1",
  "results": [...]
}
```

**Query Parameters para Paginação:**
- `page` (int): Número da página (padrão: 1)
- `page_size` (int): Itens por página (padrão: 20, máximo: 100)

## Rate Limiting

A API implementa rate limiting para prevenir abuso:

- **Usuários autenticados**: 1000 requisições por hora
- **Usuários não autenticados**: 100 requisições por hora

Headers de resposta incluem informações sobre o limite:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

## Versionamento

A API utiliza versionamento via URL:

- Versão atual: `/api/v1/`
- Versões futuras: `/api/v2/`, `/api/v3/`, etc.

## Webhooks

O sistema suporta webhooks para notificações em tempo real:

### Eventos Disponíveis

- `booking.created`: Novo agendamento criado
- `booking.confirmed`: Agendamento confirmado
- `booking.cancelled`: Agendamento cancelado
- `payment.completed`: Pagamento concluído
- `user.registered`: Novo usuário registrado

### Configuração

Webhooks podem ser configurados via painel administrativo ou API:

```http
POST /api/v1/webhooks/
{
  "url": "https://seu-site.com/webhook",
  "events": ["booking.created", "booking.confirmed"],
  "secret": "sua_chave_secreta"
}
```

### Payload do Webhook

```json
{
  "event": "booking.created",
  "timestamp": "2024-01-15T12:00:00Z",
  "data": {
    "id": 123,
    "room": {...},
    "client": {...},
    "start_time": "2024-01-20T14:00:00Z",
    "end_time": "2024-01-20T18:00:00Z"
  }
}
```

## SDKs e Bibliotecas

### JavaScript/TypeScript

```bash
npm install @studioflow/api-client
```

```javascript
import { StudioFlowAPI } from '@studioflow/api-client';

const api = new StudioFlowAPI({
  baseURL: 'http://localhost:8000',
  token: 'seu_token_jwt'
});

const bookings = await api.bookings.list();
```

### Python

```bash
pip install studioflow-api
```

```python
from studioflow_api import StudioFlowAPI

api = StudioFlowAPI(
    base_url='http://localhost:8000',
    token='seu_token_jwt'
)

bookings = api.bookings.list()
```

## Exemplos de Uso

### Criar um Agendamento Completo

```javascript
// 1. Verificar disponibilidade
const availability = await api.get('/bookings/availability/', {
  params: {
    room: 1,
    date: '2024-01-25',
    start_time: '14:00',
    end_time: '18:00'
  }
});

if (availability.data.available) {
  // 2. Criar o agendamento
  const booking = await api.post('/bookings/', {
    room: 1,
    client: 2,
    start_time: '2024-01-25T14:00:00Z',
    end_time: '2024-01-25T18:00:00Z',
    notes: 'Gravação de álbum'
  });
  
  console.log('Agendamento criado:', booking.data);
}
```

### Gerar Relatório Financeiro

```javascript
const report = await api.get('/reports/financial/', {
  params: {
    period: 'monthly',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    studio: 1
  }
});

console.log('Receita total:', report.data.total_revenue);
console.log('Lucro líquido:', report.data.net_profit);
```

## Suporte

Para dúvidas sobre a API:

- **Documentação**: [https://docs.studioflow.com](https://docs.studioflow.com)
- **Email**: api-support@studioflow.com
- **Discord**: [#api-help](https://discord.gg/studioflow)
- **GitHub Issues**: [Reportar problemas](https://github.com/seu-usuario/studioflow/issues)