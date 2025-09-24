# 🚀 Guia de Instalação - StudioFlow

**Versão:** 1.0  
**Última Atualização:** 24 de Julho de 2025  
**Tempo Estimado:** 30-45 minutos

---

## 📋 Índice

- [📋 Pré-requisitos](#-pré-requisitos)
- [🔧 Instalação Local](#-instalação-local)
- [🐳 Instalação com Docker](#-instalação-com-docker)
- [⚙️ Configuração Avançada](#️-configuração-avançada)
- [🧪 Verificação da Instalação](#-verificação-da-instalação)
- [🔧 Troubleshooting](#-troubleshooting)
- [📚 Próximos Passos](#-próximos-passos)

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

### ✅ Obrigatórios

| Software | Versão Mínima | Download | Verificação |
|----------|---------------|----------|-------------|
| **Python** | 3.11+ | [python.org](https://python.org/downloads/) | `python --version` |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) | `node --version` |
| **PostgreSQL** | 14+ | [postgresql.org](https://postgresql.org/download/) | `psql --version` |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/downloads) | `git --version` |

### 🔧 Opcionais (Recomendados)

| Software | Propósito | Download |
|----------|-----------|----------|
| **Docker** | Containerização | [docker.com](https://docker.com/get-started/) |
| **VS Code** | Editor de código | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Postman** | Teste de APIs | [postman.com](https://postman.com/downloads/) |
| **pgAdmin** | Interface PostgreSQL | [pgadmin.org](https://pgadmin.org/download/) |

### 🖥️ Requisitos do Sistema

- **RAM:** Mínimo 4GB, recomendado 8GB+
- **Espaço em Disco:** 2GB livres
- **SO:** Windows 10+, macOS 10.15+, Ubuntu 20.04+

---

## 🔧 Instalação Local

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/studioflow.git
cd studioflow
```

### 2️⃣ Configuração do Backend (Django)

#### 2.1. Criar e Ativar Ambiente Virtual

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

> 💡 **Dica:** Sempre ative o ambiente virtual antes de trabalhar no projeto!

#### 2.2. Instalar Dependências

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2.3. Configurar Banco de Dados PostgreSQL

**Opção A: Via psql (Linha de Comando)**
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Executar comandos SQL
CREATE DATABASE studioflow;
CREATE USER studioflow_user WITH PASSWORD 'StudioFlow2025!';
GRANT ALL PRIVILEGES ON DATABASE studioflow TO studioflow_user;
ALTER USER studioflow_user CREATEDB;
\q
```

**Opção B: Via pgAdmin (Interface Gráfica)**
1. Abra o pgAdmin
2. Conecte ao servidor PostgreSQL
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `studioflow`
5. Owner: `studioflow_user` (criar usuário se necessário)

#### 2.4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
# Configurações de Debug
DEBUG=True
SECRET_KEY=django-insecure-sua-chave-secreta-muito-longa-e-segura-aqui

# Banco de Dados
DATABASE_URL=postgresql://studioflow_user:StudioFlow2025!@localhost:5432/studioflow

# Hosts Permitidos
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# CORS (para desenvolvimento)
CORS_ALLOWED_ORIGINS=http://localhost:5102

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email (opcional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

> ⚠️ **Importante:** Nunca commite o arquivo `.env` no Git!

#### 2.5. Executar Migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.6. Criar Superusuário

```bash
python manage.py createsuperuser
```

**Dados sugeridos para desenvolvimento:**
- Email: `admin@studioflow.com`
- Nome: `Admin StudioFlow`
- Senha: `admin123` (apenas para desenvolvimento!)

#### 2.7. Carregar Dados de Exemplo (Opcional)

```bash
python manage.py loaddata fixtures/sample_data.json
```

#### 2.8. Iniciar Servidor Backend

```bash
python start_server.py
```

✅ **Backend disponível em:** `http://localhost:5000`  
🔧 **Django Admin:** `http://localhost:5000/admin`  
📚 **API Docs:** `http://localhost:5000/swagger/`

### 3️⃣ Configuração do Frontend (Next.js)

#### 3.1. Instalar Dependências

```bash
# Em um novo terminal
cd frontend
# ou se estiver usando o monorepo:
cd packages/web

npm install
```

#### 3.2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:5102
NEXT_PUBLIC_APP_NAME=StudioFlow

# Development
NODE_ENV=development

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

#### 3.3. Iniciar Servidor Frontend

```bash
npm run dev
```

✅ **Frontend disponível em:** `http://localhost:5102`

---

## 🐳 Instalação com Docker

### Pré-requisitos Docker
- Docker 20.10+
- Docker Compose 2.0+

### 1️⃣ Configuração Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/studioflow.git
cd studioflow

# Copie os arquivos de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Inicie todos os serviços
docker-compose up -d
```

### 2️⃣ Serviços Disponíveis

| Serviço | URL | Porta |
|---------|-----|-------|
| Frontend | http://localhost:5102 | 5102 |
| Backend | http://localhost:5000 | 5000 |
| PostgreSQL | localhost:5432 | 5432 |
| Redis | localhost:6379 | 6379 |
| pgAdmin | http://localhost:5050 | 5050 |

### 3️⃣ Comandos Úteis Docker

```bash
# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild containers
docker-compose up --build

# Executar migrações
docker-compose exec backend python manage.py migrate

# Criar superusuário
docker-compose exec backend python manage.py createsuperuser
```

---

## ⚙️ Configuração Avançada

### 🔐 Configurações de Segurança

#### JWT Personalizado
```env
# backend/.env
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=60  # minutos
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutos (24h)
JWT_ROTATE_REFRESH_TOKENS=True
```

#### CORS Personalizado
```env
# Para produção
CORS_ALLOWED_ORIGINS=https://seudominio.com,https://app.seudominio.com
CORS_ALLOW_CREDENTIALS=True
```

### 📧 Configuração de Email

#### Gmail SMTP
```env
# backend/.env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app
DEFAULT_FROM_EMAIL=StudioFlow <noreply@studioflow.com>
```

### 🗄️ Configuração de Banco Avançada

```env
# Para melhor performance
DATABASE_URL=postgresql://user:pass@localhost:5432/studioflow?options=-c%20default_transaction_isolation=read_committed
DATABASE_CONN_MAX_AGE=600
DATABASE_CONN_HEALTH_CHECKS=True
```

### 📊 Monitoramento e Logs

```env
# Configuração de logs
LOG_LEVEL=INFO
DJANGO_LOG_LEVEL=INFO
SQL_LOG_LEVEL=WARNING

# Sentry (opcional)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=development
```

---

## 🧪 Verificação da Instalação

### ✅ Checklist de Verificação

#### Backend
```bash
# 1. Verificar se o servidor está rodando
curl http://localhost:5000/api/v1/health/

# 2. Verificar autenticação
curl -X POST http://localhost:5000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# 3. Verificar admin
# Acesse: http://localhost:5000/admin/
```

#### Frontend
```bash
# 1. Verificar se está rodando
curl http://localhost:5102

# 2. Verificar build
cd frontend && npm run build

# 3. Verificar tipos TypeScript
cd frontend && npm run type-check
```

#### Banco de Dados
```bash
# Conectar ao PostgreSQL
psql -h localhost -U studioflow_user -d studioflow

# Verificar tabelas
\dt

# Verificar dados
SELECT COUNT(*) FROM auth_user;
```

### 🎯 Testes Automatizados

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm run test
npm run test:e2e
```

---

## 🔧 Troubleshooting

### ❌ Problemas Comuns

#### 1. Erro de Conexão com Banco

**Sintoma:** `django.db.utils.OperationalError: could not connect to server`

**Soluções:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Verificar porta
netstat -an | grep 5432

# Testar conexão manual
psql -h localhost -U studioflow_user -d studioflow
```

#### 2. Erro de Migração

**Sintoma:** `django.db.migrations.exceptions.InconsistentMigrationHistory`

**Soluções:**
```bash
# Reset completo (CUIDADO: apaga dados!)
python manage.py migrate --fake-initial

# Ou reset do banco
dropdb studioflow && createdb studioflow
python manage.py migrate
```

#### 3. Erro de Dependências Node.js

**Sintoma:** `Module not found` ou `Cannot resolve dependency`

**Soluções:**
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Verificar versão Node
node --version  # Deve ser 18+
```

#### 4. Erro de CORS

**Sintoma:** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3004' has been blocked by CORS policy`

**Soluções:**
```env
# backend/.env
CORS_ALLOWED_ORIGINS=http://localhost:3004,http://localhost:3000
CORS_ALLOW_ALL_ORIGINS=True  # Apenas para desenvolvimento!
```

#### 5. Erro de Porta em Uso

**Sintoma:** `Error: listen EADDRINUSE: address already in use :::3004`

**Soluções:**
```bash
# Encontrar processo usando a porta
lsof -ti:3004  # macOS/Linux
netstat -ano | findstr :3004  # Windows

# Matar processo
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Ou usar porta diferente
npm run dev -- -p 3005
```

### 🆘 Logs Importantes

```bash
# Backend logs
tail -f backend/logs/django.log

# Frontend logs
npm run dev  # Logs aparecem no terminal

# PostgreSQL logs
# Linux: /var/log/postgresql/
# macOS: /usr/local/var/log/
# Windows: C:\Program Files\PostgreSQL\14\data\log
```

### 📞 Onde Buscar Ajuda

1. **Documentação:** Consulte os outros arquivos em `/docs`
2. **Issues:** Verifique issues conhecidos no GitHub
3. **Logs:** Sempre inclua logs completos ao reportar problemas
4. **Comunidade:** Discord/Slack da equipe (se disponível)

---

## 📚 Próximos Passos

### 🎯 Após Instalação Bem-Sucedida

1. **📖 Leia a Documentação**
   - [📋 Especificações](./14-specifications.md)
   - [🏗️ Arquitetura](./02-system-architecture.md)
   - [🤝 Como Contribuir](./03-contributing-guide.md)

2. **🧪 Execute os Testes**
   ```bash
   # Backend
   cd backend && python manage.py test
   
   # Frontend
   cd frontend && npm run test
   ```

3. **🔍 Explore a API**
   - Swagger UI: http://localhost:8000/swagger/
   - Django Admin: http://localhost:8000/admin/
   - [📚 Documentação da API](./01-api-reference.md)

4. **🎨 Customize o Design**
   - [🎨 Design System](./05-design-system.md)
   - Componentes em `frontend/src/components/`

5. **🚀 Configure para Produção**
   - [📦 Guia de Deploy](./04-deployment-guide.md) (quando disponível)
   - Configurações de segurança
   - Monitoramento e logs

### 🛠️ Ferramentas de Desenvolvimento

```bash
# Instalar ferramentas úteis
npm install -g @storybook/cli  # Para componentes
pip install django-debug-toolbar  # Para debug Django
npm install -g vercel  # Para deploy rápido
```

### 📈 Próximas Features

Consulte o [📋 Status do Projeto](./project-status.md) para ver:
- Features em desenvolvimento
- Roadmap de funcionalidades
- Como contribuir com novas features

---

**🎉 Parabéns! Sua instalação do StudioFlow está completa!**

> 💡 **Dica:** Mantenha este documento atualizado conforme o projeto evolui.

**📞 Suporte:** Para dúvidas, consulte o [❓ FAQ](./07-faq.md) ou abra uma issue no GitHub.

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/studioflow.git
cd studioflow
```

### 2. Configuração do Banco de Dados

#### PostgreSQL

1. **Criar usuário e banco de dados:**

```sql
-- Conectar como superusuário
psql -U postgres

-- Criar usuário
CREATE USER studioflow_user WITH PASSWORD 'sua_senha_segura';

-- Criar banco de dados
CREATE DATABASE studioflow_db OWNER studioflow_user;

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE studioflow_db TO studioflow_user;

-- Sair
\q
```

2. **Testar conexão:**

```bash
psql -h localhost -U studioflow_user -d studioflow_db
```

#### Redis

1. **Iniciar o Redis:**

```bash
# Windows (se instalado como serviço)
net start redis

# macOS/Linux
redis-server

# Ou como daemon
redis-server --daemonize yes
```

2. **Testar conexão:**

```bash
redis-cli ping
# Deve retornar: PONG
```

### 3. Configuração do Backend (Django)

#### 3.1. Navegar para o diretório do backend

```bash
cd backend
```

#### 3.2. Criar ambiente virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3.3. Instalar dependências

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 3.4. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
# Configurações básicas
DEBUG=True
SECRET_KEY=sua-chave-secreta-muito-longa-e-segura-aqui
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Banco de dados
DATABASE_URL=postgresql://studioflow_user:sua_senha_segura@localhost:5432/studioflow_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Email (opcional para desenvolvimento)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app

# JWT
JWT_SECRET_KEY=outra-chave-secreta-para-jwt
JWT_ACCESS_TOKEN_LIFETIME=60  # minutos
JWT_REFRESH_TOKEN_LIFETIME=7  # dias

# Celery
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2

# Upload de arquivos
MEDIA_ROOT=media/
MAX_UPLOAD_SIZE=10485760  # 10MB

# Configurações de segurança
CSRF_TRUSTED_ORIGINS=http://localhost:5000,http://127.0.0.1:5000
CORS_ALLOWED_ORIGINS=http://localhost:5000,http://127.0.0.1:5000
```

#### 3.5. Executar migrações

```bash
python manage.py makemigrations
python manage.py migrate
```

#### 3.6. Criar superusuário

```bash
python manage.py createsuperuser
```

#### 3.7. Carregar dados iniciais (opcional)

```bash
python manage.py loaddata fixtures/initial_data.json
```

#### 3.8. Testar o backend

```bash
python manage.py runserver
```

Acesse `http://localhost:8000/admin/` para verificar se está funcionando.

### 4. Configuração do Frontend (Next.js)

#### 4.1. Abrir novo terminal e navegar para o frontend

```bash
cd frontend
```

#### 4.2. Instalar dependências

```bash
npm install
```

#### 4.3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na pasta `frontend/`:

```env
# URLs da API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# URL da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:5000

# Configurações de autenticação
NEXT_PUBLIC_JWT_STORAGE_KEY=studioflow_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=studioflow_refresh

# Configurações de upload
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf

# Google Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (opcional)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Configurações de desenvolvimento
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

#### 4.4. Executar o frontend

```bash
npm run dev
```

Acesse `http://localhost:5000` para verificar se está funcionando.

### 5. Configuração do Celery (Processamento Assíncrono)

#### 5.1. Em um novo terminal, ativar o ambiente virtual

```bash
cd backend
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate  # Windows
```

#### 5.2. Iniciar o worker do Celery

```bash
celery -A studioflow worker --loglevel=info
```

#### 5.3. Iniciar o scheduler do Celery (opcional)

```bash
# Em outro terminal
celery -A studioflow beat --loglevel=info
```

## Instalação com Docker

### 1. Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+

### 2. Configuração

#### 2.1. Criar arquivo de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados
POSTGRES_DB=studioflow_db
POSTGRES_USER=studioflow_user
POSTGRES_PASSWORD=senha_super_segura
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django
DJANGO_SECRET_KEY=sua-chave-secreta-muito-longa
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Redis
REDIS_URL=redis://redis:6379/0

# URLs
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:5000
```

#### 2.2. Executar com Docker Compose

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

#### 2.3. Executar migrações

```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

#### 2.4. Acessar a aplicação

- Frontend: `http://localhost:5000`
- Backend: `http://localhost:8000`
- Admin: `http://localhost:8000/admin/`

### 3. Comandos úteis do Docker

```bash
# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Remover volumes (cuidado: apaga dados)
docker-compose down -v

# Reconstruir apenas um serviço
docker-compose build frontend
docker-compose up -d frontend

# Executar comandos no container
docker-compose exec backend python manage.py shell
docker-compose exec frontend npm run build
```

## Configuração para Produção

### 1. Configurações de Segurança

#### 1.1. Variáveis de ambiente de produção

```env
# Django
DEBUG=False
SECRET_KEY=chave-extremamente-segura-e-longa
ALLOWED_HOSTS=seu-dominio.com,www.seu-dominio.com

# Banco de dados (usar serviço gerenciado)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis (usar serviço gerenciado)
REDIS_URL=redis://host:6379/0

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=sua-api-key

# HTTPS
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True

# CORS
CORS_ALLOWED_ORIGINS=https://seu-dominio.com
CSRF_TRUSTED_ORIGINS=https://seu-dominio.com
```

#### 1.2. Configurações do Next.js

```env
# URLs de produção
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
NEXT_PUBLIC_APP_URL=https://seu-dominio.com

# Desabilitar ferramentas de desenvolvimento
NEXT_PUBLIC_ENABLE_DEVTOOLS=false
NEXT_PUBLIC_LOG_LEVEL=error
```

### 2. Deploy com Docker

#### 2.1. Dockerfile otimizado para produção

```dockerfile
# frontend/Dockerfile.prod
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### 2.2. Docker Compose para produção

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SETTINGS_MODULE=studioflow.settings.production
    depends_on:
      - db
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Configuração do Nginx

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name seu-dominio.com www.seu-dominio.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name seu-dominio.com www.seu-dominio.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /admin/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /static/ {
            proxy_pass http://backend;
        }

        location /media/ {
            proxy_pass http://backend;
        }
    }
}
```

## Verificação da Instalação

### 1. Checklist de Verificação

- [ ] PostgreSQL está rodando e acessível
- [ ] Redis está rodando e acessível
- [ ] Backend Django está rodando na porta 8000
- [ ] Frontend Next.js está rodando na porta 5000
- [ ] Celery worker está ativo (se configurado)
- [ ] Migrações do banco foram executadas
- [ ] Superusuário foi criado
- [ ] Página inicial carrega sem erros
- [ ] Login/registro funcionam
- [ ] API responde corretamente

### 2. Comandos de Teste

```bash
# Testar conexão com PostgreSQL
psql -h localhost -U studioflow_user -d studioflow_db -c "SELECT version();"

# Testar conexão com Redis
redis-cli ping

# Testar API do Django
curl http://localhost:8000/api/v1/health/

# Testar frontend
curl http://localhost:5000/

# Verificar logs do Django
tail -f backend/logs/django.log

# Verificar logs do Next.js
npm run dev -- --verbose
```

### 3. Testes Automatizados

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm run test
npm run test:e2e

# Cobertura de código
npm run test:coverage
```

## Solução de Problemas

### Problemas Comuns

#### 1. Erro de conexão com PostgreSQL

```bash
# Verificar se o PostgreSQL está rodando
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Verificar configurações de conexão
psql -h localhost -U postgres -c "\l"
```

#### 2. Erro de conexão com Redis

```bash
# Verificar se o Redis está rodando
redis-cli ping

# Iniciar Redis se necessário
redis-server
```

#### 3. Erro de CORS no frontend

Verificar configurações no `backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
]
```

#### 4. Erro de migração do Django

```bash
# Resetar migrações (cuidado: apaga dados)
python manage.py migrate --fake-initial

# Ou recriar banco
dropdb studioflow_db
createdb studioflow_db
python manage.py migrate
```

#### 5. Erro de dependências do Node.js

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Logs e Debugging

#### 1. Configurar logs detalhados

```python
# backend/settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

#### 2. Debug do Next.js

```bash
# Executar com debug
DEBUG=* npm run dev

# Ou apenas Next.js
DEBUG=next:* npm run dev
```

## Manutenção

### 1. Backup

```bash
# Backup do PostgreSQL
pg_dump -h localhost -U studioflow_user studioflow_db > backup.sql

# Backup de arquivos de mídia
tar -czf media_backup.tar.gz backend/media/
```

### 2. Atualizações

```bash
# Atualizar dependências do Python
pip install --upgrade -r requirements.txt

# Atualizar dependências do Node.js
npm update

# Executar migrações após atualizações
python manage.py migrate
```

### 3. Monitoramento

```bash
# Verificar uso de recursos
top
htop
df -h

# Verificar logs de erro
tail -f /var/log/nginx/error.log
tail -f backend/logs/django.log
```

## Suporte

Para problemas de instalação:

- **Documentação**: [https://docs.studioflow.com](https://docs.studioflow.com)
- **GitHub Issues**: [Reportar problemas](https://github.com/seu-usuario/studioflow/issues)
- **Discord**: [#installation-help](https://discord.gg/studioflow)
- **Email**: install-support@studioflow.com

---

**Próximos passos**: Após a instalação, consulte o [Guia de Uso](usage.md) para aprender a usar o sistema.