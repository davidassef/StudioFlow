# 📘 Guia Universal de Código Limpo e Boas Práticas

Este guia serve como referência para garantir que todo código gerado — manualmente ou por IA como o GitHub Copilot — siga boas práticas, seja limpo, testável e fácil de manter. Serve para projetos backend (FastAPI, Django, etc.), frontend (React, Next.js, etc.) ou fullstack.

---

## 🧼 Princípios de Código Limpo

- *Nomes descritivos*: variáveis, funções e arquivos devem ter nomes claros e precisos.
- *Uma função, uma responsabilidade* (SRP - Single Responsibility Principle).
- *Evite comentários desnecessários*: o código deve se explicar sozinho.
- *Evite duplicação*: reutilize código onde for possível.
- *Evite funções muito longas*: quebrem em partes lógicas.
- *Use padrões de projeto simples* quando necessário (factory, strategy, adapter).
- *Modularize*: separe lógica em arquivos, classes e funções.
- *Consistência*: siga o mesmo estilo de código em todo o projeto (indentação, espaçamento, etc.).
- *Documentação*: mantenha um guia de estilo e boas práticas atualizado no repositório.
- *Use tipagem estática* (mypy, TypeScript) para maior clareza e segurança.
- *Use linters* (black, flake8, eslint) para garantir qualidade e consistência do código. E sempre corrija os erros de lint de um arquivo alterado antes de ir para o próximo
- *Data*: Verifique se a data atual está correta, atualize todos os documentos com a data atual em formato DD-MM-AAAA
- *Autor*: Sempre adicione o autor do arquivo no topo do arquivo, como comentário: Autor atual: Seu nome
- *Descrição*: Adicione uma breve descrição do arquivo, como comentário: # Arquivo de configuração do projeto
- *Licença*: Adicione a licença do projeto, como comentário: # MIT License
- *Evite lógica complexa em views*: mantenha a lógica de negócio separada das views/componentes.
- *Use testes automatizados*: sempre que possível, escreva testes unitários e de integração.
- *Evite código morto*: remova funções, classes ou variáveis não utilizadas.
- *Use boas práticas de segurança*: evite hardcode de credenciais, use variáveis de ambiente.
- *Evite hardcode de senhas*: use variáveis de ambiente para armazenar senhas e chaves de API.
- *Use criptografia*: para armazenar dados sensíveis, como senhas e chaves de API.
- *Sempre pense na melhor solução para o problema*: evite soluções complicadas quando uma simples resolve.
- *Use padrões de projeto*: siga padrões de projeto quando necessário (ex: factory, strategy, adapter).
- *Pense detalhadamente antes de aplicar uma solução*: evite decisões precipitadas que podem complicar o código.
- *Use ferramentas de análise estática*: para identificar problemas comuns e melhorar a qualidade do código.
- *Mantenha o código legível*: evite abreviações excessivas e complexidade desnecessária.
- *Use convenções de nomenclatura*: siga as convenções do seu stack (ex: camelCase para JavaScript, snake_case para Python).
- *Docstrings*: use docstrings para documentar funções e classes, explicando o que fazem, parâmetros e retornos, tudo em PT-BR.
- *Duplicação de arquivos*: evite duplicar arquivos, criando novas versões, como fixed, v2, v3, new, final, etc. Edite ou corrija sempre o mesmo arquivo, se necessário, refatore.
- *Relatórios e commits*: Não crie relatórios sem eu solicitar, crie commits para relatar os avanços do projeto. Use mensagens de commit claras e descritivas, como "Implementa endpoint de login" ou "Adiciona testes para o serviço de autenticação".
- *Revisão de código*: Sempre revise o código gerado, especialmente se for por IA. Verifique se segue as boas práticas e está alinhado com o padrão do projeto e resolva os problemas de lint do arquivo antes de ir para o próximo.


---

## 📁 Estrutura Padrão de Projeto

### Backend


/app
  /routes        → Endpoints (API)
  /services      → Regras de negócio
  /schemas       → Validações (Pydantic/Serializers)
  /models        → ORM ou Entidades
  /core          → Configurações, middlewares, auth, etc.
  /utils         → Funções auxiliares
  /tests         → Testes unitários e de integração


### Frontend


/src
  /components    → Componentes reutilizáveis
  /pages         → Páginas ou rotas
  /services      → Chamadas à API
  /hooks         → Hooks personalizados
  /contexts      → Contextos globais de estado
  /utils         → Funções utilitárias
  /tests         → Testes unitários e de integração


---

## 🔄 Separação de Responsabilidades

- *Rotas* apenas lidam com entrada/saída da API.
- *Services* contêm a lógica principal de negócio.
- *Schemas/DTOs* validam e organizam dados de entrada e saída.
- *Models* lidam com persistência e estrutura de dados.
- *Components* React devem ser pequenos e especializados.
- *Hooks* encapsulam lógica reutilizável.

---

## ✅ Boas Práticas

- Sempre revise o código gerado.
- Sempre fale e escreva em PT-BR.
- Nunca aceite código que:
  - Mistura responsabilidades (ex: lógica de negócio dentro da view).
  - Possui nomes genéricos ou confusos.
  - Deixa de validar entradas ou lidar com exceções.
- Prefira instruções claras no prompt:
  - “Crie função pura para calcular total com desconto...”
  - “Crie hook que abstrai chamadas à API com axios...”

---

## 🧪 Testabilidade

- Toda função deve ser testável isoladamente.
- Use pytest, unittest, Jest ou Testing Library conforme o stack.
- Evite lógica embutida em views/componentes sem testabilidade.
- Prefira funções puras onde possível.

---

## 💣 Tratamento de Erros

- Nunca engula exceções silenciosamente.
- Use:
  - Backend: try/except, logging, raise HTTPException
  - Frontend: .catch(), try/catch, ErrorBoundary
- Sempre registre e trate erros corretamente.

---

## 🛡️ Segurança

- Nunca exponha segredos (API keys, tokens) no código.
- Use arquivos .env e bibliotecas como python-dotenv ou dotenv no React.
- Valide tudo no backend. Não confie no frontend.

---

## 🧠 Dicas Finais

- Use linters (black, flake8, eslint, prettier).
- Use tipagem estática (mypy, TypeScript) sempre que possível.
- Escreva código que *você entenderia daqui a 6 meses*.
- Mantenha este guia no repositório (docs/ ou raiz).
- Atualize o guia se o padrão do projeto mudar.

---

🛠️ Este guia é sua referência quando estiver cansado, distraído ou com pressa. Especialmente útil quando usando Copilot.