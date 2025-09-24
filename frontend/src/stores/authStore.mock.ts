import { create } from 'zustand'

// TEMPORARY: Mock version of authStore for theme testing
// Real implementation is commented out below

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

/* ORIGINAL IMPLEMENTATION - UNCOMMENT AFTER THEME TESTING

import { create } from 'zustand'
import { supabase, auth, db } from '@/lib/supabase'

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

  // Actions
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
    
    try {
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        set({ error: error.message, isLoading: false })
        return
      }

      if (data?.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        })

        await get().loadProfile()
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro no login',
        isLoading: false 
      })
    }
  },

  register: async (email: string, password: string, profile: Partial<Profile>) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data: authData, error } = await auth.signUp(
        email, 
        password, 
        {
          name: profile.name,
          role: profile.role || 'cliente'
        }
      )
      
      if (error) {
        set({ error: error.message, isLoading: false })
        return
      }

      if (authData?.user) {
        set({
          user: authData.user,
          isAuthenticated: true,
          isLoading: false
        })

        // Create profile in database
        if (authData.user) {
          await db.updateProfile(authData.user.id, {
            name: profile.name,
            email: authData.user.email,
            role: profile.role || 'cliente',
            phone: profile.phone
          })
          await get().loadProfile()
        }
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro no registro',
        isLoading: false 
      })
    }
  },

  logout: async () => {
    await auth.signOut()
    set({ 
      user: null, 
      profile: null, 
      isAuthenticated: false, 
      isLoading: false, 
      error: null 
    })
  },

  updateProfile: async (updates: Partial<Profile>) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data, error } = await db.updateProfile(get().user!.id, updates)
      
      if (error) {
        set({ error: error.message, isLoading: false })
        return
      }

      if (data) {
        set({ profile: data, isLoading: false })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
        isLoading: false 
      })
    }
  },

  loadProfile: async () => {
    try {
      const session = await auth.getSession()
      
      if (!session?.user) {
        return
      }

      set({ isLoading: true })
      
      const { data, error } = await db.getProfile(get().user!.id)
      
      if (error) {
        set({ error: error.message, isLoading: false })
        return
      }

      if (data) {
        set({ profile: data, isLoading: false })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar perfil',
        isLoading: false 
      })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))

*/