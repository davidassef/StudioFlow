import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import CadastroClientePage from '../page'
import { useAuth } from '../../../contexts/AuthContext'

// Mocks
jest.mock('next/navigation')
jest.mock('../../../contexts/AuthContext')
jest.mock('../../../components/ui/Button', () => {
  return function MockButton({ children, onClick, disabled, type, className }: any) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={className}
        data-testid="button"
      >
        {children}
      </button>
    )
  }
})

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

// Mock do fetch
global.fetch = jest.fn()

// Mock do FileReader
global.FileReader = class {
  result: string | null = null
  onload: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null
  
  readAsDataURL(file: File) {
    setTimeout(() => {
      this.result = `data:image/jpeg;base64,mock-base64-${file.name}`
      if (this.onload) {
        this.onload({ target: { result: this.result } })
      }
    }, 0)
  }
} as any

const mockAuthUser = {
  id: '1',
  name: 'Maria Silva',
  email: 'maria@example.com',
  type: 'client' as const,
  avatar: null
}

describe('CadastroClientePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    } as any)
    
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isProvider: () => false,
      isClient: () => false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      token: null,
      isLoading: false
    })
    
    ;(fetch as jest.Mock).mockClear()
  })

  it('deve renderizar o formulário de cadastro de cliente', () => {
    render(<CadastroClientePage />)
    
    expect(screen.getByText('Cadastro de Cliente')).toBeInTheDocument()
    expect(screen.getByText('Crie sua conta gratuita e comece a reservar estúdios')).toBeInTheDocument()
    
    // Campos básicos
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument()
    
    // Campos de preferências
    expect(screen.getByText('Preferências Musicais')).toBeInTheDocument()
    expect(screen.getByText('Experiência Musical')).toBeInTheDocument()
    
    // Botões
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    
    // Informação sobre gratuidade
    expect(screen.getByText(/conta 100% gratuita/i)).toBeInTheDocument()
  })

  it('deve preencher e submeter o formulário com sucesso', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        user: mockAuthUser,
        token: 'mock-token',
        message: 'Conta criada com sucesso'
      })
    })
    
    render(<CadastroClientePage />)
    
    // Preenche campos obrigatórios
    await user.type(screen.getByLabelText(/nome completo/i), 'Maria Silva Santos')
    await user.type(screen.getByLabelText(/email/i), 'maria@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-05-15')
    
    // Aceita termos
    await user.click(screen.getByLabelText(/aceito os termos/i))
    
    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /criar conta/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: expect.stringContaining('"name":"Maria Silva Santos"')
      })
    })
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/feed')
    })
  })

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    // Tenta submeter sem preencher campos
    await user.click(screen.getByRole('button', { name: /criar conta/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
    })
    
    expect(fetch).not.toHaveBeenCalled()
  })

  it('deve validar formato do email', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    await user.type(screen.getByLabelText(/email/i), 'email-invalido')
    await user.tab() // Sai do campo para disparar validação
    
    await waitFor(() => {
      expect(screen.getByText(/email deve ter um formato válido/i)).toBeInTheDocument()
    })
  })

  it('deve validar tamanho mínimo da senha', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    await user.type(screen.getByLabelText(/senha/i), '123')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/senha deve ter pelo menos 8 caracteres/i)).toBeInTheDocument()
    })
  })

  it('deve validar confirmação de senha', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senha-diferente')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/senhas não coincidem/i)).toBeInTheDocument()
    })
  })

  it('deve validar idade mínima', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    // Data que resulta em idade menor que 16 anos
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() - 10)
    const dateString = futureDate.toISOString().split('T')[0]
    
    await user.type(screen.getByLabelText(/data de nascimento/i), dateString)
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/você deve ter pelo menos 16 anos/i)).toBeInTheDocument()
    })
  })

  it('deve validar formato do telefone', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    await user.type(screen.getByLabelText(/telefone/i), '123')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/telefone deve ter o formato \(00\) 00000-0000/i)).toBeInTheDocument()
    })
  })

  it('deve exigir aceitação dos termos', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    // Preenche todos os campos mas não aceita os termos
    await user.type(screen.getByLabelText(/nome completo/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/email/i), 'maria@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-05-15')
    
    await user.click(screen.getByRole('button', { name: /criar conta/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/você deve aceitar os termos/i)).toBeInTheDocument()
    })
  })

  it('deve permitir seleção de preferências musicais', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    // Verifica se as opções estão disponíveis
    expect(screen.getByLabelText(/rock/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/pop/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/jazz/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/eletrônica/i)).toBeInTheDocument()
    
    // Seleciona algumas preferências
    await user.click(screen.getByLabelText(/rock/i))
    await user.click(screen.getByLabelText(/jazz/i))
    
    expect(screen.getByLabelText(/rock/i)).toBeChecked()
    expect(screen.getByLabelText(/jazz/i)).toBeChecked()
  })

  it('deve permitir seleção de nível de experiência', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    // Verifica se as opções estão disponíveis
    expect(screen.getByLabelText(/iniciante/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/intermediário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/avançado/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/profissional/i)).toBeInTheDocument()
    
    // Seleciona um nível
    await user.click(screen.getByLabelText(/intermediário/i))
    
    expect(screen.getByLabelText(/intermediário/i)).toBeChecked()
  })

  it('deve permitir upload de foto de perfil', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    const file = new File(['fake image'], 'profile.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/foto de perfil/i)
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('profile.jpg')).toBeInTheDocument()
    })
  })

  it('deve validar tipo de arquivo para foto de perfil', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    const file = new File(['fake file'], 'document.pdf', { type: 'application/pdf' })
    const fileInput = screen.getByLabelText(/foto de perfil/i)
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/apenas imagens são permitidas/i)).toBeInTheDocument()
    })
  })

  it('deve lidar com erro de submissão', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email já está em uso' })
    })
    
    render(<CadastroClientePage />)
    
    // Preenche campos
    await user.type(screen.getByLabelText(/nome completo/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/email/i), 'maria@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-05-15')
    await user.click(screen.getByLabelText(/aceito os termos/i))
    
    await user.click(screen.getByRole('button', { name: /criar conta/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email já está em uso/i)).toBeInTheDocument()
    })
  })

  it('deve cancelar e voltar para página de login', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('deve mostrar estado de loading durante submissão', async () => {
    const user = userEvent.setup()
    
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    ;(fetch as jest.Mock).mockReturnValue(promise)
    
    render(<CadastroClientePage />)
    
    // Preenche campos
    await user.type(screen.getByLabelText(/nome completo/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/email/i), 'maria@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-05-15')
    await user.click(screen.getByLabelText(/aceito os termos/i))
    
    // Inicia submissão
    await user.click(screen.getByRole('button', { name: /criar conta/i }))
    
    // Verifica estado de loading
    expect(screen.getByText(/criando conta.../i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /criando conta.../i })).toBeDisabled()
    
    // Resolve a promise
    resolvePromise!({
      ok: true,
      json: async () => ({ user: mockAuthUser, token: 'mock-token' })
    })
    
    await waitFor(() => {
      expect(screen.queryByText(/criando conta.../i)).not.toBeInTheDocument()
    })
  })

  it('deve redirecionar usuário já autenticado', () => {
    mockUseAuth.mockReturnValue({
      user: mockAuthUser,
      isAuthenticated: true,
      isProvider: () => false,
      isClient: () => true,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      token: 'mock-token',
      isLoading: false
    })
    
    render(<CadastroClientePage />)
    
    expect(mockPush).toHaveBeenCalledWith('/feed')
  })

  it('deve formatar automaticamente telefone durante digitação', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    const phoneInput = screen.getByLabelText(/telefone/i)
    
    await user.type(phoneInput, '11999999999')
    
    expect(phoneInput).toHaveValue('(11) 99999-9999')
  })

  it('deve mostrar indicador de força da senha', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    const passwordInput = screen.getByLabelText(/senha/i)
    
    // Senha fraca
    await user.type(passwordInput, '123')
    expect(screen.getByText(/senha fraca/i)).toBeInTheDocument()
    
    // Limpa e testa senha média
    await user.clear(passwordInput)
    await user.type(passwordInput, 'senha123')
    expect(screen.getByText(/senha média/i)).toBeInTheDocument()
    
    // Limpa e testa senha forte
    await user.clear(passwordInput)
    await user.type(passwordInput, 'MinhaSenh@123!')
    expect(screen.getByText(/senha forte/i)).toBeInTheDocument()
  })

  it('deve incluir informações sobre benefícios da conta gratuita', () => {
    render(<CadastroClientePage />)
    
    expect(screen.getByText(/reservas ilimitadas/i)).toBeInTheDocument()
    expect(screen.getByText(/sem taxas ocultas/i)).toBeInTheDocument()
    expect(screen.getByText(/suporte 24\/7/i)).toBeInTheDocument()
  })

  it('deve permitir navegação para página de login', async () => {
    const user = userEvent.setup()
    
    render(<CadastroClientePage />)
    
    const loginLink = screen.getByText(/já tem uma conta\? faça login/i)
    await user.click(loginLink)
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('deve incluir dados de preferências no payload de registro', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockAuthUser, token: 'mock-token' })
    })
    
    render(<CadastroClientePage />)
    
    // Preenche campos básicos
    await user.type(screen.getByLabelText(/nome completo/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/email/i), 'maria@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/confirmar senha/i), 'senha123456')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/data de nascimento/i), '1990-05-15')
    
    // Seleciona preferências
    await user.click(screen.getByLabelText(/rock/i))
    await user.click(screen.getByLabelText(/jazz/i))
    await user.click(screen.getByLabelText(/intermediário/i))
    
    await user.click(screen.getByLabelText(/aceito os termos/i))
    await user.click(screen.getByRole('button', { name: /criar conta/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: expect.stringContaining('"musical_preferences":["rock","jazz"]')
      })
    })
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: expect.stringContaining('"experience_level":"intermediário"')
      })
    })
  })
})