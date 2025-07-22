# StudioFlow

![StudioFlow Logo](https://via.placeholder.com/150x150.png?text=StudioFlow)

## 🎵 Sobre o Projeto

StudioFlow é uma aplicação web (SaaS) projetada para ser um sistema de gestão completo (mini-ERP) para estúdios de música de pequeno e médio porte. O objetivo é centralizar e automatizar o agendamento de salas, o cadastro de clientes e o controle de sessões, substituindo métodos manuais como planilhas e agendas de papel.

O sistema é construído como uma Single Page Application (SPA) com um back-end robusto servindo uma API RESTful, garantindo uma experiência de usuário fluida e responsiva.

## 🚀 Tecnologias Utilizadas

### Front-End
- React 18+
- TypeScript 5+
- Next.js 14+
- Tailwind CSS 3+
- Axios
- React Big Calendar

### Back-End
- Python 3.11+
- Django 5+
- Django REST Framework (DRF) 3+
- djangorestframework-simplejwt

### Infraestrutura
- PostgreSQL 16+
- Gunicorn + Uvicorn
- Docker

## 🏗️ Arquitetura

O StudioFlow segue uma arquitetura desacoplada com clara separação entre front-end e back-end:

- **Front-End:** Aplicação React/Next.js com TypeScript
- **Back-End:** API RESTful com Django e DRF
- **Banco de Dados:** PostgreSQL
- **Deploy:** Front-End em Vercel/Netlify, Back-End em Heroku/Render

## 📋 Funcionalidades Principais

- **Autenticação e Autorização:** Sistema completo com JWT
- **Gerenciamento de Salas:** Cadastro e controle de disponibilidade
- **Agendamentos:** Sistema intuitivo de reserva de salas
- **Dashboard Admin:** Controle total sobre agendamentos e clientes
- **Dashboard Cliente:** Visualização e gerenciamento dos próprios agendamentos

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- Python 3.11+
- PostgreSQL 16+
- Docker e Docker Compose (opcional)

### Configuração do Back-End

```bash
# Clone o repositório
git clone https://github.com/davidassef/studioflow.git
cd studioflow/backend

# Crie e ative um ambiente virtual
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações
python manage.py migrate

# Crie um superusuário
python manage.py createsuperuser

# Inicie o servidor de desenvolvimento
python manage.py runserver
```

### Configuração do Front-End

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

### Usando Docker

```bash
# Na raiz do projeto
docker-compose up -d
```

## 📊 Roadmap de Desenvolvimento

### Fase 1: Setup e Back-End Core
- Setup do projeto Django e React/Next.js
- Modelagem do banco de dados e criação das migrations
- Configuração do Django Admin
- Implementação do sistema de autenticação JWT
- Criação dos endpoints CRUD básicos para Salas

### Fase 2: Front-End Core e Integração
- Criação das telas de Login e Registro
- Integração da autenticação com o front-end
- Desenvolvimento do Dashboard de Admin para gerenciar Salas

### Fase 3: Funcionalidade Principal
- Criação dos endpoints para Agendamentos
- Desenvolvimento do componente de Calendário no front-end
- Implementação do fluxo de criação de agendamento pelo Cliente
- Implementação do fluxo de confirmação/cancelamento pelo Admin
- Desenvolvimento do Dashboard do Cliente

### Fase 4: Polimento e Deploy
- Implementação de testes unitários e de integração
- Refinamento da UI/UX e garantia de responsividade
- Configuração do Docker para ambiente de desenvolvimento e produção
- Deploy da primeira versão (MVP)

## 🔮 Features Futuras

- **v1.1:** Sistema de Pagamentos (Stripe/Mercado Pago)
- **v1.2:** Sistema de Notificações por E-mail
- **v1.3:** Dashboard de Relatórios e Analytics

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## 👥 Contribuição

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## 📞 Contato

David Assef Carneiro - [davidassef@gmail.com](mailto:davidassef@gmail.com)

Link do Projeto: [https://github.com/davidassef/studioflow](https://github.com/davidassef/studioflow)
