import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock do api
jest.mock('@/lib/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

import { api } from '@/lib/api'

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
  nome: 'João Silva',
  email: 'joao@example.com',
  type: 'client' as const,
  avatar: 'https://example.com/avatar.jpg'
}

const mockToken = 'mock-jwt-token'

// Componente de teste para usar o hook useAuth
const TestComponent = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  } = useAuth()

  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{isLoading.toString()}</div>
      
      <button
        data-testid="login-btn"
        onClick={() => login('test@example.com', 'password')}
      >
        Login
      </button>
      
      <button
        data-testid="register-btn"
        onClick={() => register({
          nome: 'Test User',
          email: 'test@example.com',
          password: 'password',
          password_confirm: 'password',
          telefone: '',
          user_type: 'cliente'
        })}
      >
        Register
      </button>
      
      <button data-testid="logout-btn" onClick={logout}>
        Logout
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
  const mockApiPost = api.post as jest.MockedFunction<typeof api.post>

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  it('deve renderizar o provider corretamente', () => {
    render(
      <AuthProvider>
        <div data-testid="child">Child Component</div>
      </AuthProvider>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('deve fornecer valores iniciais através do contexto', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
    expect(screen.getByTestId('isLoading')).toHaveTextContent('false')
  })

  it('deve refletir mudanças no estado de autenticação', () => {
    // Simula usuário logado no localStorage
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser)
      if (key === 'token') return mockToken
      if (key === 'refreshToken') return 'mock-refresh-token'
      return null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser))
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
  })

  it('deve chamar função de login', async () => {
    const user = userEvent.setup()
    mockApiPost.mockResolvedValue({
      data: {
        access: 'access-token',
        refresh: 'refresh-token',
        user: mockUser
      }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('login-btn'))

    expect(mockApiPost).toHaveBeenCalledWith('/api/auth/login/', {
      email: 'test@example.com',
      password: 'password'
    })
  })

  it('deve chamar função de registro', async () => {
    const user = userEvent.setup()
    mockApiPost.mockResolvedValue({
      data: {
        access: 'access-token',
        refresh: 'refresh-token',
        user: mockUser
      }
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('register-btn'))

    expect(mockApiPost).toHaveBeenCalledWith('/api/v1/users/register/', {
      nome: 'Test User',
      email: 'test@example.com',
      password: 'password',
      password_confirm: 'password',
      telefone: '',
      user_type: 'cliente'
    })
  })

  it('deve chamar função de logout', async () => {
    const user = userEvent.setup()
    
    // Simula usuário logado
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser)
      if (key === 'token') return 'mock-token'
      if (key === 'refreshToken') return 'mock-refresh-token'
      return null
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('logout-btn'))

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })

  it('deve mostrar estado de loading durante operações assíncronas', async () => {
    const user = userEvent.setup()
    
    // Mock da API com delay
    mockApiPost.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => resolve({
        data: {
          access: 'access-token',
          refresh: 'refresh-token',
          user: mockUser
        }
      }), 100)
    }))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Verifica estado inicial
    expect(screen.getByTestId('isLoading')).toHaveTextContent('false')
    
    // Clica no login
    await act(async () => {
      await user.click(screen.getByTestId('login-btn'))
    })
    
    // Aguarda a operação completar
    await waitFor(() => {
      expect(screen.getByTestId('isLoading')).toHaveTextContent('false')
    }, { timeout: 3000 })
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



  it('deve lidar com múltiplos componentes filhos', async () => {
    // Simula usuário logado no localStorage ANTES do render
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser)
      if (key === 'token') return 'mock-token'
      if (key === 'refreshToken') return 'mock-refresh-token'
      return null
    })

    const ChildComponent1 = () => {
      const { isAuthenticated } = useAuth()
      return <div data-testid="child1">{isAuthenticated.toString()}</div>
    }

    const ChildComponent2 = () => {
      const { user } = useAuth()
      return <div data-testid="child2">{user?.nome || 'No user'}</div>
    }

    render(
      <AuthProvider>
        <ChildComponent1 />
        <ChildComponent2 />
      </AuthProvider>
    )

    // Aguarda o useEffect processar o localStorage
    await waitFor(() => {
      expect(screen.getByTestId('child1')).toHaveTextContent('true')
      expect(screen.getByTestId('child2')).toHaveTextContent('João Silva')
    })
  })
})