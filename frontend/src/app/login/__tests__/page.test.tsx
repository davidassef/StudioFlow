import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'
import { useAuth } from '../../../contexts/AuthContext'

// Mocks
jest.mock('next/navigation')
jest.mock('../../../contexts/AuthContext')
// Removendo mock do Button para usar o componente real

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>
const mockLogin = jest.fn()

const mockAuthUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  type: 'client' as const,
  avatar: null
}

describe('LoginPage', () => {
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
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      token: null,
      isLoading: false
    })
  })

  it('deve renderizar o formulário de login', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Entrar no StudioFlow')).toBeInTheDocument()
    expect(screen.getByText('Faça login para acessar sua conta')).toBeInTheDocument()
    
    // Campos do formulário
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    
    // Botões e links
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByText(/não tem uma conta\?/i)).toBeInTheDocument()
    expect(screen.getByText(/cadastre-se/i)).toBeInTheDocument()
    expect(screen.getByText(/voltar ao início/i)).toBeInTheDocument()
  })

  it('deve fazer login com sucesso', async () => {
    const user = userEvent.setup()
    
    mockLogin.mockResolvedValueOnce(undefined)
    
    render(<LoginPage />)
    
    // Preenche os campos
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    
    // Submete o formulário
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('joao@example.com', 'senha123456')
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup()
    
    render(<LoginPage />)
    
    // Tenta submeter sem preencher campos - o HTML5 validation vai impedir
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha/i)
    
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('deve lidar com erro de login', async () => {
    const user = userEvent.setup()
    
    mockLogin.mockRejectedValueOnce(new Error('Credenciais inválidas'))
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha-errada')
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/erro ao fazer login/i)).toBeInTheDocument()
    })
  })

  it('deve mostrar estado de loading durante login', async () => {
    const user = userEvent.setup()
    
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    mockLogin.mockReturnValue(promise)
    
    render(<LoginPage />)
    
    await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha123456')
    
    // Inicia login
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    
    // Verifica estado de loading
    expect(screen.getByText(/entrando.../i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrando.../i })).toBeDisabled()
    
    // Resolve a promise
    resolvePromise!(undefined)
    
    await waitFor(() => {
      expect(screen.queryByText(/entrando.../i)).not.toBeInTheDocument()
    })
  })

  it('deve ter links de navegação corretos', () => {
    render(<LoginPage />)
    
    const registerLink = screen.getByRole('link', { name: /cadastre-se/i })
    const homeLink = screen.getByRole('link', { name: /voltar ao início/i })
    
    expect(registerLink).toHaveAttribute('href', '/register')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})