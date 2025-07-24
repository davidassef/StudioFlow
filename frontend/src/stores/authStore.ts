import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiUtils } from '@/lib/api'

export interface User {
  id: string
  name: string
  email: string
  type: 'client' | 'provider'
  avatar?: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  type: 'client' | 'provider'
  phone?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
  isProvider: () => boolean
  isClient: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Erro ao fazer login')
          }

          const { user, token } = await response.json()
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Erro ao criar conta')
          }

          const { user, token } = await response.json()
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      updateProfile: async (data: Partial<User>) => {
        const { user, token } = get()
        if (!user || !token) {
          throw new Error('Usuário não autenticado')
        }

        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Erro ao atualizar perfil')
          }

          const updatedUser = await response.json()
          
          set({
            user: { ...user, ...updatedUser },
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido',
          })
          throw error
        }
      },

      refreshToken: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const { token: newToken, user } = await response.json()
            set({ token: newToken, user })
          } else {
            // Token inválido, fazer logout
            get().logout()
          }
        } catch (error) {
          // Em caso de erro, fazer logout
          get().logout()
        }
      },

      clearError: () => {
        set({ error: null })
      },

      isProvider: () => {
        const { user } = get()
        return user?.type === 'provider'
      },

      isClient: () => {
        const { user } = get()
        return user?.type === 'client'
      },
    }),
    {
      name: 'studioflow-auth',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Hook para facilitar o uso
export const useAuth = () => {
  return useAuthStore()
}