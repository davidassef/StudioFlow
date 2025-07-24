import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'
import { useAuthStore } from '../../stores/authStore'

// Mock do authStore
jest.mock('../../stores/authStore')
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do fetch
global.fetch = jest.fn()

const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  type: 'client' as const,
  avatar: 'https://example.com/avatar.jpg'
}

const mockToken = 'mock-jwt-token'

// Componente de teste para usar o hook useAuth
const TestComponent = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isProvider,
    isClient
  } = useAuth()

  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="token">{token || 'null'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{isLoading.toString()}</div>
      <div data-testid="isProvider">{isProvider().toString()}</div>
      <div data-testid="isClient">{isClient().toString()}</div>
      
      <button
        data-testid="login-btn"
        onClick={() => login('test@example.com', 'password')}
      >
        Login
      </button>
      
      <button
        data-testid="register-btn"
        onClick={() => register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password',
          type: 'client'
        })}
      >
        Register
      </button>
      
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
      
      <button
        data-testid="update-profile-btn"
        onClick={() => updateProfile({ name: 'Updated Name' })}
      >
        Update Profile
      </button>
    </div>
  )
}

// Componente para testar uso fora do provider
const TestComponentWithoutProvider = () => {
  try {
    useAuth()
    return <div>Should not render</div>
  } catch (error) {
    return <div data-testid="error">{(error as Error).message}</div>
  }
}

describe('AuthContext', () => {
  const mockAuthStore = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateProfile: jest.fn(),
    setUser: jest.fn(),
    setToken: jest.fn(),
    refreshToken: jest.fn(),
    isTokenExpired: jest.fn(),
    isProvider: jest.fn(),
    isClient: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthStore.mockReturnValue(mockAuthStore)
    
    // Reset dos mocks
    Object.keys(mockAuthStore).forEach(key => {
      if (typeof mockAuthStore[key as keyof typeof mockAuthStore] === 'function') {
        ;(mockAuthStore[key as keyof typeof mockAuthStore] as jest.Mock).mockClear()
      }
    })
    
    // Estado inicial
    mockAuthStore.user = null
    mockAuthStore.token = null
    mockAuthStore.isAuthenticated = false
    mockAuthStore.isLoading = false
    mockAuthStore.isProvider.mockReturnValue(false)
    mockAuthStore.isClient.mockReturnValue(false)
  })

  it('deve renderizar o provider corretamente', () => {
    render(
      <AuthProvider>
        <div data-testid="child">Child Component</div>
      </AuthProvider>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('deve fornecer valores do authStore através do contexto', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('token')).toHaveTextContent('null')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('isLoading')).toHaveTextContent('false')
    expect(screen.getByTestId('isProvider')).toHaveTextContent('false')
    expect(screen.getByTestId('isClient')).toHaveTextContent('false')
  })

  it('deve refletir mudanças no estado de autenticação', () => {
    // Simula usuário logado
    mockAuthStore.user = mockUser
    mockAuthStore.token = mockToken
    mockAuthStore.isAuthenticated = true
    mockAuthStore.isProvider.mockReturnValue(false)
    mockAuthStore.isClient.mockReturnValue(true)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser))
    expect(screen.getByTestId('token')).toHaveTextContent(mockToken)
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
    expect(screen.getByTestId('isProvider')).toHaveTextContent('false')
    expect(screen.getByTestId('isClient')).toHaveTextContent('true')
  })

  it('deve chamar função de login do store', async () => {
    const user = userEvent.setup()
    mockAuthStore.login.mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('login-btn'))

    expect(mockAuthStore.login).toHaveBeenCalledWith('test@example.com', 'password')
  })

  it('deve chamar função de registro do store', async () => {
    const user = userEvent.setup()
    mockAuthStore.register.mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('register-btn'))

    expect(mockAuthStore.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      type: 'client'
    })
  })

  it('deve chamar função de logout do store', async () => {
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('logout-btn'))

    expect(mockAuthStore.logout).toHaveBeenCalled()
  })

  it('deve chamar função de atualização de perfil do store', async () => {
    const user = userEvent.setup()
    mockAuthStore.updateProfile.mockResolvedValue(undefined)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('update-profile-btn'))

    expect(mockAuthStore.updateProfile).toHaveBeenCalledWith({ name: 'Updated Name' })
  })

  it('deve refletir estado de loading', () => {
    mockAuthStore.isLoading = true

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('isLoading')).toHaveTextContent('true')
  })

  it('deve identificar usuário prestador corretamente', () => {
    mockAuthStore.user = { ...mockUser, type: 'provider' }
    mockAuthStore.isAuthenticated = true
    mockAuthStore.isProvider.mockReturnValue(true)
    mockAuthStore.isClient.mockReturnValue(false)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('isProvider')).toHaveTextContent('true')
    expect(screen.getByTestId('isClient')).toHaveTextContent('false')
  })

  it('deve identificar usuário cliente corretamente', () => {
    mockAuthStore.user = { ...mockUser, type: 'client' }
    mockAuthStore.isAuthenticated = true
    mockAuthStore.isProvider.mockReturnValue(false)
    mockAuthStore.isClient.mockReturnValue(true)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('isProvider')).toHaveTextContent('false')
    expect(screen.getByTestId('isClient')).toHaveTextContent('true')
  })

  it('deve lançar erro quando useAuth é usado fora do AuthProvider', () => {
    // Suprime o erro do console para este teste
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<TestComponentWithoutProvider />)

    expect(screen.getByTestId('error')).toHaveTextContent(
      'useAuth deve ser usado dentro de um AuthProvider'
    )

    consoleSpy.mockRestore()
  })

  it('deve manter referências estáveis das funções', () => {
    let firstRender: any
    let secondRender: any

    const TestStabilityComponent = () => {
      const auth = useAuth()
      
      if (!firstRender) {
        firstRender = auth
      } else {
        secondRender = auth
      }

      return <div>Test</div>
    }

    const { rerender } = render(
      <AuthProvider>
        <TestStabilityComponent />
      </AuthProvider>
    )

    rerender(
      <AuthProvider>
        <TestStabilityComponent />
      </AuthProvider>
    )

    // As funções devem manter a mesma referência entre renders
    expect(firstRender.login).toBe(secondRender.login)
    expect(firstRender.register).toBe(secondRender.register)
    expect(firstRender.logout).toBe(secondRender.logout)
    expect(firstRender.updateProfile).toBe(secondRender.updateProfile)
    expect(firstRender.isProvider).toBe(secondRender.isProvider)
    expect(firstRender.isClient).toBe(secondRender.isClient)
  })

  it('deve lidar com múltiplos componentes filhos', () => {
    const ChildComponent1 = () => {
      const { isAuthenticated } = useAuth()
      return <div data-testid="child1">{isAuthenticated.toString()}</div>
    }

    const ChildComponent2 = () => {
      const { user } = useAuth()
      return <div data-testid="child2">{user?.name || 'No user'}</div>
    }

    mockAuthStore.user = mockUser
    mockAuthStore.isAuthenticated = true

    render(
      <AuthProvider>
        <ChildComponent1 />
        <ChildComponent2 />
      </AuthProvider>
    )

    expect(screen.getByTestId('child1')).toHaveTextContent('true')
    expect(screen.getByTestId('child2')).toHaveTextContent('João Silva')
  })

  it('deve funcionar com componentes aninhados', () => {
    const NestedComponent = () => {
      const { token } = useAuth()
      return <div data-testid="nested">{token || 'No token'}</div>
    }

    const ParentComponent = () => {
      return (
        <div>
          <NestedComponent />
        </div>
      )
    }

    mockAuthStore.token = mockToken

    render(
      <AuthProvider>
        <ParentComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('nested')).toHaveTextContent(mockToken)
  })

  it('deve propagar erros das funções do store', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Login failed'
    mockAuthStore.login.mockRejectedValue(new Error(errorMessage))

    const TestErrorComponent = () => {
      const { login } = useAuth()
      const [error, setError] = React.useState<string | null>(null)

      const handleLogin = async () => {
        try {
          await login('test@example.com', 'password')
        } catch (err) {
          setError((err as Error).message)
        }
      }

      return (
        <div>
          <button data-testid="login-btn" onClick={handleLogin}>
            Login
          </button>
          {error && <div data-testid="error">{error}</div>}
        </div>
      )
    }

    render(
      <AuthProvider>
        <TestErrorComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('login-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
    })
  })

  it('deve atualizar quando o store muda', () => {
    const TestUpdateComponent = () => {
      const { user, isAuthenticated } = useAuth()
      
      return (
        <div>
          <div data-testid="auth-status">{isAuthenticated.toString()}</div>
          <div data-testid="user-name">{user?.name || 'No user'}</div>
        </div>
      )
    }

    const { rerender } = render(
      <AuthProvider>
        <TestUpdateComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('false')
    expect(screen.getByTestId('user-name')).toHaveTextContent('No user')

    // Simula mudança no store
    mockAuthStore.user = mockUser
    mockAuthStore.isAuthenticated = true

    rerender(
      <AuthProvider>
        <TestUpdateComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status')).toHaveTextContent('true')
    expect(screen.getByTestId('user-name')).toHaveTextContent('João Silva')
  })
})