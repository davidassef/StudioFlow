# Especificação Técnica de Arquitetura: StudioFlow v1.0

**Autor:** David Assef Carneiro  
**Data:** 24 de Julho de 2025 - 23:59  
**Versão:** 1.1 - Atualizado com progresso atual

## 1. Introdução e Visão do Produto

StudioFlow é uma aplicação web (SaaS) projetada para ser um sistema de gestão completo (mini-ERP) para estúdios de música de pequeno e médio porte. O objetivo é centralizar e automatizar o agendamento de salas, o cadastro de clientes e o controle de sessões, substituindo métodos manuais como planilhas e agendas de papel.

O sistema será construído como uma Single Page Application (SPA) com um back-end robusto servindo uma API RESTful, garantindo uma experiência de usuário fluida e responsiva.

## 2. Arquitetura do Sistema

A aplicação seguirá uma arquitetura de software desacoplada, com uma clara separação de responsabilidades entre o cliente (Front-End) e o servidor (Back-End).

- **Front-End:** Uma aplicação React com TypeScript, responsável por toda a interface do usuário e gerenciamento de estado do lado do cliente.

- **Back-End:** Uma API RESTful desenvolvida com Django e Django REST Framework (DRF), responsável pela lógica de negócio, autenticação, autorização e persistência de dados.

- **Banco de Dados:** Um banco de dados relacional SQL para garantir a integridade e a consistência dos dados.

- **Deploy:** O Front-End será hospedado em uma plataforma de Jamstack (Vercel/Netlify) e o Back-End em uma plataforma de PaaS (Heroku/Render).

## 3. Stack de Tecnologias

### Front-End

| Tecnologia | Versão (Sugerida) | Justificativa |
|------------|-------------------|---------------|
| React | 18+ | Biblioteca líder para interfaces reativas e componentizadas. |
| TypeScript | 5+ | Adiciona segurança de tipos, essencial para a complexidade dos dados. |
| Next.js | 14+ | Framework de produção para React, oferece SSR, otimizações e roteamento. |
| Tailwind CSS | 3+ | Utility-first para estilização rápida e consistente. |
| Axios | 1+ | Cliente HTTP robusto para comunicação com a API. |
| React Big Calendar | - | Biblioteca completa para a criação do dashboard de agendamentos. |

### Back-End

| Tecnologia | Versão (Sugerida) | Justificativa |
|------------|-------------------|---------------|
| Python | 3.11+ | Linguagem robusta, madura e com vasto ecossistema. |
| Django | 5+ | Framework "batteries-included", ideal para a complexidade do projeto. |
| Django REST Framework (DRF) | 3+ | Padrão de mercado para a criação de APIs REST com Django. |
| djangorestframework-simplejwt | - | Implementação robusta de autenticação via JSON Web Tokens (JWT). |

### Infraestrutura

| Camada | Tecnologia | Versão (Sugerida) | Justificativa |
|--------|------------|-------------------|---------------|
| Banco de Dados | PostgreSQL | 16+ | Banco de dados SQL poderoso, confiável e escalável. |
| Servidores | Gunicorn + Uvicorn | - | Servidores de aplicação Python para produção. |
| DevOps | Docker | - | Containerização da aplicação para consistência entre ambientes. |

## 4. Esquema do Banco de Dados (Schema)

O schema inicial será composto pelas seguintes entidades principais:

### Tabela users (Custom User Model do Django):

- id (PK)
- email (unique)
- password (hashed)
- nome
- telefone
- user_type (Enum: 'ADMIN', 'CLIENTE')
- is_active, is_staff, date_joined (padrão Django)

### Tabela salas:

- id (PK)
- nome (ex: "Sala A - Bateria")
- capacidade (integer)
- preco_hora (decimal)
- descricao (text, opcional)
- is_disponivel (boolean)

### Tabela agendamentos:

- id (PK)
- sala_id (FK para salas)
- cliente_id (FK para users)
- horario_inicio (datetime)
- horario_fim (datetime)
- valor_total (decimal)
- status (Enum: 'PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO')
- data_criacao (datetime)
- data_atualizacao (datetime)

## 5. API Endpoints (Contrato RESTful)

A API será versionada (`/api/v1/`). A autenticação será via JWT.

### Autenticação

- `POST /api/v1/token/` - Obter token de acesso (Login)
- `POST /api/v1/token/refresh/` - Atualizar token de acesso
- `POST /api/v1/users/register/` - Registrar um novo usuário do tipo 'CLIENTE'

### Agendamentos

- `GET /api/v1/agendamentos/`
  - Admin: Lista todos os agendamentos.
  - Cliente: Lista apenas os seus próprios agendamentos.

- `POST /api/v1/agendamentos/`
  - Cliente: Cria um novo agendamento com status 'PENDENTE'.

- `GET /api/v1/agendamentos/{id}/` - Detalhes de um agendamento.

- `PATCH /api/v1/agendamentos/{id}/`
  - Admin: Atualiza um agendamento (ex: mudar status para 'CONFIRMADO').
  - Cliente: Atualiza um agendamento (ex: para 'CANCELADO').

> (Endpoints para salas e clientes seguirão o mesmo padrão CRUD)

## 6. Arquitetura do Front-End

A aplicação em React será estruturada por funcionalidade (feature-based) para melhor organização.

```
/src
|-- /components       # Componentes reutilizáveis (Button, Input, Modal)
|-- /features         # Lógica e componentes de cada funcionalidade
|   |-- /auth         # Telas e lógica de Login, Registro
|   |-- /booking      # Componente do Calendário, Formulário de Agendamento
|   |-- /dashboard    # Dashboards de Admin e Cliente
|-- /hooks            # Hooks customizados (ex: useFetch, useAuth)
|-- /lib              # Configuração do Axios, etc.
|-- /pages            # Rotas da aplicação (Next.js)
|-- /types            # Interfaces e tipos do TypeScript (ex: Agendamento.ts)
```

### Exemplo de Interface TypeScript (Agendamento.ts):

```typescript
interface User {
  id: number;
  nome: string;
}

interface Sala {
  id: number;
  nome: string;
}

export interface Agendamento {
  id: number;
  sala: Sala;
  cliente: User;
  horario_inicio: string; // Formato ISO 8601
  horario_fim: string;   // Formato ISO 8601
  valor_total: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
}
```

## 7. Roadmap de Desenvolvimento (Milestones)

### Fase 1: Setup e Back-End Core (Sprint 1)

- Setup do projeto Django e React/Next.js.
- Modelagem do banco de dados e criação das migrations.
- Configuração do Django Admin.
- Implementação do sistema de autenticação JWT com djangorestframework-simplejwt.
- Criação dos endpoints CRUD básicos para Salas.

### Fase 2: Front-End Core e Integração (Sprint 2)

- Criação das telas de Login e Registro.
- Integração da autenticação com o front-end.
- Desenvolvimento do Dashboard de Admin para gerenciar Salas.

### Fase 3: Funcionalidade Principal (Sprint 3 & 4)

- Criação dos endpoints para Agendamentos.
- Desenvolvimento do componente de Calendário no front-end.
- Implementação do fluxo de criação de agendamento pelo Cliente.
- Implementação do fluxo de confirmação/cancelamento pelo Admin.
- Desenvolvimento do Dashboard do Cliente para visualização de seus agendamentos.

### Fase 4: Polimento e Deploy (Sprint 5)

- Implementação de testes unitários (Jest/Pytest) e de integração.
- Refinamento da UI/UX e garantia de responsividade.
- Configuração do Docker para ambiente de desenvolvimento e produção.
- Deploy da primeira versão (MVP) na Vercel (Front-End) e Render (Back-End).

## 8. Features Futuras (Roadmap Pós-MVP)

### v1.1: Sistema de Pagamentos

- Integração com um gateway de pagamento (Stripe/Mercado Pago) para permitir o pagamento online no ato do agendamento.

### v1.2: Notificações

- Envio de e-mails automáticos para clientes confirmando agendamentos e enviando lembretes.

### v1.3: Dashboard de Relatórios

- Criação de uma área no painel do Admin com gráficos e relatórios de faturamento, taxa de ocupação das salas, etc.