# ❓ FAQ - Perguntas Frequentes

**Versão:** 2.0  
**Última Atualização:** 24 de Julho de 2025  
**Tempo de Leitura:** 10 minutos

---

## 📋 Índice Rápido

### 🎯 Navegação por Categoria
- [🌟 Geral](#-geral) - Informações básicas sobre o StudioFlow
- [🔧 Instalação](#-instalação) - Setup e configuração
- [⚡ Funcionalidades](#-funcionalidades) - Como usar as features
- [🔧 Problemas Técnicos](#-problemas-técnicos) - Troubleshooting
- [🤝 Contribuição](#-contribuição) - Como colaborar
- [📞 Suporte](#-suporte) - Onde obter ajuda
- [🔮 Roadmap](#-roadmap) - Futuro do projeto

### 🔍 Busca Rápida
- [Como instalar?](#como-instalar-o-studioflow)
- [Erro de CORS](#erro-de-cors-blocked-como-resolver)
- [Como contribuir?](#como-posso-contribuir)
- [Resetar senha](#como-resetar-a-senha-do-admin)
- [Backup de dados](#como-fazer-backup-dos-dados)

---

## Geral

### O que é o StudioFlow?

O StudioFlow é um sistema completo de gestão para estúdios musicais que permite gerenciar agendamentos, clientes, salas, finanças e muito mais através de uma interface web moderna e intuitiva.

### Para quem é destinado o StudioFlow?

O sistema é ideal para:
- Proprietários de estúdios musicais
- Gerentes de estúdios
- Produtores musicais
- Empresas de aluguel de salas de ensaio
- Escolas de música
- Centros culturais com espaços musicais

### Quais são os principais benefícios?

- **Organização**: Centralize todas as informações em um só lugar
- **Eficiência**: Automatize processos manuais
- **Controle Financeiro**: Acompanhe receitas e despesas em tempo real
- **Experiência do Cliente**: Ofereça um serviço mais profissional
- **Relatórios**: Tome decisões baseadas em dados
- **Mobilidade**: Acesse de qualquer dispositivo com internet

### O StudioFlow funciona offline?

Não, o StudioFlow é uma aplicação web que requer conexão com internet. No entanto, estamos desenvolvendo funcionalidades offline para versões futuras.

### Posso personalizar o sistema para meu estúdio?

Sim! O StudioFlow oferece várias opções de personalização:
- Configuração de horários de funcionamento
- Preços personalizados por sala e horário
- Campos customizados para clientes
- Relatórios personalizados
- Temas e cores (em desenvolvimento)

## Instalação e Configuração

### Quais são os requisitos mínimos do sistema?

**Para instalação local:**
- CPU: 2 cores
- RAM: 4GB
- Armazenamento: 10GB livres
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis 6+

**Para uso (cliente):**
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet
- Resolução mínima: 1024x768

### Posso instalar em Windows?

Sim! O StudioFlow é compatível com:
- Windows 10/11
- macOS 10.15+
- Ubuntu 18.04+
- Outras distribuições Linux

### É difícil instalar o sistema?

Não! Oferecemos várias opções:

1. **Docker** (mais fácil): Um comando e está funcionando
2. **Instalação local**: Guia passo a passo detalhado
3. **Cloud**: Versão hospedada (em breve)

### Preciso de conhecimentos técnicos?

Para **usar** o sistema: Não, a interface é intuitiva.

Para **instalar** localmente: Conhecimentos básicos de terminal são úteis, mas nosso guia é bem detalhado.

Para **personalizar**: Conhecimentos de programação podem ser necessários para customizações avançadas.

### Como faço backup dos dados?

O sistema oferece várias opções de backup:

```bash
# Backup automático (configurável)
python manage.py backup_database

# Backup manual do PostgreSQL
pg_dump studioflow_db > backup.sql

# Backup de arquivos
tar -czf media_backup.tar.gz media/
```

### Posso migrar dados de outro sistema?

Sim! Oferecemos ferramentas de importação para:
- Planilhas Excel/CSV
- Outros sistemas de agendamento
- Bancos de dados MySQL/PostgreSQL

Consulte nossa [documentação de migração](migration.md) para detalhes.

## Funcionalidades

### Como funciona o sistema de agendamentos?

O sistema oferece:
- **Calendário visual**: Visualize disponibilidade em tempo real
- **Agendamento rápido**: Poucos cliques para criar uma reserva
- **Conflitos automáticos**: O sistema previne duplas reservas
- **Notificações**: Email/SMS automáticos para clientes
- **Recorrência**: Agendamentos semanais/mensais

### Posso ter diferentes preços por horário?

Sim! O sistema suporta:
- Preços por hora/período
- Preços diferenciados por horário (pico/normal)
- Descontos para clientes VIP
- Promoções temporárias
- Pacotes de horas

### Como funciona o controle de clientes?

O sistema permite:
- **Cadastro completo**: Dados pessoais, preferências, observações
- **Histórico**: Todos os agendamentos anteriores
- **Classificação**: Regular, VIP, Inadimplente, etc.
- **Comunicação**: Envio de emails e SMS
- **Relatórios**: Frequência, fidelidade, valor gasto

### Posso gerenciar múltiplos estúdios?

Sim! O sistema suporta:
- Múltiplos estúdios por conta
- Salas diferentes em cada estúdio
- Relatórios consolidados ou por estúdio
- Usuários com acesso específico por estúdio

### Como funciona o sistema financeiro?

O módulo financeiro inclui:
- **Dashboard**: Métricas em tempo real
- **Receitas**: Controle automático de pagamentos
- **Despesas**: Registro manual de gastos
- **Relatórios**: Faturamento, lucro, tendências
- **Gráficos**: Visualização de performance
- **Exportação**: PDF, Excel para contabilidade

### Posso integrar com sistemas de pagamento?

Atualmente em desenvolvimento. Versões futuras incluirão:
- PIX
- Cartões de crédito/débito
- PayPal
- Mercado Pago
- PagSeguro

### O sistema envia notificações automáticas?

Sim! O sistema pode enviar:
- **Confirmação de agendamento**
- **Lembretes** (24h, 2h antes)
- **Cancelamentos**
- **Alterações de horário**
- **Cobranças em atraso**
- **Relatórios periódicos**

Via email e SMS (configurável).

## Problemas Técnicos

### O sistema está lento, o que fazer?

1. **Verificar conexão**: Teste a velocidade da internet
2. **Limpar cache**: Ctrl+F5 no navegador
3. **Verificar recursos**: CPU/RAM do servidor
4. **Otimizar banco**: Execute `python manage.py optimize_db`
5. **Contatar suporte**: Se o problema persistir

### Erro "Conexão recusada" ao acessar

Verifique se os serviços estão rodando:

```bash
# Backend Django
curl http://localhost:8000/api/health/

# Frontend Next.js
curl http://localhost:5000/

# PostgreSQL
psql -h localhost -U studioflow_user -c "SELECT 1;"

# Redis
redis-cli ping
```

### Como resolver erro de CORS?

Adicione as URLs corretas no `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5000",
    "https://seu-dominio.com",
]
```

### Esqueci a senha do admin, como recuperar?

```bash
cd backend
python manage.py changepassword admin
```

Ou crie um novo superusuário:

```bash
python manage.py createsuperuser
```

### Como resolver erro de migração?

```bash
# Verificar status
python manage.py showmigrations

# Aplicar migrações pendentes
python manage.py migrate

# Em caso de erro, fake a migração
python manage.py migrate --fake-initial
```

### O que fazer se o banco de dados corromper?

1. **Parar o sistema**
2. **Restaurar backup**:
   ```bash
   dropdb studioflow_db
   createdb studioflow_db
   psql studioflow_db < backup.sql
   ```
3. **Verificar integridade**:
   ```bash
   python manage.py check
   ```

### Como aumentar o limite de upload?

No Django (`settings.py`):
```python
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760
```

No Nginx:
```nginx
client_max_body_size 10M;
```

## Segurança

### O sistema é seguro?

Sim! Implementamos várias camadas de segurança:
- **Autenticação JWT** com tokens de acesso e refresh
- **HTTPS obrigatório** em produção
- **Sanitização de dados** para prevenir SQL injection
- **Proteção CSRF** contra ataques cross-site
- **Rate limiting** para prevenir abuso
- **Logs de auditoria** para rastrear ações

### Como são armazenadas as senhas?

As senhas são:
- **Hash com salt** usando algoritmo bcrypt
- **Nunca armazenadas em texto plano**
- **Validação de força** obrigatória
- **Expiração configurável**

### Posso configurar autenticação de dois fatores?

Em desenvolvimento! Versões futuras incluirão:
- SMS
- Aplicativos autenticadores (Google Authenticator)
- Email

### Como funciona o controle de acesso?

O sistema possui três níveis:
- **ADMIN**: Acesso total ao sistema
- **PRESTADOR**: Gerencia seu próprio estúdio
- **CLIENTE**: Acesso limitado para agendamentos

Cada nível tem permissões específicas configuráveis.

### Os dados ficam seguros?

Sim:
- **Backup automático** configurável
- **Criptografia** de dados sensíveis
- **Logs de acesso** para auditoria
- **Conformidade LGPD** (em desenvolvimento)

### Como reportar uma vulnerabilidade?

Envie um email para: security@studioflow.com

Incluindo:
- Descrição detalhada
- Passos para reproduzir
- Impacto potencial
- Sugestões de correção

## Preços e Licenciamento

### O StudioFlow é gratuito?

O código-fonte é **open source** (licença MIT), então você pode:
- Usar gratuitamente
- Modificar o código
- Distribuir suas modificações
- Usar comercialmente

### Existe versão paga?

Planejamos oferecer:
- **Versão Cloud**: Hospedagem gerenciada
- **Suporte Premium**: Suporte prioritário
- **Funcionalidades Avançadas**: Integrações, relatórios, etc.

### Posso vender o sistema modificado?

Sim, a licença MIT permite uso comercial. Apenas mantenha os créditos originais.

### Preciso pagar por atualizações?

Não! Todas as atualizações do código open source são gratuitas.

### Existe limite de usuários/estúdios?

Na versão open source, não há limites técnicos. Os limites dependem apenas da capacidade do seu servidor.

## Suporte

### Como obter suporte?

**Gratuito:**
- [Documentação](https://docs.studioflow.com)
- [GitHub Issues](https://github.com/seu-usuario/studioflow/issues)
- [Discord Community](https://discord.gg/studioflow)
- [Fórum](https://forum.studioflow.com)

**Pago (em breve):**
- Suporte por email
- Suporte por telefone
- Consultoria para implementação
- Treinamento personalizado

### Qual o tempo de resposta?

**Comunidade**: Melhor esforço (geralmente 24-48h)
**Suporte Pago**: SLA definido por plano

### Vocês fazem instalação personalizada?

Sim! Oferecemos:
- **Instalação remota**
- **Configuração personalizada**
- **Migração de dados**
- **Treinamento da equipe**
- **Suporte pós-instalação**

Contate: consulting@studioflow.com

### Como contribuir com o projeto?

1. **Código**: Faça um fork e envie pull requests
2. **Documentação**: Melhore a documentação
3. **Testes**: Reporte bugs e teste novas funcionalidades
4. **Tradução**: Ajude a traduzir para outros idiomas
5. **Divulgação**: Compartilhe com outros estúdios

### Como reportar bugs?

1. **Verifique** se já foi reportado no GitHub
2. **Crie um issue** com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Screenshots/logs se possível
   - Informações do ambiente

### Existe roadmap do projeto?

Sim! Consulte nosso [roadmap público](https://github.com/seu-usuario/studioflow/projects) no GitHub.

**Próximas funcionalidades:**
- App mobile
- Integração com WhatsApp
- Sistema de avaliações
- Relatórios avançados
- Integração com pagamentos
- Multi-idiomas

### Como sugerir novas funcionalidades?

1. **Verifique** se já foi sugerida
2. **Crie um issue** com label "feature request"
3. **Descreva** o problema que resolve
4. **Explique** como deveria funcionar
5. **Vote** em sugestões existentes

### Vocês oferecem treinamento?

Sim! Oferecemos:
- **Documentação completa**
- **Vídeos tutoriais** (em desenvolvimento)
- **Webinars gratuitos**
- **Treinamento personalizado** (pago)

### Como migrar de outro sistema?

Oferecemos ferramentas e suporte para migração de:
- Planilhas Excel/Google Sheets
- Sistemas de agendamento populares
- Bancos de dados personalizados

Consulte nossa [documentação de migração](migration.md) ou contate nosso suporte.

### O sistema funciona em dispositivos móveis?

Sim! O sistema é **responsivo** e funciona bem em:
- Smartphones
- Tablets
- Desktops
- Laptops

Estamos desenvolvendo um **app nativo** para melhor experiência mobile.

### Posso usar o sistema em múltiplos idiomas?

Atualmente apenas em português. Estamos trabalhando em:
- Inglês
- Espanhol
- Francês

Contribuições de tradução são bem-vindas!

### Como manter o sistema atualizado?

```bash
# Verificar atualizações
git fetch origin
git status

# Atualizar código
git pull origin main

# Atualizar dependências
pip install -r requirements.txt
npm install

# Executar migrações
python manage.py migrate

# Reiniciar serviços
sudo systemctl restart studioflow
```

### Existe integração com redes sociais?

Em desenvolvimento:
- **Facebook**: Sincronização de eventos
- **Instagram**: Compartilhamento de sessões
- **WhatsApp**: Notificações
- **Google Calendar**: Sincronização de agendamentos

---

## Não encontrou sua pergunta?

- **Email**: support@studioflow.com
- **Discord**: [#help](https://discord.gg/studioflow)
- **GitHub**: [Criar issue](https://github.com/seu-usuario/studioflow/issues/new)
- **Documentação**: [docs.studioflow.com](https://docs.studioflow.com)

**Última atualização**: Julho 2025