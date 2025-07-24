# StudioFlow Backend

API backend do StudioFlow - Sistema de gerenciamento de estúdios de música.

**📅 Projeto iniciado em:** 22 de Julho de 2025  
**📝 Última atualização:** 24 de Julho de 2025 - 23:59  
**🔄 Status:** Em desenvolvimento ativo

## 🚀 Tecnologias

- **Python 3.11+** - Linguagem principal
- **Django 5.0+** - Framework web
- **Django REST Framework** - API REST
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Pytest** - Testes
- **Docker** - Containerização

## 📦 Instalação

### Pré-requisitos
- Python 3.11+
- PostgreSQL 16+
- pip ou pipenv

### Setup Local

```bash
# Clonar o repositório
git clone https://github.com/davidassef/studioflow.git
cd studioflow/backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Executar servidor
python manage.py runserver
```

### Docker

```bash
# Build da imagem
docker build -t studioflow-backend .

# Executar container
docker run -p 8000:8000 studioflow-backend
```

## 🏗️ Estrutura do Projeto

```
backend/
├── studioflow/           # Configurações do Django
│   ├── settings.py      # Configurações principais
│   ├── urls.py          # URLs principais
│   └── wsgi.py          # WSGI config
├── users/               # App de usuários
│   ├── models.py        # Modelo User customizado
│   ├── serializers.py   # Serializers DRF
│   ├── views.py         # Views da API
│   └── urls.py          # URLs do app
├── studios/             # App de estúdios
│   ├── models.py        # Modelos de estúdio
│   ├── serializers.py   # Serializers DRF
│   ├── views.py         # Views da API
│   └── urls.py          # URLs do app
├── bookings/            # App de reservas
│   ├── models.py        # Modelos de reserva
│   ├── serializers.py   # Serializers DRF
│   ├── views.py         # Views da API
│   └── urls.py          # URLs do app
├── requirements.txt     # Dependências Python
├── manage.py           # CLI do Django
└── Dockerfile          # Container Docker
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/studioflow

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT
JWT_SECRET_KEY=your-jwt-secret-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 📋 API Endpoints

### Autenticação
- `POST /api/auth/register/` - Registro de usuário
- `POST /api/auth/login/` - Login
- `POST /api/auth/refresh/` - Refresh token
- `POST /api/auth/logout/` - Logout

### Usuários
- `GET /api/users/profile/` - Perfil do usuário
- `PUT /api/users/profile/` - Atualizar perfil
- `GET /api/users/` - Listar usuários (admin)

### Estúdios
- `GET /api/studios/` - Listar estúdios
- `POST /api/studios/` - Criar estúdio
- `GET /api/studios/{id}/` - Detalhes do estúdio
- `PUT /api/studios/{id}/` - Atualizar estúdio
- `DELETE /api/studios/{id}/` - Deletar estúdio

### Reservas
- `GET /api/bookings/` - Listar reservas
- `POST /api/bookings/` - Criar reserva
- `GET /api/bookings/{id}/` - Detalhes da reserva
- `PUT /api/bookings/{id}/` - Atualizar reserva
- `DELETE /api/bookings/{id}/` - Cancelar reserva

## 🧪 Testes

```bash
# Executar todos os testes
pytest

# Executar com cobertura
pytest --cov=.

# Executar testes específicos
pytest users/tests.py
pytest studios/tests.py
pytest bookings/tests.py
```

### Status dos Testes
- **Framework:** Pytest + Django Test Client
- **Cobertura:** Em desenvolvimento
- **CI/CD:** Planejado

## 🔐 Autenticação e Segurança

### JWT Authentication
- Tokens de acesso com expiração de 1 hora
- Refresh tokens com expiração de 24 horas
- Blacklist de tokens revogados

### Permissões
- **Admin:** Acesso total ao sistema
- **Studio Owner:** Gerenciar próprios estúdios
- **Client:** Fazer reservas e gerenciar perfil

### Segurança
- CORS configurado para frontend
- Validação de dados com DRF serializers
- Rate limiting (planejado)
- HTTPS em produção

## 🚀 Deploy

### Heroku

```bash
# Instalar Heroku CLI
# Fazer login
heroku login

# Criar app
heroku create studioflow-api

# Configurar variáveis
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False

# Deploy
git push heroku main

# Executar migrações
heroku run python manage.py migrate
```

### Docker Production

```bash
# Build para produção
docker build -t studioflow-backend:prod .

# Executar com docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoramento

### Logs
- Django logging configurado
- Logs estruturados em JSON (produção)
- Integração com Sentry (planejado)

### Métricas
- Health check endpoint: `/health/`
- Métricas de performance (planejado)
- Monitoring com Prometheus (planejado)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- **Black** - Formatação de código
- **Flake8** - Linting
- **isort** - Organização de imports
- **Type hints** - Tipagem quando possível

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@studioflow.com
- 💬 Discord: [StudioFlow Community](https://discord.gg/studioflow)
- 📖 Documentação: [docs.studioflow.com](https://docs.studioflow.com)

---

**Desenvolvido com ❤️ pela equipe StudioFlow**  
**Projeto iniciado em:** 22 de Julho de 2025  
**Última atualização:** 24 de Julho de 2025 - 23:59