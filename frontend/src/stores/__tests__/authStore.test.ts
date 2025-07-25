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
    localStorageMock.clear()
    localStorageMock.getItem.mockReturnValue(null)
    ;(fetch as jest.Mock).mockClear()
    // Limpa o estado do store
    const store = useAuthStore.getState()
    store.user = null
    store.token = null
    store.isAuthenticated = false
    store.isLoading = false
    store.error = null
  })

  it('deve inicializar com estado não autenticado', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('deve ter estado inicial correto', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
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

  it('deve fazer logout corretamente', async () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Simula login primeiro
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        token: mockToken
      })
    })
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    
    // Faz logout
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('deve atualizar perfil do usuário', async () => {
    const updatedUser = {
      ...mockUser,
      name: 'João Silva Santos',
      avatar: 'https://example.com/new-avatar.jpg'
    }
    
    const { result } = renderHook(() => useAuthStore())
    
    // Simula login primeiro
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: mockUser,
        token: mockToken
      })
    })
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    // Mock para atualização de perfil
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedUser
    })
    
    await act(async () => {
      await result.current.updateProfile({
        name: 'João Silva Santos',
        avatar: 'https://example.com/new-avatar.jpg'
      })
    })
    
    expect(result.current.user).toEqual(updatedUser)
  })

  it('deve verificar se store está funcionando', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current).toBeDefined()
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

})