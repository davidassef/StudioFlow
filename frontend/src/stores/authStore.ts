import { create } from 'zustand'
import { auth, supabase } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name?: string
}

export interface Profile {
  id: string
  nome: string
  telefone?: string
  user_type: 'CLIENTE' | 'PRESTADOR' | 'ADMIN'
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
  loginWithGoogle: () => Promise<void>
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
    try {
      set({ isLoading: true, error: null })

      // Verificar se já existe uma sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.nome
          },
          isAuthenticated: true
        })

        // Carregar profile
        await get().loadProfile()
      }

      // Configurar listener para mudanças de auth
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.nome
            },
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          await get().loadProfile()
        } else if (event === 'SIGNED_OUT') {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        }
      })

    } catch (error: any) {
      set({
        error: error.message || 'Erro ao inicializar autenticação',
        isLoading: false
      })
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await auth.signIn(email, password)

      if (error) throw error

      // O listener onAuthStateChange vai atualizar o estado automaticamente

    } catch (error: any) {
      set({
        error: error.message || 'Erro ao fazer login',
        isLoading: false
      })
      throw error
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      // O OAuth vai redirecionar automaticamente

    } catch (error: any) {
      set({
        error: error.message || 'Erro ao fazer login com Google',
        isLoading: false
      })
      throw error
    }
  },

  register: async (email: string, password: string, profileData: Partial<Profile>) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await auth.signUp(email, password, {
        nome: profileData.nome,
        telefone: profileData.telefone,
        user_type: profileData.user_type || 'CLIENTE'
      })

      if (error) throw error

      // Criar profile na tabela profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            nome: profileData.nome || '',
            telefone: profileData.telefone,
            user_type: profileData.user_type || 'CLIENTE'
          })

        if (profileError) {
          console.error('Erro ao criar profile:', profileError)
        }
      }

    } catch (error: any) {
      set({
        error: error.message || 'Erro ao registrar',
        isLoading: false
      })
      throw error
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await auth.signOut()

      if (error) throw error

      // O listener onAuthStateChange vai limpar o estado

    } catch (error: any) {
      set({
        error: error.message || 'Erro ao fazer logout',
        isLoading: false
      })
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      set({ isLoading: true, error: null })

      const user = get().user
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('profiles')
        .update({
          nome: updates.nome,
          telefone: updates.telefone,
          user_type: updates.user_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      set({ profile: data })

    } catch (error: any) {
      set({
        error: error.message || 'Erro ao atualizar perfil',
        isLoading: false
      })
    } finally {
      set({ isLoading: false })
    }
  },

  loadProfile: async () => {
    try {
      const user = get().user
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // Se não encontrar profile, pode ser primeiro login
        if (error.code === 'PGRST116') {
          set({ profile: null })
          return
        }
        throw error
      }

      set({ profile: data })

    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error)
      set({ error: error.message || 'Erro ao carregar perfil' })
    }
  },

  clearError: () => {
    set({ error: null })
  }
}))

// End of mock authStore