# StudioFlow - Sistema de Gestão para Estúdios Musicais

![StudioFlow Logo](https://img.shields.io/badge/StudioFlow-Sistema%20de%20Gestão-blue?style=for-the-badge&logo=music)

**📅 Projeto iniciado em:** 22 de Julho de 2025  
**📝 Última atualização:** 24 de Julho de 2025  
**🔄 Status:** Em desenvolvimento ativo

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [API Endpoints](#api-endpoints)
- [Componentes Principais](#componentes-principais)
- [Autenticação](#autenticação)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎵 Sobre o Projeto

O **StudioFlow** é uma plataforma completa para gestão de estúdios musicais, desenvolvida para simplificar e otimizar todas as operações do seu negócio. Com uma interface moderna e intuitiva, o sistema oferece controle total sobre agendamentos, clientes, finanças e muito mais.

### 📈 Status Atual do Desenvolvimento
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Django 5 + DRF + PostgreSQL
- **Testes:** 15/160 testes passando (9.4%)
- **Cobertura:** 21.81% (Meta: 85%)
- **Funcionalidades:** Sistema de login funcional, componentes base implementados

### 🎯 Objetivos

- **Simplificar** a gestão de agendamentos e reservas
- **Otimizar** o controle financeiro e relatórios
- **Melhorar** a experiência do cliente
- **Automatizar** processos repetitivos
- **Centralizar** todas as informações em um só lugar

## ✨ Funcionalidades

### 🗓️ Gestão de Agendamentos
- Calendário interativo com visualização mensal/semanal/diária
- Sistema de reservas em tempo real
- Notificações automáticas por email/SMS
- Controle de disponibilidade de salas
- Histórico completo de agendamentos

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Histórico de agendamentos por cliente
- Sistema de preferências e observações
- Classificação de clientes (Regular, VIP, etc.)
- Relatórios de frequência e fidelidade

### 🏢 Gestão de Salas e Equipamentos
- Cadastro de salas com especificações técnicas
- Controle de equipamentos disponíveis
- Sistema de manutenção preventiva
- Fotos e descrições detalhadas
- Preços diferenciados por sala/horário

### 💰 Controle Financeiro
- Dashboard financeiro com métricas em tempo real
- Controle de receitas e despesas
- Relatórios de faturamento
- Análise de performance mensal/anual
- Gráficos e indicadores visuais

### 🔧 Configurações Avançadas
- Personalização de horários de funcionamento
- Configuração de preços e promoções
- Sistema de notificações customizável
- Backup automático de dados
- Integração com sistemas externos

### 🔐 Sistema de Autenticação
- Login seguro com JWT
- Diferentes níveis de acesso (Admin, Cliente, Prestador)
- Modal de autenticação com lazy loading
- Recuperação de senha
- Sessões seguras

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

# Inicie o servidor de desenvolvimento na porta 5000
python start_server.py
```

### Configuração do Front-End

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações

# Inicie o servidor de desenvolvimento na porta 5102
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
