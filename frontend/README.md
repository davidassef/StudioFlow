# StudioFlow Frontend

Aplicação frontend do StudioFlow - Sistema de gerenciamento de estúdios de música.

**📅 Última atualização:** 24 de Julho de 2025 - 23:59  
**🔄 Status:** Em desenvolvimento ativo

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas
- **Radix UI** - Componentes acessíveis

## 📦 Instalação e Configuração

### 🚀 **Opção Recomendada: Bun (3x mais rápido)**

```bash
# Instalar Bun (se não tiver)
curl -fsSL https://bun.sh/install | bash

# Usar script otimizado (recomendado)
./dev.sh

# Ou usar diretamente
bun install
bun run dev
```

### 📦 **Opção Alternativa: npm**

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### ⚡ **Performance Comparada**

| Comando | npm | Bun | Melhoria |
|---------|-----|-----|----------|
| `install` | ~5s | ~27s¹ | - |
| `build` | ~68s | ~19s | **72% mais rápido** |
| `dev` | Lento | **Muito mais rápido** | ~3x |

¹ *Primeira instalação com migração de lockfile*

### 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento com Bun (recomendado)
./dev.sh dev          # Inicia servidor dev
./dev.sh build        # Build otimizado
./dev.sh install      # Instala dependências
./dev.sh clean        # Limpa cache

# Scripts npm tradicionais
npm run dev           # Servidor desenvolvimento
npm run build         # Build produção
npm run start         # Servidor produção
npm run lint          # Linting
```

### ⚙️ **Configurações de Performance**

O projeto inclui otimizações automáticas:

- **Webpack**: Code splitting otimizado
- **SWC**: Compilação ultra-rápida
- **PWA**: Service Worker inteligente
- **Bundle**: Separação de vendors e Radix UI

Para desenvolvimento ainda mais rápido:
```bash
# Desabilitar PWA em desenvolvimento
echo "NEXT_PUBLIC_ENABLE_PWA=false" >> .env.local

# Desabilitar telemetria
echo "NEXT_TELEMETRY_DISABLED=1" >> .env.local
```

## 🧪 Testes

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npx jest --coverage
```

### Status Atual dos Testes

- **Data da Análise:** 24 de Julho de 2025 - 23:59
- **Total de Testes:** 160
- **Testes Passando:** 15 (9.4%)
- **Cobertura de Código:** 21.81%
- **Meta de Cobertura:** 85%

📊 **Relatório Detalhado:** [TESTE_STATUS.md](./TESTE_STATUS.md)

### Componentes Testados

✅ **Funcionais:**
- LoginPage (6/6 testes)
- Input Component
- Utils

⚠️ **Em Desenvolvimento:**
- LocationService (7/15 testes)
- AuthContext (cobertura parcial)

❌ **Pendentes:**
- BookingStore
- StudioStore
- Button Component
- Hooks customizados

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── login/             # Página de login
│   └── ...
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de interface
│   ├── location/         # Componentes de localização
│   └── ...
├── contexts/             # Contextos React
├── hooks/                # Hooks customizados
├── lib/                  # Utilitários e configurações
├── stores/               # Stores Zustand
└── __tests__/            # Testes globais
```

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:5100
```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento (porta 5100)
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Linting com ESLint
- `npm test` - Executar testes
- `npm run test:watch` - Testes em modo watch

## 📋 Funcionalidades

### Implementadas
- ✅ Sistema de autenticação
- ✅ Página de login com validação
- ✅ Componentes de UI básicos
- ✅ Gerenciamento de estado com Zustand
- ✅ Serviços de localização

### Em Desenvolvimento
- 🔄 Sistema de reservas
- 🔄 Gerenciamento de estúdios
- 🔄 Dashboard principal
- 🔄 Perfil de usuário

### Planejadas
- 📋 Sistema de notificações
- 📋 Chat em tempo real
- 📋 Sistema de pagamentos
- 📋 Relatórios e analytics

## 🧪 Estratégia de Testes

### Tipos de Testes
1. **Testes Unitários** - Componentes isolados
2. **Testes de Integração** - Fluxos completos
3. **Testes de Acessibilidade** - Conformidade WCAG

### Ferramentas de Teste
- **Jest** - Framework de testes
- **Testing Library** - Testes de componentes React
- **MSW** - Mock de APIs (planejado)
- **Playwright** - Testes E2E (planejado)

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
# Dockerfile incluído no projeto
docker build -t studioflow-frontend .
docker run -p 3000:3000 studioflow-frontend
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- **ESLint** - Linting automático
- **Prettier** - Formatação de código
- **TypeScript** - Tipagem obrigatória
- **Conventional Commits** - Padrão de commits

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@studioflow.com
- 💬 Discord: [StudioFlow Community](https://discord.gg/studioflow)
- 📖 Documentação: [docs.studioflow.com](https://docs.studioflow.com)

---

**Desenvolvido com ❤️ pela equipe StudioFlow**  
**Projeto iniciado em:** 22 de Julho de 2025  
**Última atualização:** 24 de Julho de 2025 - 23:59