import { create } from 'zustand'
// TEMPORARY: commented for theme testing - re-enable after testing
// import { supabase, auth, db } from '@/lib/supabase'

// TEMPORARY MOCKS for theme testing
const auth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  signIn: async (email: string, password: string) => ({ data: null, error: new Error('Auth disabled for testing') }),
  signUp: async (email: string, password: string, profile: any) => ({ data: null, error: new Error('Auth disabled for testing') }),
  signOut: async () => ({ error: null })
}
const db = {
  updateProfile: async (id: string, updates: any) => ({ data: null, error: new Error('DB disabled for testing') }),
  getProfile: async (id: string) => ({ data: null, error: new Error('DB disabled for testing') })
}

export interface User {
  id: string
  email: string
  nome?: string
  telefone?: string
  user_type?: 'CLIENTE' | 'PRESTADOR' | 'ADMIN'
  created_at?: string
  updated_at?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  nome: string
  email: string
  password: string
  telefone?: string
  user_type?: 'CLIENTE' | 'PRESTADOR' | 'ADMIN'
}

interface AuthState {
  user: User | null
  profile: any
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
  loadProfile: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    const session = await auth.getSession()
    if (session) {
      set({
        user: session.user,
        isAuthenticated: true
      })
      await get().loadProfile()
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    const { data, error } = await auth.signIn(email, password)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    set({
      user: data.user,
      isAuthenticated: true,
      isLoading: false
    })

    // Load profile
    await get().loadProfile()
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null })

    const { data: authData, error } = await auth.signUp(
      data.email,
      data.password,
      {
        nome: data.nome,
        telefone: data.telefone,
        user_type: data.user_type || 'CLIENTE'
      }
    )

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    set({
      user: authData.user,
      isAuthenticated: true,
      isLoading: false
    })

    // Create profile
    if (authData.user) {
      await db.updateProfile(authData.user.id, {
        nome: data.nome,
        telefone: data.telefone,
        user_type: data.user_type || 'CLIENTE'
      })
    }
  },

  logout: async () => {
    await auth.signOut()
    set({
      user: null,
      profile: null,
      isAuthenticated: false
    })
  },

  updateProfile: async (updates: Partial<User>) => {
    if (!get().user) return

    const { data, error } = await db.updateProfile(get().user!.id, updates)

    if (!error && data) {
      set({ profile: data })
    }
  },

  refreshToken: async () => {
    // Supabase handles token refresh automatically
    const session = await auth.getSession()
    if (session) {
      set({ user: session.user, isAuthenticated: true })
    }
  },

  clearError: () => {
    set({ error: null })
  },

  isProvider: () => {
    return get().profile?.user_type === 'PRESTADOR'
  },

  isClient: () => {
    return get().profile?.user_type === 'CLIENTE'
  },

  loadProfile: async () => {
    if (!get().user) return

    const { data, error } = await db.getProfile(get().user!.id)

    if (!error && data) {
      set({ profile: data })
    }
  }
}))
