import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import CadastroEstudioPage from '../page'
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
  name: 'João Silva',
  email: 'joao@example.com',
  type: 'provider' as const,
  avatar: null
}

describe('CadastroEstudioPage', () => {
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
      user: mockAuthUser,
      isAuthenticated: true,
      isProvider: () => true,
      isClient: () => false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      token: 'mock-token',
      isLoading: false
    })
    
    ;(fetch as jest.Mock).mockClear()
  })

  it('deve renderizar o formulário de cadastro de estúdio', () => {
    render(<CadastroEstudioPage />)
    
    expect(screen.getByText('Cadastro de Estúdio')).toBeInTheDocument()
    expect(screen.getByText('Complete as informações do seu estúdio')).toBeInTheDocument()
    
    // Campos básicos
    expect(screen.getByLabelText(/nome do estúdio/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cep/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    
    // Campos de funcionamento
    expect(screen.getByText('Horário de Funcionamento')).toBeInTheDocument()
    
    // Campos de preço
    expect(screen.getByLabelText(/preço por hora/i)).toBeInTheDocument()
    
    // Botões
    expect(screen.getByRole('button', { name: /cadastrar estúdio/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('deve preencher e submeter o formulário com sucesso', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'studio-123', message: 'Estúdio cadastrado com sucesso' })
    })
    
    render(<CadastroEstudioPage />)
    
    // Preenche campos obrigatórios
    await user.type(screen.getByLabelText(/nome do estúdio/i), 'Estúdio Musical XYZ')
    await user.type(screen.getByLabelText(/descrição/i), 'Estúdio profissional com equipamentos de alta qualidade')
    await user.type(screen.getByLabelText(/endereço/i), 'Rua das Flores, 123')
    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo')
    await user.selectOptions(screen.getByLabelText(/estado/i), 'SP')
    await user.type(screen.getByLabelText(/cep/i), '01234-567')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/preço por hora/i), '150')
    
    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /cadastrar estúdio/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/studios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: expect.stringContaining('"name":"Estúdio Musical XYZ"')
      })
    })
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard-prestador')
    })
  })

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    // Tenta submeter sem preencher campos
    await user.click(screen.getByRole('button', { name: /cadastrar estúdio/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
    })
    
    expect(fetch).not.toHaveBeenCalled()
  })

  it('deve validar formato do CEP', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    await user.type(screen.getByLabelText(/cep/i), '123')
    await user.tab() // Sai do campo para disparar validação
    
    await waitFor(() => {
      expect(screen.getByText(/cep deve ter o formato 00000-000/i)).toBeInTheDocument()
    })
  })

  it('deve validar formato do telefone', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    await user.type(screen.getByLabelText(/telefone/i), '123')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/telefone deve ter o formato \(00\) 00000-0000/i)).toBeInTheDocument()
    })
  })

  it('deve validar preço mínimo', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    await user.type(screen.getByLabelText(/preço por hora/i), '0')
    await user.tab()
    
    await waitFor(() => {
      expect(screen.getByText(/preço deve ser maior que zero/i)).toBeInTheDocument()
    })
  })

  it('deve permitir upload de imagens', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    const file = new File(['fake image'], 'studio.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/imagens do estúdio/i)
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('studio.jpg')).toBeInTheDocument()
    })
  })

  it('deve validar tipos de arquivo de imagem', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    const file = new File(['fake file'], 'document.pdf', { type: 'application/pdf' })
    const fileInput = screen.getByLabelText(/imagens do estúdio/i)
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText(/apenas imagens são permitidas/i)).toBeInTheDocument()
    })
  })

  it('deve limitar número de imagens', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    const files = Array.from({ length: 6 }, (_, i) => 
      new File(['fake image'], `image${i}.jpg`, { type: 'image/jpeg' })
    )
    
    const fileInput = screen.getByLabelText(/imagens do estúdio/i)
    
    await user.upload(fileInput, files)
    
    await waitFor(() => {
      expect(screen.getByText(/máximo de 5 imagens permitidas/i)).toBeInTheDocument()
    })
  })

  it('deve permitir seleção de equipamentos', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    // Verifica se os equipamentos estão disponíveis
    expect(screen.getByLabelText(/microfones/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/instrumentos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mesa de som/i)).toBeInTheDocument()
    
    // Seleciona alguns equipamentos
    await user.click(screen.getByLabelText(/microfones/i))
    await user.click(screen.getByLabelText(/instrumentos/i))
    
    expect(screen.getByLabelText(/microfones/i)).toBeChecked()
    expect(screen.getByLabelText(/instrumentos/i)).toBeChecked()
  })

  it('deve configurar horários de funcionamento', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    // Configura horário para segunda-feira
    const mondayStart = screen.getByLabelText(/segunda-feira - abertura/i)
    const mondayEnd = screen.getByLabelText(/segunda-feira - fechamento/i)
    
    await user.type(mondayStart, '08:00')
    await user.type(mondayEnd, '18:00')
    
    expect(mondayStart).toHaveValue('08:00')
    expect(mondayEnd).toHaveValue('18:00')
  })

  it('deve lidar com erro de submissão', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Erro interno do servidor' })
    })
    
    render(<CadastroEstudioPage />)
    
    // Preenche campos mínimos
    await user.type(screen.getByLabelText(/nome do estúdio/i), 'Estúdio Teste')
    await user.type(screen.getByLabelText(/descrição/i), 'Descrição teste')
    await user.type(screen.getByLabelText(/endereço/i), 'Endereço teste')
    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo')
    await user.selectOptions(screen.getByLabelText(/estado/i), 'SP')
    await user.type(screen.getByLabelText(/cep/i), '01234-567')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/preço por hora/i), '100')
    
    await user.click(screen.getByRole('button', { name: /cadastrar estúdio/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/erro interno do servidor/i)).toBeInTheDocument()
    })
  })

  it('deve cancelar e voltar para página anterior', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard-prestador')
  })

  it('deve mostrar estado de loading durante submissão', async () => {
    const user = userEvent.setup()
    
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    ;(fetch as jest.Mock).mockReturnValue(promise)
    
    render(<CadastroEstudioPage />)
    
    // Preenche campos mínimos
    await user.type(screen.getByLabelText(/nome do estúdio/i), 'Estúdio Teste')
    await user.type(screen.getByLabelText(/descrição/i), 'Descrição teste')
    await user.type(screen.getByLabelText(/endereço/i), 'Endereço teste')
    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo')
    await user.selectOptions(screen.getByLabelText(/estado/i), 'SP')
    await user.type(screen.getByLabelText(/cep/i), '01234-567')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/preço por hora/i), '100')
    
    // Inicia submissão
    await user.click(screen.getByRole('button', { name: /cadastrar estúdio/i }))
    
    // Verifica estado de loading
    expect(screen.getByText(/cadastrando.../i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cadastrando.../i })).toBeDisabled()
    
    // Resolve a promise
    resolvePromise!({
      ok: true,
      json: async () => ({ id: 'studio-123' })
    })
    
    await waitFor(() => {
      expect(screen.queryByText(/cadastrando.../i)).not.toBeInTheDocument()
    })
  })

  it('deve redirecionar usuário não autenticado', () => {
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
    
    render(<CadastroEstudioPage />)
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('deve redirecionar usuário que não é prestador', () => {
    mockUseAuth.mockReturnValue({
      user: { ...mockAuthUser, type: 'client' },
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
    
    render(<CadastroEstudioPage />)
    
    expect(mockPush).toHaveBeenCalledWith('/feed')
  })

  it('deve formatar automaticamente CEP durante digitação', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    const cepInput = screen.getByLabelText(/cep/i)
    
    await user.type(cepInput, '01234567')
    
    expect(cepInput).toHaveValue('01234-567')
  })

  it('deve formatar automaticamente telefone durante digitação', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    const phoneInput = screen.getByLabelText(/telefone/i)
    
    await user.type(phoneInput, '11999999999')
    
    expect(phoneInput).toHaveValue('(11) 99999-9999')
  })

  it('deve permitir remover imagens adicionadas', async () => {
    const user = userEvent.setup()
    
    render(<CadastroEstudioPage />)
    
    const file = new File(['fake image'], 'studio.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/imagens do estúdio/i)
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('studio.jpg')).toBeInTheDocument()
    })
    
    // Remove a imagem
    const removeButton = screen.getByRole('button', { name: /remover/i })
    await user.click(removeButton)
    
    expect(screen.queryByText('studio.jpg')).not.toBeInTheDocument()
  })

  it('deve incluir período de teste gratuito no cadastro', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'studio-123' })
    })
    
    render(<CadastroEstudioPage />)
    
    // Verifica se o período de teste está mencionado
    expect(screen.getByText(/período de teste gratuito/i)).toBeInTheDocument()
    expect(screen.getByText(/30 dias/i)).toBeInTheDocument()
    
    // Preenche e submete
    await user.type(screen.getByLabelText(/nome do estúdio/i), 'Estúdio Teste')
    await user.type(screen.getByLabelText(/descrição/i), 'Descrição teste')
    await user.type(screen.getByLabelText(/endereço/i), 'Endereço teste')
    await user.type(screen.getByLabelText(/cidade/i), 'São Paulo')
    await user.selectOptions(screen.getByLabelText(/estado/i), 'SP')
    await user.type(screen.getByLabelText(/cep/i), '01234-567')
    await user.type(screen.getByLabelText(/telefone/i), '(11) 99999-9999')
    await user.type(screen.getByLabelText(/preço por hora/i), '100')
    
    await user.click(screen.getByRole('button', { name: /cadastrar estúdio/i }))
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/studios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        },
        body: expect.stringContaining('"trial_period":true')
      })
    })
  })
})