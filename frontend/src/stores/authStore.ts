import { create } from 'zustand'

// TEMPORARY: Mock version of authStore for theme testing
// Real implementation will be restored after theme testing

export interface User {
  id: string
  email: string
  name?: string
}

export interface Profile {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'cliente'
  phone?: string
  avatar?: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions (mocked for theme testing)
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, profile: Partial<Profile>) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  loadProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    console.log('Auth mocked for theme testing')
    set({ isLoading: false })
  },

  login: async (email: string, password: string) => {
    console.log('Login mocked for theme testing')
    set({ isLoading: false, error: 'Auth disabled for theme testing' })
  },

  register: async (email: string, password: string, profile: Partial<Profile>) => {
    console.log('Register mocked for theme testing')
    set({ isLoading: false, error: 'Auth disabled for theme testing' })
  },

  logout: async () => {
    console.log('Logout mocked for theme testing')
    set({ 
      user: null, 
      profile: null, 
      isAuthenticated: false, 
      isLoading: false, 
      error: null 
    })
  },

  updateProfile: async (updates: Partial<Profile>) => {
    console.log('Update profile mocked for theme testing')
    set({ error: 'Auth disabled for theme testing' })
  },

  loadProfile: async () => {
    console.log('Load profile mocked for theme testing')
    set({ error: 'Auth disabled for theme testing' })
  },

  clearError: () => {
    set({ error: null })
  }
}))

// End of mock authStore