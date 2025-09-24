# 🤝 Guia de Contribuição - StudioFlow

**Versão:** 2.0  
**Última Atualização:** 24 de Julho de 2025  
**Tempo de Leitura:** 15 minutos

---

## 📋 Índice

- [🎯 Bem-vindo(a) ao StudioFlow!](#-bem-vindoa-ao-studioflow)
- [📋 Código de Conduta](#-código-de-conduta)
- [🚀 Como Contribuir](#-como-contribuir)
- [🔧 Configuração do Ambiente](#-configuração-do-ambiente)
- [📝 Padrões de Código](#-padrões-de-código)
- [🧪 Testes e Qualidade](#-testes-e-qualidade)
- [📦 Convenções de Commit](#-convenções-de-commit)
- [🔄 Fluxo de Desenvolvimento](#-fluxo-de-desenvolvimento)
- [📋 Pull Request Guidelines](#-pull-request-guidelines)
- [🐛 Reportando Bugs](#-reportando-bugs)
- [💡 Sugerindo Melhorias](#-sugerindo-melhorias)
- [🎨 Contribuições de Design](#-contribuições-de-design)
- [📚 Documentação](#-documentação)
- [🏆 Reconhecimento](#-reconhecimento)
- [📞 Suporte](#-suporte)

---

## 🎯 Bem-vindo(a) ao StudioFlow!

Obrigado por considerar contribuir para o StudioFlow! Este documento fornece diretrizes completas para contribuir de forma efetiva para o projeto.

### 🌟 Por que Contribuir?

- **Impacto Real**: Ajude a revolucionar a gestão de estúdios
- **Aprendizado**: Trabalhe com tecnologias modernas
- **Comunidade**: Faça parte de uma comunidade ativa
- **Portfólio**: Contribua para um projeto open source

### 📊 Status do Projeto

![GitHub Stars](https://img.shields.io/github/stars/studioflow/studioflow)
![GitHub Forks](https://img.shields.io/github/forks/studioflow/studioflow)
![GitHub Issues](https://img.shields.io/github/issues/studioflow/studioflow)
![GitHub PRs](https://img.shields.io/github/issues-pr/studioflow/studioflow)

---

## 📜 Código de Conduta

Este projeto segue o [Código de Conduta do Contributor Covenant](CODE_OF_CONDUCT.md). Ao participar, você concorda em manter um ambiente respeitoso e inclusivo para todos.

### Nossos Valores

- **Respeito**: Trate todos com cortesia e profissionalismo
- **Inclusão**: Acolha pessoas de todas as origens e níveis de experiência
- **Colaboração**: Trabalhe junto para alcançar objetivos comuns
- **Qualidade**: Busque sempre a excelência técnica
- **Transparência**: Comunique-se de forma clara e aberta

## 🤝 Como Contribuir

### 1. Reportar Bugs

Encontrou um bug? Ajude-nos a corrigi-lo!

**Antes de reportar:**
- Verifique se já existe um issue similar
- Teste na versão mais recente
- Reproduza o problema consistentemente

**Como reportar:**
1. Acesse [GitHub Issues](https://github.com/seu-usuario/studioflow/issues)
2. Clique em "New Issue"
3. Escolha o template "Bug Report"
4. Preencha todas as informações solicitadas

**Template de Bug Report:**
```markdown
## Descrição do Bug
Descrição clara e concisa do problema.

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado
O que deveria acontecer.

## Comportamento Atual
O que realmente acontece.

## Screenshots
Se aplicável, adicione screenshots.

## Ambiente
- OS: [ex: Windows 10]
- Navegador: [ex: Chrome 91]
- Versão do StudioFlow: [ex: 1.2.0]

## Informações Adicionais
Qualquer contexto adicional sobre o problema.
```

### 2. Sugerir Funcionalidades

Tem uma ideia para melhorar o StudioFlow?

**Antes de sugerir:**
- Verifique se já foi sugerida
- Considere se é útil para a maioria dos usuários
- Pense na complexidade de implementação

**Template de Feature Request:**
```markdown
## Problema/Necessidade
Qual problema esta funcionalidade resolve?

## Solução Proposta
Descreva a solução que você gostaria de ver.

## Alternativas Consideradas
Outras soluções que você considerou.

## Benefícios
- Benefício 1
- Benefício 2

## Complexidade Estimada
- [ ] Baixa (algumas horas)
- [ ] Média (alguns dias)
- [ ] Alta (algumas semanas)

## Mockups/Wireframes
Se aplicável, adicione imagens ou descrições visuais.
```

### 3. Contribuir com Código

Quer implementar uma funcionalidade ou corrigir um bug?

**Processo:**
1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Adicione testes
5. Atualize a documentação
6. Submeta um Pull Request

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- **Node.js** 18+
- **Python** 3.11+
- **PostgreSQL** 14+
- **Redis** 6+
- **Git**

### Instalação

```bash
# 1. Fork e clone o repositório
git clone https://github.com/SEU-USUARIO/studioflow.git
cd studioflow

# 2. Configure o backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edite o .env com suas configurações
python manage.py migrate
python manage.py createsuperuser

# 3. Configure o frontend
cd ../frontend
npm install
cp .env.local.example .env.local
# Edite o .env.local com suas configurações

# 4. Inicie os serviços
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Celery (opcional)
cd backend
celery -A studioflow worker -l info
```

### Verificação da Instalação

```bash
# Teste o backend
curl http://localhost:8000/api/health/

# Teste o frontend
curl http://localhost:5000/

# Execute os testes
cd backend && python manage.py test
cd frontend && npm test
```

## 🔄 Fluxo de Desenvolvimento

### Git Workflow

Usamos o **Git Flow** simplificado:

```bash
# 1. Atualize sua branch main
git checkout main
git pull upstream main

# 2. Crie uma branch para sua feature
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug

# 3. Faça suas mudanças
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# 4. Push para seu fork
git push origin feature/nome-da-feature

# 5. Abra um Pull Request
```

### Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção

**Exemplos:**
```bash
feat(auth): adiciona autenticação de dois fatores
fix(booking): corrige conflito de horários
docs(api): atualiza documentação dos endpoints
style(frontend): formata componentes com prettier
refactor(database): otimiza queries de agendamento
test(auth): adiciona testes para login
chore(deps): atualiza dependências do frontend
```

### Branches

- **main**: Código estável em produção
- **develop**: Código em desenvolvimento
- **feature/**: Novas funcionalidades
- **fix/**: Correções de bugs
- **hotfix/**: Correções urgentes
- **release/**: Preparação de releases

## 📝 Padrões de Código

### Backend (Python/Django)

**Estilo:**
- Siga o [PEP 8](https://pep8.org/)
- Use [Black](https://black.readthedocs.io/) para formatação
- Use [isort](https://isort.readthedocs.io/) para imports
- Use [flake8](https://flake8.pycqa.org/) para linting

**Configuração:**
```bash
# Instale as ferramentas
pip install black isort flake8

# Formate o código
black .
isort .

# Verifique o código
flake8 .
```

**Estrutura de arquivos:**
```
backend/
├── apps/
│   ├── authentication/
│   ├── bookings/
│   ├── clients/
│   └── studios/
├── core/
│   ├── settings/
│   ├── urls.py
│   └── wsgi.py
├── tests/
└── requirements.txt
```

**Padrões:**
- Use class-based views (CBV)
- Implemente serializers para APIs
- Adicione docstrings em todas as funções
- Use type hints quando possível
- Mantenha views simples, lógica em services

**Exemplo:**
```python
from typing import List, Optional
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar agendamentos.
    
    Permite criar, listar, atualizar e deletar agendamentos,
    além de verificar disponibilidade de horários.
    """
    
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()
    
    @action(detail=False, methods=['post'])
    def check_availability(self, request) -> Response:
        """
        Verifica disponibilidade de horário para agendamento.
        
        Args:
            request: Dados da requisição contendo sala, data e horário
            
        Returns:
            Response: Disponibilidade e horários alternativos
        """
        # Implementação...
        pass
```

### Frontend (TypeScript/React/Next.js)

**Estilo:**
- Use [Prettier](https://prettier.io/) para formatação
- Use [ESLint](https://eslint.org/) para linting
- Siga as [regras do React](https://react.dev/learn)
- Use TypeScript para type safety

**Configuração:**
```bash
# Formate o código
npm run format

# Verifique o código
npm run lint

# Corrija automaticamente
npm run lint:fix
```

**Estrutura de arquivos:**
```
frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── bookings/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── forms/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── public/
└── package.json
```

**Padrões:**
- Use componentes funcionais com hooks
- Implemente TypeScript interfaces
- Use custom hooks para lógica reutilizável
- Mantenha componentes pequenos e focados
- Use Context API para estado global

**Exemplo:**
```typescript
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface BookingFormProps {
  onSubmit: (booking: BookingData) => void
  initialData?: Partial<BookingData>
}

interface BookingData {
  clientId: string
  roomId: string
  startTime: Date
  endTime: Date
  notes?: string
}

export function BookingForm({ onSubmit, initialData }: BookingFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<BookingData>({
    clientId: '',
    roomId: '',
    startTime: new Date(),
    endTime: new Date(),
    ...initialData
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos do formulário */}
      <Button type="submit">Agendar</Button>
    </form>
  )
}
```

### CSS/Styling

- Use [Tailwind CSS](https://tailwindcss.com/) para styling
- Siga a metodologia mobile-first
- Use variáveis CSS para temas
- Mantenha classes organizadas

**Exemplo:**
```tsx
// ✅ Bom
<div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Título</h2>
  <p className="text-gray-600">Descrição</p>
</div>

// ❌ Evite
<div style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Título</h2>
</div>
```

## 🧪 Testes

### Backend (Python)

**Framework:** Django Test Framework + pytest

```bash
# Execute todos os testes
python manage.py test

# Execute testes específicos
python manage.py test apps.bookings.tests

# Com coverage
coverage run --source='.' manage.py test
coverage report
```

**Estrutura:**
```python
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.bookings.models import Booking

User = get_user_model()

class BookingModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
    def test_booking_creation(self):
        """Teste criação de agendamento."""
        booking = Booking.objects.create(
            client=self.user,
            room_id=1,
            start_time='2024-01-01 10:00:00',
            end_time='2024-01-01 12:00:00'
        )
        self.assertEqual(booking.duration, 2)
        
    def test_booking_conflict(self):
        """Teste detecção de conflito de horários."""
        # Implementação...
        pass
```

### Frontend (TypeScript)

**Framework:** Jest + React Testing Library

```bash
# Execute todos os testes
npm test

# Execute em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

**Estrutura:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { BookingForm } from '@/components/BookingForm'

describe('BookingForm', () => {
  it('renders form fields correctly', () => {
    render(<BookingForm onSubmit={jest.fn()} />)
    
    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sala/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /agendar/i })).toBeInTheDocument()
  })
  
  it('calls onSubmit with form data', () => {
    const mockSubmit = jest.fn()
    render(<BookingForm onSubmit={mockSubmit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /agendar/i }))
    
    expect(mockSubmit).toHaveBeenCalledWith({
      // dados esperados
    })
  })
})
```

### Cobertura de Testes

**Metas:**
- **Unidade**: 90%+ de cobertura
- **Integração**: Cenários críticos
- **E2E**: Fluxos principais

**Prioridades:**
1. Lógica de negócio
2. Autenticação e autorização
3. APIs críticas
4. Componentes reutilizáveis
5. Fluxos de usuário principais

## 📚 Documentação

### Tipos de Documentação

1. **README**: Visão geral e quick start
2. **API Docs**: Documentação de endpoints
3. **Code Docs**: Docstrings e comentários
4. **User Docs**: Guias de usuário
5. **Dev Docs**: Guias de desenvolvimento

### Padrões

**Markdown:**
- Use headers hierárquicos (H1 > H2 > H3)
- Adicione índice para documentos longos
- Use code blocks com syntax highlighting
- Inclua exemplos práticos
- Mantenha linguagem clara e objetiva

**Docstrings (Python):**
```python
def create_booking(client_id: str, room_id: str, start_time: datetime) -> Booking:
    """
    Cria um novo agendamento para o cliente.
    
    Args:
        client_id: ID único do cliente
        room_id: ID da sala a ser reservada
        start_time: Data e hora de início
        
    Returns:
        Booking: Objeto do agendamento criado
        
    Raises:
        ValidationError: Se os dados forem inválidos
        ConflictError: Se houver conflito de horário
        
    Example:
        >>> booking = create_booking('123', '456', datetime.now())
        >>> print(booking.id)
        '789'
    """
```

**JSDoc (TypeScript):**
```typescript
/**
 * Hook para gerenciar estado de agendamentos
 * 
 * @param initialBookings - Lista inicial de agendamentos
 * @returns Objeto com bookings e funções de manipulação
 * 
 * @example
 * ```tsx
 * const { bookings, addBooking, removeBooking } = useBookings([])
 * ```
 */
export function useBookings(initialBookings: Booking[] = []) {
  // Implementação...
}
```

## 🔍 Processo de Review

### Pull Request Guidelines

**Antes de submeter:**
- [ ] Código formatado e sem warnings
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Commits seguem convenção
- [ ] Branch atualizada com main

**Template de PR:**
```markdown
## Descrição
Descrição clara das mudanças implementadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots
(Se aplicável)

## Checklist
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Código revisado
- [ ] Sem breaking changes

## Issues Relacionadas
Fixes #123
Closes #456
```

### Processo de Review

1. **Automated Checks**: CI/CD executa testes e linting
2. **Code Review**: Maintainer revisa o código
3. **Testing**: Testa funcionalidade manualmente
4. **Approval**: Aprova ou solicita mudanças
5. **Merge**: Merge para branch principal

### Critérios de Aprovação

**Funcionalidade:**
- [ ] Funciona conforme especificado
- [ ] Não quebra funcionalidades existentes
- [ ] Performance adequada
- [ ] Segurança mantida

**Código:**
- [ ] Legível e bem estruturado
- [ ] Segue padrões do projeto
- [ ] Adequadamente testado
- [ ] Documentado quando necessário

**Processo:**
- [ ] PR template preenchido
- [ ] Commits bem descritos
- [ ] Branch atualizada
- [ ] CI/CD passando

## 🎨 Tipos de Contribuição

### 1. Desenvolvimento

**Backend:**
- Novas APIs
- Otimizações de performance
- Correções de bugs
- Melhorias de segurança

**Frontend:**
- Novos componentes
- Melhorias de UX/UI
- Responsividade
- Acessibilidade

**DevOps:**
- CI/CD improvements
- Docker optimizations
- Deployment scripts
- Monitoring

### 2. Documentação

- Guias de usuário
- Documentação técnica
- Tutoriais
- Exemplos de código
- Traduções

### 3. Design

- UI/UX improvements
- Mockups e wireframes
- Ícones e ilustrações
- Guia de estilo
- Protótipos

### 4. Testes

- Testes unitários
- Testes de integração
- Testes E2E
- Performance testing
- Security testing

### 5. Comunidade

- Responder issues
- Ajudar novos contribuidores
- Organizar eventos
- Criar conteúdo
- Divulgação

## 🌟 Reconhecimento

### Contributors

Todos os contribuidores são reconhecidos:
- **README**: Lista de contribuidores
- **Releases**: Menção em changelogs
- **Social**: Destaque nas redes sociais
- **Swag**: Brindes para contribuidores ativos

### Níveis de Contribuição

**🥉 Contributor**: Primeira contribuição aceita
**🥈 Regular**: 5+ contribuições aceitas
**🥇 Core**: 20+ contribuições + review de PRs
**💎 Maintainer**: Acesso de escrita + decisões técnicas

## 💬 Comunidade

### Canais de Comunicação

- **Discord**: [StudioFlow Community](https://discord.gg/studioflow)
- **GitHub Discussions**: [Discussões](https://github.com/seu-usuario/studioflow/discussions)
- **Email**: dev@studioflow.com
- **Twitter**: [@StudioFlowDev](https://twitter.com/studioflowdev)

### Eventos

- **Weekly Sync**: Terças, 19h (GMT-3)
- **Monthly Demo**: Primeira sexta do mês
- **Hackathons**: Trimestrais
- **Conferences**: Anuais

### Mentoria

Programa de mentoria para novos contribuidores:
- **Buddy System**: Pareamento com contributor experiente
- **Good First Issues**: Issues marcadas para iniciantes
- **Office Hours**: Horários para tirar dúvidas
- **Workshops**: Sessões de aprendizado

## 🚀 Primeiros Passos

### Para Iniciantes

1. **Leia a documentação** completa
2. **Configure o ambiente** de desenvolvimento
3. **Explore o código** para entender a arquitetura
4. **Procure por "good first issues"** no GitHub
5. **Entre no Discord** e se apresente
6. **Faça sua primeira contribuição** (pode ser documentação!)

### Issues para Iniciantes

Procure por labels:
- `good first issue`: Ideal para primeira contribuição
- `help wanted`: Precisamos de ajuda
- `documentation`: Melhorias na documentação
- `bug`: Correções de bugs simples
- `enhancement`: Pequenas melhorias

### Dicas

- **Comece pequeno**: Documentação, testes, pequenos bugs
- **Faça perguntas**: Não hesite em pedir ajuda
- **Seja paciente**: Review pode demorar alguns dias
- **Aprenda**: Use como oportunidade de crescimento
- **Divirta-se**: Contribuir deve ser prazeroso!

## 📞 Contato

**Dúvidas sobre contribuição?**
- Discord: [#contributors](https://discord.gg/studioflow)
- Email: contributors@studioflow.com
- GitHub: [@maintainer](https://github.com/maintainer)

**Problemas técnicos?**
- GitHub Issues: [Reportar problema](https://github.com/seu-usuario/studioflow/issues)
- Discord: [#help](https://discord.gg/studioflow)

---

## 🙏 Agradecimentos

Obrigado por contribuir com o StudioFlow! Sua ajuda torna este projeto melhor para toda a comunidade de estúdios musicais.

**Juntos, vamos revolucionar a gestão de estúdios musicais!** 🎵

---

*Este documento é vivo e evolui com o projeto. Sugestões de melhoria são sempre bem-vindas!*