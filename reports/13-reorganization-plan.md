# 📋 Guia de Organização e Manutenção do Projeto StudioFlow

**Versão:** 1.0  
**Última Atualização:** 24 de Julho de 2025  
**Tipo:** Documento de Orientação Permanente

---

## 🎯 Propósito

Este documento serve como guia permanente para manter a estrutura do projeto StudioFlow sempre organizada, limpa e profissional. É uma referência obrigatória para agentes de IA, desenvolvedores e mantenedores do projeto.

---

## 📐 Princípios de Organização

### 🏗️ **Estrutura Hierárquica Clara**
- **Raiz do projeto:** Apenas arquivos essenciais e de configuração
- **Pasta `/docs`:** Toda documentação técnica centralizada
- **Pastas de código:** Separadas por responsabilidade (backend, frontend, packages)

### 🧹 **Regra da Raiz Limpa**

#### ✅ **PERMITIDO na Raiz:**
- `README.md` - Documento principal do projeto
- `CHANGELOG.md` - Histórico de versões
- `LICENSE` - Licença do projeto
- `package.json` - Configuração do monorepo
- `docker-compose.yml` - Orquestração de containers
- `.gitignore` - Arquivos ignorados pelo Git
- Pastas de código: `backend/`, `frontend/`, `packages/`, `docker/`

#### ❌ **PROIBIDO na Raiz:**
- Documentos técnicos detalhados (devem ir para `/docs`)
- Arquivos temporários ou de backup
- Documentos específicos de funcionalidades
- Planos de desenvolvimento ou especificações
- Qualquer arquivo `.md` que não seja README ou CHANGELOG

### 📚 **Organização da Documentação**

#### 📁 **Estrutura Obrigatória `/docs`:**
```
docs/
├── 00-documentation-index.md          # Índice principal (obrigatório)
├── 01-api-reference.md                # Documentação da API
├── 02-system-architecture.md          # Arquitetura técnica
├── 03-contributing-guide.md           # Guia de contribuição
├── 04-deployment-guide.md             # Guia de deploy
├── 05-design-system.md                # Sistema de design
├── 06-execution-plan.md               # Plano de execução
├── 07-faq.md                          # Perguntas frequentes
├── 08-frontend-architecture.md        # Arquitetura frontend
├── 09-installation-guide.md           # Guia de instalação
├── 10-supabase-migration.md           # Migração para Supabase
├── 11-supabase-migration-plan.md      # Plano de migração
├── 12-project-structure.md            # Estrutura do projeto
├── 13-reorganization-plan.md          # Plano de reorganização
├── 14-specifications.md               # Especificações do sistema
├── 15-testing-guide.md                # Estratégias de teste
└── pwa/                               # Documentação específica da PWA
```

---

## 🤖 Diretrizes para Agentes de IA

### 🎯 **Responsabilidades do Agente**

#### 📋 **Verificação Obrigatória Antes de Qualquer Modificação:**
1. **Verificar estrutura atual:** Sempre listar a raiz do projeto antes de fazer mudanças
2. **Identificar arquivos fora do lugar:** Documentos `.md` na raiz (exceto README e CHANGELOG)
3. **Propor reorganização:** Se encontrar arquivos mal posicionados, sugerir movimentação
4. **Manter 00-documentation-index.md atualizado:** Sempre que criar/mover documentos, atualizar o índice

#### 🔄 **Fluxo de Trabalho Padrão:**
```
1. Analisar estrutura atual
2. Identificar problemas de organização
3. Propor plano de correção
4. Executar movimentações necessárias
5. Atualizar 00-documentation-index.md
6. Validar estrutura final
```

### 📝 **Padrões de Nomenclatura**

#### 📁 **Arquivos de Documentação:**
- **Formato:** `kebab-case.md` (ex: `project-status.md`)
- **Idioma:** Português brasileiro para conteúdo
- **Estrutura:** Sempre iniciar com título H1 e metadados

#### 🏷️ **Convenções de Nomes:**
- `00-documentation-index.md` - Índice principal da documentação
- `01-api-reference.md` - Documentação de APIs
- `02-system-architecture.md` - Arquitetura técnica do sistema
- `03-contributing-guide.md` - Guias de contribuição
- `04-deployment-guide.md` - Guias de deploy
- `05-design-system.md` - Sistema de design UI/UX
- `06-execution-plan.md` - Plano de execução do projeto
- `07-faq.md` - Perguntas frequentes
- `08-frontend-architecture.md` - Arquitetura específica do frontend
- `09-installation-guide.md` - Guia de instalação
- `10-supabase-migration.md` - Processo de migração para Supabase
- `11-supabase-migration-plan.md` - Plano detalhado da migração
- `12-project-structure.md` - Estrutura de arquivos do projeto
- `13-reorganization-plan.md` - Plano de reorganização da documentação
- `14-specifications.md` - Especificações técnicas do sistema
- `15-testing-guide.md` - Estratégias de teste e qualidade

### 🛡️ **Regras de Proteção**

#### ❌ **NUNCA Fazer:**
- Mover `README.md` ou `CHANGELOG.md` da raiz
- Criar arquivos `.md` diretamente na raiz
- Duplicar documentação entre raiz e `/docs`
- Deixar arquivos temporários ou de backup
- Criar pastas de documentação fora de `/docs`

#### ✅ **SEMPRE Fazer:**
- Verificar se 00-documentation-index.md está atualizado
- Manter links funcionais entre documentos
- Usar referências relativas para links internos
- Seguir a estrutura hierárquica definida
- Documentar mudanças no CHANGELOG.md

---

## 🔧 Manutenção Contínua

### 📅 **Verificações Periódicas**

#### 🔍 **Checklist Semanal:**
- [ ] Verificar se há arquivos `.md` na raiz (exceto README/CHANGELOG)
- [ ] Validar se todos os links no INDEX.md estão funcionais
- [ ] Confirmar que novos documentos foram adicionados ao índice
- [ ] Verificar se a estrutura de pastas está conforme o padrão

#### 📊 **Checklist Mensal:**
- [ ] Revisar e atualizar metadados dos documentos
- [ ] Verificar se documentos obsoletos podem ser arquivados
- [ ] Validar consistência de nomenclatura
- [ ] Atualizar estimativas de tempo de leitura no INDEX.md

### 🚨 **Sinais de Alerta**

#### ⚠️ **Indicadores de Desorganização:**
- Arquivos `.md` aparecendo na raiz do projeto
- Links quebrados no INDEX.md
- Documentos duplicados em locais diferentes
- Pastas de documentação fora de `/docs`
- Arquivos com nomes inconsistentes (CamelCase, UPPER_CASE)

#### 🔧 **Ações Corretivas Imediatas:**
1. **Mover arquivos mal posicionados** para `/docs`
2. **Renomear arquivos** para seguir padrão kebab-case
3. **Atualizar INDEX.md** com novos documentos
4. **Corrigir links quebrados** em toda a documentação
5. **Remover duplicatas** e manter apenas a versão em `/docs`

---

## ✅ Checklist de Validação

### 🎯 **Estrutura Ideal Validada:**

```
✅ StudioFlow/
├── ✅ README.md                    # Documento principal
├── ✅ CHANGELOG.md                 # Histórico de versões
├── ✅ LICENSE                      # Licença do projeto
├── ✅ package.json                 # Configuração do monorepo
├── ✅ docker-compose.yml           # Orquestração
├── ✅ .gitignore                   # Arquivos ignorados
├── ✅ docs/
│   ├── ✅ INDEX.md                 # Índice principal
│   ├── ✅ installation.md          # Guia de instalação
│   ├── ✅ api.md                   # Documentação da API
│   ├── ✅ contributing.md          # Guia de contribuição
│   ├── ✅ faq.md                   # Perguntas frequentes
│   ├── ✅ project-status.md        # Status do projeto
│   ├── ✅ specifications.md        # Especificações
│   ├── ✅ architecture.md          # Arquitetura técnica
│   ├── ✅ execution-plan.md        # Plano de execução
│   ├── ✅ frontend-architecture.md # Arquitetura frontend
│   ├── ✅ design-system.md         # Sistema de design
│   ├── ✅ deployment.md            # Guia de deploy
│   └── ✅ testing.md               # Estratégias de teste
├── ✅ backend/                     # Código backend
├── ✅ frontend/                    # Código frontend
├── ✅ packages/                    # Pacotes compartilhados
└── ✅ docker/                      # Configurações Docker
```

### 🔍 **Comandos de Verificação:**

```bash
# Verificar arquivos .md na raiz (deve retornar apenas README.md e CHANGELOG.md)
ls *.md

# Verificar estrutura da pasta docs
ls docs/

# Verificar links quebrados no INDEX.md
grep -o '\[.*\](.*)' docs/INDEX.md
```

---

## 📚 Exemplos Práticos

### 🔄 **Cenário: Novo Documento Criado**

**Situação:** Desenvolvedor cria `SECURITY_GUIDELINES.md` na raiz

**Ação do Agente:**
1. Detectar arquivo fora do lugar
2. Mover para `docs/security-guidelines.md`
3. Atualizar INDEX.md adicionando link na categoria apropriada
4. Validar estrutura final

### 🚨 **Cenário: Documentação Desorganizada**

**Situação:** Múltiplos arquivos `.md` na raiz após merge

**Ação do Agente:**
1. Listar todos os arquivos `.md` na raiz
2. Identificar quais devem ser movidos
3. Criar plano de reorganização
4. Executar movimentações
5. Atualizar INDEX.md
6. Remover duplicatas

---

## 🎯 Objetivos de Longo Prazo

### 📈 **Metas de Qualidade:**
- **100% dos documentos técnicos** organizados em `/docs`
- **Zero links quebrados** na documentação
- **Nomenclatura consistente** em todos os arquivos
- **INDEX.md sempre atualizado** com novos documentos
- **Estrutura escalável** para crescimento do projeto

### 🏆 **Benefícios Alcançados:**
1. **Profissionalismo:** Projeto com aparência enterprise
2. **Produtividade:** Desenvolvedores encontram informações rapidamente
3. **Manutenibilidade:** Estrutura clara facilita atualizações
4. **Onboarding:** Novos membros se orientam facilmente
5. **Escalabilidade:** Estrutura suporta crescimento do projeto

---

---

## 🤖 Instruções Específicas para Agentes de IA

### 🎯 **Responsabilidades Primárias:**

1. **Vigilância Ativa:** Monitorar constantemente a estrutura do projeto
2. **Correção Automática:** Aplicar regras de organização imediatamente
3. **Prevenção:** Evitar que arquivos sejam criados em locais incorretos
4. **Manutenção:** Manter INDEX.md sempre atualizado
5. **Validação:** Verificar integridade da documentação

### 📋 **Protocolo de Ação Obrigatório:**

#### 🔍 **Ao Detectar Arquivo `.md` na Raiz:**
```
1. IDENTIFICAR: Tipo e propósito do arquivo
2. AVALIAR: Se deve permanecer na raiz (README/CHANGELOG) ou mover
3. MOVER: Para /docs com nome em kebab-case
4. ATUALIZAR: INDEX.md com novo link
5. VALIDAR: Estrutura final
```

#### 📝 **Ao Criar Novo Documento:**
```
1. LOCALIZAR: Sempre em /docs/
2. NOMEAR: Usar kebab-case (ex: security-guidelines.md)
3. ESTRUTURAR: Incluir metadados (título, data, tempo de leitura)
4. INDEXAR: Adicionar ao INDEX.md na categoria correta
5. LINKAR: Verificar se há referências cruzadas necessárias
```

#### 🔧 **Ao Modificar Documentação:**
```
1. PRESERVAR: Estrutura e formatação existente
2. ATUALIZAR: Metadados (data de modificação)
3. VERIFICAR: Links internos e externos
4. MANTER: Consistência de estilo
5. VALIDAR: Integridade do INDEX.md
```

### ⚠️ **Regras Críticas - NUNCA VIOLAR:**

- ❌ **NUNCA** criar arquivos `.md` na raiz (exceto README/CHANGELOG)
- ❌ **NUNCA** usar CamelCase ou UPPER_CASE em nomes de arquivos
- ❌ **NUNCA** deixar links quebrados no INDEX.md
- ❌ **NUNCA** duplicar documentação em múltiplos locais
- ❌ **NUNCA** ignorar a atualização do INDEX.md

### ✅ **Comandos de Verificação Automática:**

```bash
# Verificar arquivos mal posicionados
find . -maxdepth 1 -name "*.md" ! -name "README.md" ! -name "CHANGELOG.md"

# Validar estrutura docs/
ls -la docs/ | grep -E "\.(md|MD)$"

# Verificar links no INDEX
grep -n "\[.*\](.*\.md)" docs/INDEX.md
```

---

## 📊 Resumo Executivo

### 🎯 **Objetivo Principal:**
Manter o projeto StudioFlow com estrutura de documentação profissional, organizada e escalável, seguindo padrões da indústria.

### 🏗️ **Estrutura Estabelecida:**
- **Raiz:** Apenas arquivos essenciais (README, CHANGELOG, configurações)
- **`/docs`:** Toda documentação técnica centralizada
- **Nomenclatura:** kebab-case para máxima compatibilidade
- **Índice:** INDEX.md como ponto central de navegação

### 🔄 **Processo de Manutenção:**
1. **Detecção** de arquivos fora do lugar
2. **Correção** automática da estrutura
3. **Atualização** do índice principal
4. **Validação** da integridade
5. **Monitoramento** contínuo

### 📈 **Benefícios Alcançados:**
- ✅ Organização profissional
- ✅ Navegação intuitiva
- ✅ Manutenibilidade alta
- ✅ Onboarding eficiente
- ✅ Escalabilidade garantida

---

**🤖 Este documento é uma referência viva e deve ser consultado sempre que houver dúvidas sobre organização do projeto. Agentes de IA devem seguir estas diretrizes rigorosamente para manter a excelência organizacional do StudioFlow.**