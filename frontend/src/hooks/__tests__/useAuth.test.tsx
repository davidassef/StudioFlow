import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { AuthContext } from '@/contexts/AuthContext'
import React from 'react'

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

// Mock user data
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  type: 'client' as const,
  avatar: 'avatar.jpg'
}

// Mock token
const mockToken = 'mock-jwt-token'

// Wrapper para prover contexto de autenticação
const createWrapper = (initialUser = null, initialToken = null) => {
  const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState(initialUser)
    const [token, setToken] = React.useState(initialToken)
    const [loading, setLoading] = React.useState(false)

    const login = async (email: string, password: string) => {
      setLoading(true)
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setToken(data.token)
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          return { success: true }
        } else {
          const error = await response.json()
          return { success: false, error: error.message }
        }
      } catch (error) {
        return { success: false, error: 'Erro de conexão' }
      } finally {
        setLoading(false)
      }
    }

    const register = async (userData: any) => {
      setLoading(true)
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setToken(data.token)
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          return { success: true }
        } else {
          const error = await response.json()
          return { success: false, error: error.message }
        }
      } catch (error) {
        return { success: false, error: 'Erro de conexão' }
      } finally {
        setLoading(false)
      }
    }

    const logout = () => {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    const updateProfile = async (profileData: any) => {
      setLoading(true)
      try {
        const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profileData)
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
          return { success: true }
        } else {
          const error = await response.json()
          return { success: false, error: error.message }
        }
      } catch (error) {
        return { success: false, error: 'Erro de conexão' }
      } finally {
        setLoading(false)
      }
    }

    const value = {
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      isClient: user?.type === 'client',
      isProvider: user?.type === 'provider'
    }

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    )
  }

  return AuthProvider
}

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    ;(fetch as jest.Mock).mockClear()
  })

  it('deve retornar estado inicial quando não autenticado', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isClient).toBe(false)
    expect(result.current.isProvider).toBe(false)
  })

  it('deve retornar dados do usuário quando autenticado', () => {
    const wrapper = createWrapper(mockUser, mockToken)
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isClient).toBe(true)
    expect(result.current.isProvider).toBe(false)
  })

  it('deve identificar corretamente tipo de usuário provider', () => {
    const providerUser = { ...mockUser, type: 'provider' as const }
    const wrapper = createWrapper(providerUser, mockToken)
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isClient).toBe(false)
    expect(result.current.isProvider).toBe(true)
  })

  it('deve fazer login com sucesso', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        token: mockToken
      })
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    let loginResult
    await act(async () => {
      loginResult = await result.current.login('joao@example.com', 'password123')
    })

    expect(loginResult).toEqual({ success: true })
    expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'joao@example.com', password: 'password123' })
    })
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
  })

  it('deve lidar com erro de login', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Credenciais inválidas'
      })
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    let loginResult
    await act(async () => {
      loginResult = await result.current.login('joao@example.com', 'wrongpassword')
    })

    expect(loginResult).toEqual({ success: false, error: 'Credenciais inválidas' })
    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  it('deve lidar com erro de conexão no login', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    let loginResult
    await act(async () => {
      loginResult = await result.current.login('joao@example.com', 'password123')
    })

    expect(loginResult).toEqual({ success: false, error: 'Erro de conexão' })
  })

  it('deve fazer registro com sucesso', async () => {
    const registerData = {
      name: 'João Silva',
      email: 'joao@example.com',
      password: 'password123',
      type: 'client'
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        token: mockToken
      })
    })

    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    let registerResult
    await act(async () => {
      registerResult = await result.current.register(registerData)
    })

    expect(registerResult).toEqual({ success: true })
    expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    })
  })

  it('deve fazer logout corretamente', () => {
    const wrapper = createWrapper(mockUser, mockToken)
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })

  it('deve atualizar perfil com sucesso', async () => {
    const updatedUser = { ...mockUser, name: 'João Silva Santos' }
    const profileData = { name: 'João Silva Santos' }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: updatedUser
      })
    })

    const wrapper = createWrapper(mockUser, mockToken)
    const { result } = renderHook(() => useAuth(), { wrapper })

    let updateResult
    await act(async () => {
      updateResult = await result.current.updateProfile(profileData)
    })

    expect(updateResult).toEqual({ success: true })
    expect(fetch).toHaveBeenCalledWith('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`
      },
      body: JSON.stringify(profileData)
    })
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedUser))
  })

  it('deve lidar com erro na atualização de perfil', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Dados inválidos'
      })
    })

    const wrapper = createWrapper(mockUser, mockToken)
    const { result } = renderHook(() => useAuth(), { wrapper })

    let updateResult
    await act(async () => {
      updateResult = await result.current.updateProfile({ name: '' })
    })

    expect(updateResult).toEqual({ success: false, error: 'Dados inválidos' })
  })

  it('deve gerenciar estado de loading corretamente', async () => {
    ;(fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ user: mockUser, token: mockToken })
        }), 100)
      )
    )

    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.loading).toBe(false)

    act(() => {
      result.current.login('joao@example.com', 'password123')
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150))
    })

    expect(result.current.loading).toBe(false)
  })

  it('deve lançar erro quando usado fora do AuthProvider', () => {
    // Captura erro do console para evitar poluição nos testes
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth deve ser usado dentro de um AuthProvider')
    
    consoleSpy.mockRestore()
  })
})