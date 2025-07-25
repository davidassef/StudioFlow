'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '@/lib/api'

interface User {
  id: number
  email: string
  nome: string
  telefone?: string
  user_type: 'ADMIN' | 'CLIENTE' | 'PRESTADOR'
  date_joined: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  showAuthModal: boolean
  authAction: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SHOW_AUTH_MODAL'; payload: string }
  | { type: 'HIDE_AUTH_MODAL' }

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
  showAuthModal: false,
  authAction: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
        isAuthenticated: true,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isLoading: false,
        isAuthenticated: false,
      }
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      }
    case 'SHOW_AUTH_MODAL':
      return {
        ...state,
        showAuthModal: true,
        authAction: action.payload,
      }
    case 'HIDE_AUTH_MODAL':
      return {
        ...state,
        showAuthModal: false,
        authAction: null,
      }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<{ success: boolean; user?: any; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
  requireAuth: (action: string) => boolean
  openAuthModal: (action: string) => void
  hideAuthModal: () => void
}

interface RegisterData {
  email: string
  nome: string
  telefone?: string
  user_type?: 'ADMIN' | 'CLIENTE' | 'PRESTADOR'
  password: string
  password_confirm: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Verificar se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const userData = localStorage.getItem('user')

    if (token && refreshToken && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token, refreshToken },
        })
        // Configurar token no axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      
      const response = await api.post('/auth/login/', {
        email,
        password,
      })

      const { user, refresh, access } = response.data

      // Salvar no localStorage
      localStorage.setItem('token', access)
      localStorage.setItem('refreshToken', refresh)
      localStorage.setItem('user', JSON.stringify(user))

      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token: access,
          refreshToken: refresh,
        },
      })
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      
      const response = await api.post('/v1/users/register/', userData)

      const { access, refresh, user } = response.data

      // Salvar no localStorage
      localStorage.setItem('token', access)
      localStorage.setItem('refreshToken', refresh)
      localStorage.setItem('user', JSON.stringify(user))

      // Configurar token no axios
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token: access,
          refreshToken: refresh,
        },
      })
      
      return { success: true, user }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' })
      
      let errorMessage = 'Erro ao registrar usuário'
      
      if (error.response?.data) {
        // Capturar mensagens específicas do backend
        if (error.response.data.password) {
          errorMessage = error.response.data.password[0] || 'Erro na senha'
        } else if (error.response.data.email) {
          errorMessage = error.response.data.email[0] || 'Erro no email'
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    // Remover do localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    // Remover token do axios
    delete api.defaults.headers.common['Authorization']

    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await api.patch(`/users/${state.user?.id}/`, userData)
      const updatedUser = response.data
      
      // Atualizar localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    } catch (error) {
      throw error
    }
  }

  const requireAuth = (action: string): boolean => {
    if (!state.isAuthenticated) {
      dispatch({ type: 'SHOW_AUTH_MODAL', payload: action })
      return false
    }
    return true
  }

  const openAuthModal = (action: string) => {
    dispatch({ type: 'SHOW_AUTH_MODAL', payload: action })
  }

  const hideAuthModal = () => {
    dispatch({ type: 'HIDE_AUTH_MODAL' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    requireAuth,
    openAuthModal,
    hideAuthModal,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}