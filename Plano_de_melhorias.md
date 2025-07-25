# Especificação Funcional: StudioFlow v2.0

## 1. Visão Geral

O StudioFlow é uma plataforma que conecta clientes que precisam de estúdios musicais com donos de estúdios que querem alugar suas salas. É um marketplace bilateral onde:

- Clientes podem descobrir, comparar e reservar estúdios próximos.
- Donos de estúdios podem gerenciar suas reservas, salas e faturamento.

## 2. Status de Implementação

### ✅ Funcionalidades Implementadas

#### Backend (Django + PostgreSQL)
- **Sistema de Autenticação Completo**
  - Login e registro de usuários
  - Autenticação JWT com refresh tokens
  - Perfis de usuário (Admin, Cliente)
  - Sistema de permissões

- **Gestão de Salas**
  - Modelo `Sala` com campos: nome, capacidade, preço_hora, descrição, disponibilidade
  - CRUD completo via API REST
  - Relacionamento com agendamentos

- **Sistema de Agendamentos**
  - Modelo `Agendamento` com status (Pendente, Confirmado, Cancelado, Concluído)
  - Verificação automática de conflitos
  - Cálculo automático de valor total
  - Filtros por status, sala e cliente
  - Endpoint de verificação de disponibilidade

- **API RESTful Completa**
  - Endpoints para usuários, salas e agendamentos
  - Documentação automática
  - Paginação e filtros
  - Autenticação JWT

#### Frontend (Next.js + TypeScript)
- **Sistema de Autenticação**
  - Páginas de login e registro funcionais
  - Context de autenticação com JWT
  - Proteção de rotas
  - Gerenciamento de estado de usuário

- **Interface de Usuário**
  - Design system com Tailwind CSS
  - Componentes reutilizáveis (Button, Input, Card)
  - Layout responsivo
  - Temas e estilização moderna

- **Dashboard Avançado**
  - Dashboard Overview com dados reais do backend
  - Advanced Dashboard com gráficos interativos
  - Estados de carregamento e esqueletos
  - Insights inteligentes e métricas em tempo real
  - Integração completa com stores (Zustand)

- **Testes**
  - Testes unitários para componentes principais
  - Cobertura de testes para LoginPage
  - Configuração de ambiente de testes

### 🔄 Em Desenvolvimento
- Sistema de reservas (frontend)
- Gerenciamento de estúdios (frontend)
- Perfil de usuário

### 📋 Planejadas
- Sistema de notificações
- Chat em tempo real
- Sistema de pagamentos
- Relatórios e analytics

## 3. User Stories

### Cliente:
Como Cliente, eu quero poder buscar estúdios próximos a mim ou em uma localização específica.

Como Cliente, eu quero ver detalhes completos de um estúdio (fotos, preços, equipamentos, avaliações) antes de fazer uma reserva.

Como Cliente, eu quero poder solicitar uma reserva para uma data e horário específicos.

Como Cliente, eu quero receber notificações sobre o status da minha reserva (confirmada, cancelada).

Como Cliente, eu quero ter um histórico das minhas reservas passadas e futuras.

### Estúdio:
Como Estúdio, eu quero poder cadastrar meu negócio com todos os detalhes (salas, preços, equipamentos) para atrair clientes.

Como Estúdio, eu quero ter um painel de controle para ver e gerenciar todos os meus agendamentos em um calendário.

Como Estúdio, eu quero poder confirmar ou cancelar solicitações de reserva feitas por clientes.

Como Estúdio, eu quero ter uma visão geral do meu faturamento e da ocupação das minhas salas.

## 4. Fluxos de Usuário

### 4.1. Fluxo do Cliente

#### Página Principal (Feed de Descoberta) 📋 *Planejada*
A página principal para o cliente logado será um portal de descoberta.

**Funcionalidades:**
- **Barra de Busca e Filtros:** Busca por texto (nome, bairro, rua), filtro por GPS ("mais próximos"), status ("abertos agora") e disponibilidade
- **Área de Listagem:** Exibição dos estúdios em formato de lista ou grade, com informações essenciais: foto, nome, status (aberto/fechado), faixa de preço e avaliação

#### Página de Detalhes do Estúdio 📋 *Planejada*
Ao clicar em um estúdio, o cliente verá seu perfil público completo.

**Seções:**
- **Informações Gerais:** Galeria de fotos, endereço, mapa, contato, horários
- **Salas e Preços:** Lista detalhada de cada sala com preço/hora e equipamentos inclusos
- **Serviços Adicionais:** Lista de aluguel de equipamentos, serviços de técnico de som, etc.
- **Botão de Ação (CTA):** "Solicitar Reserva" que inicia o fluxo de agendamento

#### Sistema de Agendamento ✅ *Implementado (Backend)* 🔄 *Em Desenvolvimento (Frontend)*
- Seleção de data e horário
- Verificação de disponibilidade em tempo real
- Cálculo automático de valor
- Confirmação de reserva

### 4.2. Fluxo do Estúdio

Quando um usuário logado como Estúdio acessa a plataforma, ele é direcionado para o Painel de Controle (Dashboard).

#### Cadastro e Perfil do Estúdio 📋 *Planejado*
Formulário completo para configuração inicial:

**Informações Básicas:**
- Nome do estúdio, CNPJ, endereço, telefone
- Horário de funcionamento
- Foto de perfil, galeria de fotos, descrição

**Gestão de Salas:** ✅ *Implementado (Backend)* 📋 *Planejado (Frontend)*
- Adicionar, editar e remover salas
- Nome da Sala (ex: "Sala A - Gravação Vocal")
- Preço por Hora (com opções diferenciadas)
- Lista de Equipamentos Fixos
- Capacidade e disponibilidade

**Gestão de Equipamentos:** 📋 *Planejado*
- Cadastro de equipamentos para aluguel
- Preços por sessão/hora
- Disponibilidade

**Regras e Políticas:** 📋 *Planejado*
- Regras da casa
- Política de cancelamento
- Termos de uso

#### Painel de Controle (Dashboard) ✅ *Implementado*
Central de operações do estúdio:

**Visão Geral:** ✅ *Implementado*
- Dashboard Overview com dados reais do backend
- Métricas em tempo real: Faturamento, Taxa de Ocupação, Novos Clientes
- Próximos agendamentos (lista das próximas 5 reservas)
- Solicitações pendentes de aprovação
- Estados de carregamento com esqueletos
- Botão de atualização manual
- Saudação personalizada por horário

**Dashboard Avançado:** ✅ *Implementado*
- Gráficos interativos de receita mensal
- Análise de agendamentos por dia
- Gráfico de pizza para uso por sala
- Gráfico de barras para uso por horário
- Insights inteligentes e recomendações
- Integração completa com dados reais

**Navegação Principal:**
- **Calendário de Agendamentos:** ✅ *Implementado (Backend)* 🔄 *Em Desenvolvimento (Frontend)*
  - Visão de calendário (semanal/mensal)
  - Agendamentos com cores por status
  - Detalhes, confirmação e cancelamento

- **Gestão de Clientes:** 📋 *Planejado*
  - Lista de clientes com histórico
  - Informações de contato
  - Estatísticas de uso

- **Meu Estúdio:** 📋 *Planejado*
  - Edição do perfil público
  - Configurações gerais

- **Financeiro:** 📋 *Planejado*
  - Relatórios detalhados
  - Filtros por período
  - Extrato de transações

- **Avaliações:** 📋 *Planejado*
  - Visualização de avaliações
  - Resposta a comentários

## 5. Considerações Técnicas e de UX

### 5.1. Funcionalidades Técnicas

#### Notificações 📋 *Planejado*
- **Para Estúdios:** Notificações sobre novas solicitações de reserva
- **Para Clientes:** Notificações sobre status de reserva (confirmada, cancelada)
- **Canais:** E-mail, notificações in-app, SMS (opcional)

#### Performance e UX ✅ *Implementado Parcialmente*
- **Scroll Infinito:** Para lista de estúdios no feed do cliente
- **Estados de Carregamento:** Skeletons e loading states
- **Estados Vazios:** Mensagens informativas quando não há dados
- **Responsividade:** Layout adaptável para desktop, tablet e mobile

### 5.2. Arquitetura Técnica

#### Backend ✅ *Implementado*
- **Framework:** Django 4.x com Django REST Framework
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT com refresh tokens
- **API:** RESTful com documentação automática
- **Testes:** Cobertura de testes unitários e de integração

#### Frontend ✅ *Implementado Parcialmente*
- **Framework:** Next.js 14 com TypeScript
- **Estilização:** Tailwind CSS + Radix UI
- **Estado:** Zustand para gerenciamento de estado
- **Formulários:** React Hook Form + Zod para validação
- **Testes:** Jest + Testing Library

### 5.3. Próximos Passos

#### Prioridade Alta
1. **Sistema de Reservas Frontend** - Fluxo completo de agendamento
2. **Feed de Descoberta** - Listagem e busca de estúdios
3. **Gestão de Salas Frontend** - Interface CRUD para salas

#### Prioridade Média
1. **Sistema de Notificações** - E-mail e in-app
2. **Gestão de Equipamentos** - Aluguel de equipamentos adicionais
3. **Sistema de Avaliações** - Feedback e ratings

#### Prioridade Baixa
1. **Chat em Tempo Real** - Comunicação entre cliente e estúdio
2. **Sistema de Pagamentos** - Integração com gateways de pagamento
3. **Relatórios Avançados** - Analytics e métricas detalhadas

---

**Última atualização:** Julho 2025  
**Status do Projeto:** Em desenvolvimento ativo  
**Cobertura de Funcionalidades:** ~50% implementado

### 📊 Melhorias Recentes (Julho 2025)

#### Dashboard Completo ✅ *Implementado*
- **DashboardOverview.tsx:** Conectado com dados reais do backend
- **AdvancedDashboard.tsx:** Gráficos interativos com Recharts
- **Estados de Carregamento:** Skeleton components para melhor UX
- **Integração com Stores:** useBookingStore, useStudioStore, useAuthStore
- **Cálculos em Tempo Real:** Função calculateDashboardData
- **Insights Inteligentes:** Análise automática de dados e recomendações
- **Remoção de Dados Mockados:** Substituição completa por dados reais
- **Tipagem TypeScript:** Interfaces robustas para todos os dados