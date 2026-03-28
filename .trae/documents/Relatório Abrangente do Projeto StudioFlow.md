## Objetivo
Entregar um relatório técnico e executivo com diagnóstico completo do projeto (status, qualidade, desempenho, recursos, riscos e indicadores), acompanhado de dados concretos, gráficos e recomendações acionáveis.

## Escopo da Execução (após confirmação)
1. Inventário e Métricas do Código
- Mapear contagem de arquivos, linhas de código por módulo, linguagem e testes
- Extrair métricas: nº de testes unitários/E2E, distribuição por área, presença de TODO/FIXME
- Rodar linters (ESLint, flake8) e consolidar violações por severidade e arquivo

2. Qualidade e Testes
- Rodar Jest com cobertura (threshold 85%) e gerar relatório (lcov + HTML)
- Rodar Playwright E2E (em modo headless/headed conforme necessidade) e consolidar passes/fails
- Rodar pytest no backend e agrupar resultados por app (users, studios, bookings, subscriptions)

3. Desempenho e PWA
- Executar Lighthouse (Web Vitals + PWA), gerar relatórios comparativos (mobile/desktop)
- Validar service worker, caches e offline (com ENABLE_PWA=true) e coletar métricas de acerto/armazenamento
- Medir bundle size e split de chunks (Next.js build analyze)

4. Segurança e Configuração
- Auditar backend Django settings (secrets, DEBUG, CORS, JWT) e Supabase RLS/policies
- Verificar exposição de chaves e conformidade com .env; sugerir rotinas de secret management

5. Arquitetura e Integração
- Validar integração atual: frontend → API Django (axios) vs Supabase client
- Mapear endpoints consumidos e status (auth, bookings, studios, subscriptions)
- Conferir divergências de documentação vs implementação (URLs, portas, processos)

6. Recursos e Cronograma
- Cruzar ROADMAP com estado atual; marcar sprints e fases com percentuais reais
- Levantar gargalos de equipe, ferramentas e CI/CD (se houver)

7. Relatório e Gráficos
- Consolidar KPIs em gráficos (barras/progressos): testes, fases do roadmap, cobertura, Lighthouse
- Montar relatório em Markdown estruturado (executivo + técnico), com referências de código

## Entregáveis
- Relatório (Markdown) completo com:
  - Status de desenvolvimento vs cronograma
  - Qualidade do código e testes (com números e evidências)
  - Desempenho (Lighthouse, bundle, PWA)
  - Segurança e configuração
  - Riscos, mitigação e próximos passos
  - KPIs e gráficos
- Pastas de evidência: coverage/, playwright-report/, lighthouse/ (HTML/JSON)

## Principais Assunções
- Ambiente local com Node 18+, Python 3.11+ e Docker disponíveis
- Backends Django e Supabase podem ser iniciados conforme README
- Sem alteração de código; apenas execução de testes/análises e coleta de artefatos

## Próximos Passos (após sua confirmação)
1. Preparar ambientes e variáveis conforme README
2. Rodar baterias de testes e ferramentas de análise
3. Consolidar resultados e gráficos
4. Entregar relatório final e recomendações priorizadas