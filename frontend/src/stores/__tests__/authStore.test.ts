import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'

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

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    ;(fetch as jest.Mock).mockClear()
    
    // Reset do store antes de cada teste
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.logout()
    })
  })

  it('deve inicializar com estado não autenticado', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('deve carregar dados do localStorage na inicialização', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'studioflow_token') return mockToken
      if (key === 'studioflow_user') return JSON.stringify(mockUser)
      return null
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('deve fazer login com sucesso', async () => {
    const loginData = {
      email: 'joao@example.com',
      password: 'password123'
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        token: mockToken
      })
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.login(loginData.email, loginData.password)
    })
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('studioflow_token', mockToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('studioflow_user', JSON.stringify(mockUser))
  })

  it('deve lidar com erro de login', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Credenciais inválidas'
      })
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      try {
        await result.current.login('wrong@email.com', 'wrongpassword')
      } catch (error) {
        expect(error).toEqual(new Error('Credenciais inválidas'))
      }
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('deve fazer registro com sucesso', async () => {
    const registerData = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password123',
      type: 'client' as const
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        token: mockToken
      })
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    await act(async () => {
      await result.current.register(registerData)
    })
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.isAuthenticated).toBe(true)
    
    expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    })
  })

  it('deve fazer logout corretamente', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Simula usuário logado
    act(() => {
      result.current.setUser(mockUser)
      result.current.setToken(mockToken)
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    
    // Faz logout
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('studioflow_token')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('studioflow_user')
  })

  it('deve atualizar perfil do usuário', async () => {
    const updatedUser = {
      ...mockUser,
      name: 'João Silva Santos',
      avatar: 'https://example.com/new-avatar.jpg'
    }
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: updatedUser })
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    // Simula usuário logado
    act(() => {
      result.current.setUser(mockUser)
      result.current.setToken(mockToken)
    })
    
    await act(async () => {
      await result.current.updateProfile({
        name: 'João Silva Santos',
        avatar: 'https://example.com/new-avatar.jpg'
      })
    })
    
    expect(result.current.user).toEqual(updatedUser)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('studioflow_user', JSON.stringify(updatedUser))
  })

  it('deve gerenciar estado de loading durante operações assíncronas', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    ;(fetch as jest.Mock).mockReturnValueOnce(promise)
    
    const { result } = renderHook(() => useAuthStore())
    
    // Inicia login
    const loginPromise = act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    // Verifica se está carregando
    expect(result.current.isLoading).toBe(true)
    
    // Resolve a promise
    resolvePromise!({
      ok: true,
      json: async () => ({ user: mockUser, token: mockToken })
    })
    
    await loginPromise
    
    // Verifica se parou de carregar
    expect(result.current.isLoading).toBe(false)
  })

  it('deve verificar se usuário é prestador', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Usuário cliente
    act(() => {
      result.current.setUser({ ...mockUser, type: 'client' })
    })
    
    expect(result.current.isProvider()).toBe(false)
    
    // Usuário prestador
    act(() => {
      result.current.setUser({ ...mockUser, type: 'provider' })
    })
    
    expect(result.current.isProvider()).toBe(true)
    
    // Usuário não logado
    act(() => {
      result.current.setUser(null)
    })
    
    expect(result.current.isProvider()).toBe(false)
  })

  it('deve verificar se usuário é cliente', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Usuário cliente
    act(() => {
      result.current.setUser({ ...mockUser, type: 'client' })
    })
    
    expect(result.current.isClient()).toBe(true)
    
    // Usuário prestador
    act(() => {
      result.current.setUser({ ...mockUser, type: 'provider' })
    })
    
    expect(result.current.isClient()).toBe(false)
    
    // Usuário não logado
    act(() => {
      result.current.setUser(null)
    })
    
    expect(result.current.isClient()).toBe(false)
  })

  it('deve lidar com dados corrompidos no localStorage', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'studioflow_user') return 'invalid json'
      if (key === 'studioflow_token') return mockToken
      return null
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    // Deve inicializar com estado limpo quando dados estão corrompidos
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('deve lidar com localStorage indisponível', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage not available')
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    // Deve funcionar mesmo sem localStorage
    act(() => {
      result.current.setUser(mockUser)
      result.current.setToken(mockToken)
    })
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('deve fazer refresh do token', async () => {
    const newToken = 'new-jwt-token'
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: newToken })
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    // Simula usuário logado
    act(() => {
      result.current.setToken(mockToken)
    })
    
    await act(async () => {
      await result.current.refreshToken()
    })
    
    expect(result.current.token).toBe(newToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('studioflow_token', newToken)
  })

  it('deve lidar com erro de refresh do token', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Token inválido' })
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    // Simula usuário logado
    act(() => {
      result.current.setUser(mockUser)
      result.current.setToken(mockToken)
    })
    
    await act(async () => {
      try {
        await result.current.refreshToken()
      } catch (error) {
        expect(error).toEqual(new Error('Token inválido'))
      }
    })
    
    // Deve fazer logout automático em caso de erro
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('deve validar token expirado', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Token válido (não expirado)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lp-38RNpyBo3_eFbXdKXYjKqB_9Qs6Iq8Qd6Z8Z8Z8Z'
    
    act(() => {
      result.current.setToken(validToken)
    })
    
    expect(result.current.isTokenExpired()).toBe(false)
    
    // Token expirado
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid'
    
    act(() => {
      result.current.setToken(expiredToken)
    })
    
    expect(result.current.isTokenExpired()).toBe(true)
  })

  it('deve manter estado consistente entre múltiplas instâncias', () => {
    const { result: result1 } = renderHook(() => useAuthStore())
    const { result: result2 } = renderHook(() => useAuthStore())
    
    act(() => {
      result1.current.setUser(mockUser)
      result1.current.setToken(mockToken)
    })
    
    // Ambas as instâncias devem ter o mesmo estado
    expect(result1.current.user).toEqual(result2.current.user)
    expect(result1.current.token).toEqual(result2.current.token)
    expect(result1.current.isAuthenticated).toBe(result2.current.isAuthenticated)
  })

  it('deve limpar estado ao fazer logout', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Simula usuário logado com dados
    act(() => {
      result.current.setUser(mockUser)
      result.current.setToken(mockToken)
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    
    // Faz logout
    act(() => {
      result.current.logout()
    })
    
    // Verifica se todos os dados foram limpos
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('deve incluir token no header das requisições autenticadas', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser })
    })
    
    const { result } = renderHook(() => useAuthStore())
    
    // Simula usuário logado
    act(() => {
      result.current.setToken(mockToken)
    })
    
    await act(async () => {
      await result.current.updateProfile({ name: 'Novo Nome' })
    })
    
    expect(fetch).toHaveBeenCalledWith('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`
      },
      body: JSON.stringify({ name: 'Novo Nome' })
    })
  })
})