# 🚀 Guia de Deploy - StudioFlow

**Versão:** 1.0  
**Última Atualização:** 24 de Julho de 2025  
**Tempo de Leitura:** 15 minutos

---

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🔧 Pré-requisitos](#-pré-requisitos)
- [🐳 Deploy com Docker](#-deploy-com-docker)
- [☁️ Deploy em Cloud](#️-deploy-em-cloud)
- [🖥️ Deploy em VPS](#️-deploy-em-vps)
- [🔒 Configurações de Segurança](#-configurações-de-segurança)
- [📊 Monitoramento](#-monitoramento)
- [🔄 CI/CD](#-cicd)
- [🆘 Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

Este guia cobre as diferentes estratégias de deploy do StudioFlow, desde ambientes de desenvolvimento até produção em larga escala.

### 🏗️ Arquitetura de Deploy

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Nginx/Cloudflare]
    end
    
    subgraph "Frontend"
        FE1[Next.js App 1]
        FE2[Next.js App 2]
    end
    
    subgraph "Backend"
        BE1[Django API 1]
        BE2[Django API 2]
    end
    
    subgraph "Database"
        DB[(PostgreSQL)]
        REDIS[(Redis Cache)]
    end
    
    subgraph "Storage"
        S3[Object Storage]
    end
    
    LB --> FE1
    LB --> FE2
    FE1 --> BE1
    FE2 --> BE2
    BE1 --> DB
    BE2 --> DB
    BE1 --> REDIS
    BE2 --> REDIS
    BE1 --> S3
    BE2 --> S3
```

### 📊 Comparação de Estratégias

| Estratégia | Complexidade | Custo | Escalabilidade | Tempo Setup |
|------------|--------------|-------|----------------|-------------|
| **Docker Local** | ⭐ Baixa | 💰 Gratuito | ⚡ Limitada | 15 min |
| **VPS Simples** | ⭐⭐ Média | 💰💰 $10-50/mês | ⚡⚡ Média | 1-2 horas |
| **Cloud Managed** | ⭐⭐⭐ Alta | 💰💰💰 $50-200/mês | ⚡⚡⚡ Alta | 2-4 horas |
| **Kubernetes** | ⭐⭐⭐⭐ Muito Alta | 💰💰💰💰 $100+/mês | ⚡⚡⚡⚡ Muito Alta | 1-2 dias |

---

## 🔧 Pré-requisitos

### 🛠️ Ferramentas Necessárias

```bash
# Verificar instalações
docker --version          # >= 20.10
docker-compose --version  # >= 2.0
git --version            # >= 2.30
```

### 🔑 Variáveis de Ambiente

Crie um arquivo `.env.production`:

```env
# === CONFIGURAÇÕES GERAIS ===
DJANGO_SETTINGS_MODULE=backend.settings.production
DEBUG=False
SECRET_KEY=sua_chave_secreta_super_segura_aqui
ALLOWED_HOSTS=seudominio.com,www.seudominio.com

# === BANCO DE DADOS ===
DATABASE_URL=postgresql://user:password@db:5432/studioflow
DB_NAME=studioflow
DB_USER=studioflow_user
DB_PASSWORD=senha_super_segura
DB_HOST=db
DB_PORT=5432

# === CACHE ===
REDIS_URL=redis://redis:6379/0
CACHE_TTL=3600

# === EMAIL ===
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu_email@gmail.com
EMAIL_HOST_PASSWORD=sua_senha_app
DEFAULT_FROM_EMAIL=noreply@seudominio.com

# === STORAGE ===
USE_S3=True
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_STORAGE_BUCKET_NAME=studioflow-media
AWS_S3_REGION_NAME=us-east-1

# === CORS ===
CORS_ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
CORS_ALLOW_CREDENTIALS=True

# === FRONTEND ===
NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NEXTAUTH_SECRET=sua_chave_nextauth
NEXTAUTH_URL=https://seudominio.com

# === MONITORAMENTO ===
SENTRY_DSN=https://sua_sentry_dsn
SENTRY_ENVIRONMENT=production
```

### 🔒 Checklist de Segurança

- [ ] **Senhas fortes** para banco e Redis
- [ ] **SECRET_KEY** único e complexo
- [ ] **DEBUG=False** em produção
- [ ] **ALLOWED_HOSTS** configurado corretamente
- [ ] **SSL/TLS** habilitado
- [ ] **Firewall** configurado
- [ ] **Backup** automatizado

---

## 🐳 Deploy com Docker

### 🚀 Deploy Rápido (Recomendado)

#### 1️⃣ Preparação
```bash
# Clone o repositório
git clone https://github.com/studioflow/studioflow.git
cd studioflow

# Configure as variáveis
cp .env.example .env.production
# Edite .env.production com suas configurações
```

#### 2️⃣ Docker Compose para Produção

Crie `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # === BANCO DE DADOS ===
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - studioflow-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 30s
      timeout: 10s
      retries: 3

  # === CACHE ===
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - studioflow-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # === BACKEND ===
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile.prod
    restart: unless-stopped
    env_file:
      - .env.production
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    networks:
      - studioflow-network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # === FRONTEND ===
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile.prod
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    restart: unless-stopped
    env_file:
      - .env.production
    networks:
      - studioflow-network
    depends_on:
      backend:
        condition: service_healthy

  # === PROXY REVERSO ===
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - static_volume:/var/www/static:ro
      - media_volume:/var/www/media:ro
    networks:
      - studioflow-network
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
  static_volume:
  media_volume:

networks:
  studioflow-network:
    driver: bridge
```

#### 3️⃣ Configuração do Nginx

Crie `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }
    
    upstream frontend {
        server frontend:3000;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name seudominio.com www.seudominio.com;
        return 301 https://$server_name$request_uri;
    }
    
    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name seudominio.com www.seudominio.com;
        
        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # API Routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Admin Routes
        location /admin/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Static Files
        location /static/ {
            alias /var/www/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Media Files
        location /media/ {
            alias /var/www/media/;
            expires 1y;
            add_header Cache-Control "public";
        }
        
        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### 4️⃣ Deploy

```bash
# Build e start dos serviços
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Executar migrações
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Criar superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Coletar arquivos estáticos
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

### 🔄 Scripts de Automação

Crie `scripts/deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Iniciando deploy do StudioFlow..."

# Backup antes do deploy
echo "📦 Criando backup..."
./scripts/backup.sh

# Pull das últimas mudanças
echo "📥 Atualizando código..."
git pull origin main

# Build das imagens
echo "🔨 Building imagens..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Deploy
echo "🚀 Fazendo deploy..."
docker-compose -f docker-compose.prod.yml up -d

# Migrações
echo "🗄️ Executando migrações..."
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate

# Coletar estáticos
echo "📁 Coletando arquivos estáticos..."
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput

# Health check
echo "🏥 Verificando saúde dos serviços..."
sleep 30
./scripts/health-check.sh

echo "✅ Deploy concluído com sucesso!"
```

---

## ☁️ Deploy em Cloud

### 🌊 DigitalOcean App Platform

#### 1️⃣ Configuração

Crie `.do/app.yaml`:

```yaml
name: studioflow
services:
- name: backend
  source_dir: backend
  github:
    repo: seu-usuario/studioflow
    branch: main
  run_command: gunicorn backend.wsgi:application --bind 0.0.0.0:8000
  environment_slug: python
  instance_count: 2
  instance_size_slug: basic-xxs
  envs:
  - key: DJANGO_SETTINGS_MODULE
    value: backend.settings.production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: REDIS_URL
    value: ${redis.REDIS_URL}
  health_check:
    http_path: /health/

- name: frontend
  source_dir: frontend
  github:
    repo: seu-usuario/studioflow
    branch: main
  build_command: npm run build
  run_command: npm start
  environment_slug: node-js
  instance_count: 2
  instance_size_slug: basic-xxs
  envs:
  - key: NEXT_PUBLIC_API_URL
    value: https://studioflow-backend.ondigitalocean.app

databases:
- name: db
  engine: PG
  version: "15"
  size: basic-xs
  num_nodes: 1

- name: redis
  engine: REDIS
  version: "7"
  size: basic-xs
  num_nodes: 1
```

#### 2️⃣ Deploy

```bash
# Instalar CLI
sudo snap install doctl

# Autenticar
doctl auth init

# Deploy
doctl apps create --spec .do/app.yaml
```

### ☁️ AWS (Elastic Beanstalk)

#### 1️⃣ Configuração

Crie `.ebextensions/01-packages.config`:

```yaml
packages:
  yum:
    postgresql15-devel: []
    git: []

option_settings:
  aws:elasticbeanstalk:application:environment:
    DJANGO_SETTINGS_MODULE: backend.settings.production
    PYTHONPATH: /var/app/current:$PYTHONPATH
  aws:elasticbeanstalk:container:python:
    WSGIPath: backend.wsgi:application
```

#### 2️⃣ Deploy

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init studioflow

# Criar ambiente
eb create production

# Deploy
eb deploy
```

### 🔵 Azure Container Instances

#### 1️⃣ Configuração

Crie `azure/container-group.yaml`:

```yaml
apiVersion: 2021-03-01
location: eastus
name: studioflow
properties:
  containers:
  - name: backend
    properties:
      image: studioflow/backend:latest
      resources:
        requests:
          cpu: 1
          memoryInGb: 2
      ports:
      - port: 8000
      environmentVariables:
      - name: DJANGO_SETTINGS_MODULE
        value: backend.settings.production
  
  - name: frontend
    properties:
      image: studioflow/frontend:latest
      resources:
        requests:
          cpu: 1
          memoryInGb: 1
      ports:
      - port: 3000
  
  osType: Linux
  restartPolicy: Always
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: 80
    - protocol: tcp
      port: 443
type: Microsoft.ContainerInstance/containerGroups
```

#### 2️⃣ Deploy

```bash
# Login
az login

# Deploy
az container create --resource-group studioflow --file azure/container-group.yaml
```

---

## 🖥️ Deploy em VPS

### 🐧 Ubuntu 22.04 LTS

#### 1️⃣ Preparação do Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y python3.11 python3.11-venv python3-pip nodejs npm postgresql postgresql-contrib nginx redis-server git curl

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2️⃣ Configuração do Banco

```bash
# Configurar PostgreSQL
sudo -u postgres psql
```

```sql
CREATE DATABASE studioflow;
CREATE USER studioflow_user WITH PASSWORD 'senha_super_segura';
GRANT ALL PRIVILEGES ON DATABASE studioflow TO studioflow_user;
ALTER USER studioflow_user CREATEDB;
\q
```

#### 3️⃣ Deploy da Aplicação

```bash
# Clone do projeto
cd /opt
sudo git clone https://github.com/studioflow/studioflow.git
sudo chown -R $USER:$USER studioflow
cd studioflow

# Configurar variáveis
cp .env.example .env.production
# Editar .env.production

# Deploy com Docker
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 4️⃣ Configuração do Nginx

```bash
# Remover configuração padrão
sudo rm /etc/nginx/sites-enabled/default

# Criar configuração do StudioFlow
sudo nano /etc/nginx/sites-available/studioflow
```

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/studioflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5️⃣ SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Auto-renovação
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 🔄 Automação com Systemd

Crie `/etc/systemd/system/studioflow.service`:

```ini
[Unit]
Description=StudioFlow Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/studioflow
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Ativar serviço
sudo systemctl enable studioflow
sudo systemctl start studioflow
```

---

## 🔒 Configurações de Segurança

### 🛡️ Firewall (UFW)

```bash
# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Verificar status
sudo ufw status verbose
```

### 🔐 Fail2Ban

```bash
# Instalar
sudo apt install fail2ban

# Configurar
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 600
bantime = 7200
```

### 🔒 Hardening do Sistema

```bash
# Desabilitar login root
sudo passwd -l root

# Configurar SSH
sudo nano /etc/ssh/sshd_config
```

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222
```

```bash
# Restart SSH
sudo systemctl restart ssh

# Atualizar UFW
sudo ufw delete allow ssh
sudo ufw allow 2222
```

---

## 📊 Monitoramento

### 📈 Prometheus + Grafana

#### 1️⃣ Docker Compose para Monitoramento

Crie `docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources

  node-exporter:
    image: prom/node-exporter:latest
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

volumes:
  prometheus_data:
  grafana_data:
```

#### 2️⃣ Configuração do Prometheus

Crie `monitoring/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'studioflow-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics/'

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:9113']
```

### 📊 Dashboard Grafana

Crie `monitoring/grafana/dashboards/studioflow.json`:

```json
{
  "dashboard": {
    "title": "StudioFlow Monitoring",
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "CPU Usage %"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
            "legendFormat": "Memory Usage %"
          }
        ]
      },
      {
        "title": "HTTP Requests",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(django_http_requests_total[5m])",
            "legendFormat": "Requests/sec"
          }
        ]
      }
    ]
  }
}
```

### 🚨 Alertas

Crie `monitoring/alerts.yml`:

```yaml
groups:
- name: studioflow
  rules:
  - alert: HighCPUUsage
    expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage detected"
      description: "CPU usage is above 80% for more than 5 minutes"

  - alert: HighMemoryUsage
    expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High memory usage detected"
      description: "Memory usage is above 90% for more than 5 minutes"

  - alert: ServiceDown
    expr: up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Service is down"
      description: "{{ $labels.instance }} has been down for more than 1 minute"
```

---

## 🔄 CI/CD

### 🐙 GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        python manage.py test
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/studioflow
          git pull origin main
          docker-compose -f docker-compose.prod.yml down
          docker-compose -f docker-compose.prod.yml up -d --build
          docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate
          docker-compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput
```

### 🦊 GitLab CI

Crie `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

test-backend:
  stage: test
  image: python:3.11
  services:
    - postgres:15
  variables:
    POSTGRES_DB: test_studioflow
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
    DATABASE_URL: postgresql://test_user:test_pass@postgres:5432/test_studioflow
  script:
    - cd backend
    - pip install -r requirements.txt
    - python manage.py test

test-frontend:
  stage: test
  image: node:18
  script:
    - cd frontend
    - npm ci
    - npm run build
    - npm test

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA backend/
    - docker build -t $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA frontend/
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $DEPLOY_USER@$DEPLOY_HOST "cd /opt/studioflow && ./scripts/deploy.sh"
  only:
    - main
```

---

## 🆘 Troubleshooting

### 🔍 Diagnóstico Rápido

#### 1️⃣ Verificar Status dos Serviços

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs

# Systemd
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis

# Processos
ps aux | grep -E '(python|node|nginx|postgres|redis)'
```

#### 2️⃣ Verificar Conectividade

```bash
# Portas
netstat -tlnp | grep -E ':(80|443|8000|3000|5432|6379)'

# DNS
nslookup seudominio.com

# SSL
openssl s_client -connect seudominio.com:443 -servername seudominio.com
```

#### 3️⃣ Logs Importantes

```bash
# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Sistema
sudo journalctl -f
sudo tail -f /var/log/syslog

# Docker
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### ❌ Problemas Comuns

#### "502 Bad Gateway"

**Possíveis Causas:**
- Backend não está rodando
- Configuração incorreta do proxy
- Firewall bloqueando conexões

**Soluções:**
```bash
# Verificar backend
curl http://localhost:8000/health/

# Verificar configuração Nginx
sudo nginx -t

# Reiniciar serviços
docker-compose -f docker-compose.prod.yml restart backend
sudo systemctl restart nginx
```

#### "Database connection failed"

**Soluções:**
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql
psql -h localhost -U studioflow_user -d studioflow

# Verificar variáveis de ambiente
docker-compose -f docker-compose.prod.yml exec backend env | grep DATABASE

# Reiniciar banco
docker-compose -f docker-compose.prod.yml restart db
```

#### "SSL certificate error"

**Soluções:**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew --dry-run
sudo certbot renew

# Verificar configuração Nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### "Out of memory"

**Soluções:**
```bash
# Verificar uso de memória
free -h
docker stats

# Limpar cache
docker system prune -a
sudo apt autoremove
sudo apt autoclean

# Configurar swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 🔧 Scripts de Diagnóstico

Crie `scripts/health-check.sh`:

```bash
#!/bin/bash

echo "🏥 StudioFlow Health Check"
echo "========================="

# Verificar serviços Docker
echo "📦 Docker Services:"
docker-compose -f docker-compose.prod.yml ps

# Verificar conectividade
echo "\n🌐 Connectivity:"
echo "Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "FAIL")"
echo "Backend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health/ || echo "FAIL")"
echo "Database: $(docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U studioflow_user -d studioflow && echo "OK" || echo "FAIL")"
echo "Redis: $(docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping || echo "FAIL")"

# Verificar recursos
echo "\n💻 Resources:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
echo "Disk: $(df -h / | awk 'NR==2{printf "%s", $5}')"

# Verificar logs de erro
echo "\n🚨 Recent Errors:"
docker-compose -f docker-compose.prod.yml logs --tail=10 | grep -i error || echo "No recent errors"

echo "\n✅ Health check completed"
```

---

## 📚 Recursos Adicionais

### 📖 Documentação
- [🏗️ Arquitetura](./02-system-architecture.md)
- [⚙️ Instalação](./06-installation-guide.md)
- [🤝 Contribuição](./03-contributing-guide.md)
- [📊 Status do Projeto](./project-status.md)

### 🔗 Links Úteis
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PostgreSQL Tuning](https://pgtune.leopard.in.ua/)

### 🆘 Suporte
- 🐛 [GitHub Issues](https://github.com/studioflow/studioflow/issues)
- 💬 [Discussions](https://github.com/studioflow/studioflow/discussions)
- 📧 [Email](mailto:suporte@studioflow.com)

---

**🚀 Deploy realizado com sucesso?**

Compartilhe sua experiência e ajude outros desenvolvedores!

**📞 Precisa de ajuda?**

Nossa comunidade está sempre pronta para ajudar. Não hesite em pedir suporte!

---

**⚡ Última atualização:** 24 de Julho de 2025  
**👥 Contribuidores:** Equipe StudioFlow  
**📄 Licença:** MIT