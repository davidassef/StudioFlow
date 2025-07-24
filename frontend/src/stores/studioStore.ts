import { create } from 'zustand'
import { apiUtils } from '@/lib/api'

export interface Studio {
  id: number
  nome: string
  descricao?: string
  endereco: string
  telefone?: string
  email?: string
  website?: string
  instagram?: string
  proprietario: {
    id: number
    nome: string
    email: string
  }
  salas: Room[]
  created_at: string
  updated_at: string
}

export interface Room {
  id: number
  nome: string
  descricao?: string
  capacidade: number
  preco_hora: number
  equipamentos: string[]
  disponivel: boolean
  imagens?: string[]
  estudio_id: number
  estudio?: {
    id: number
    nome: string
    endereco: string
  }
  created_at: string
  updated_at: string
}

export interface StudioFilters {
  search?: string
  cidade?: string
  preco_min?: number
  preco_max?: number
  capacidade_min?: number
  equipamentos?: string[]
  disponivel?: boolean
  [key: string]: unknown
}

export interface RoomFilters {
  search?: string
  estudio_id?: number
  preco_min?: number
  preco_max?: number
  capacidade_min?: number
  equipamentos?: string[]
  disponivel?: boolean
  data_inicio?: string
  data_fim?: string
  [key: string]: unknown
}

interface StudioState {
  studios: Studio[]
  rooms: Room[]
  selectedStudio: Studio | null
  selectedRoom: Room | null
  studioFilters: StudioFilters
  roomFilters: RoomFilters
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchStudios: (filters?: StudioFilters) => Promise<void>
  fetchRooms: (filters?: RoomFilters) => Promise<void>
  getStudio: (id: number) => Promise<void>
  getRoom: (id: number) => Promise<void>
  searchStudios: (query: string) => Promise<void>
  searchRooms: (query: string, filters?: RoomFilters) => Promise<void>
  setStudioFilters: (filters: StudioFilters) => void
  setRoomFilters: (filters: RoomFilters) => void
  setSelectedStudio: (studio: Studio | null) => void
  setSelectedRoom: (room: Room | null) => void
  clearError: () => void
}

export const useStudioStore = create<StudioState>((set, get) => ({
  studios: [],
  rooms: [],
  selectedStudio: null,
  selectedRoom: null,
  studioFilters: {},
  roomFilters: {},
  isLoading: false,
  error: null,

  fetchStudios: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      // Como ainda não temos endpoint de estúdios, vamos simular
      // TODO: Implementar quando o backend tiver o endpoint
      const mockStudios: Studio[] = [
        {
          id: 1,
          nome: 'Studio Alpha',
          descricao: 'Estúdio profissional com equipamentos de última geração',
          endereco: 'Rua das Flores, 123 - São Paulo, SP',
          telefone: '(11) 99999-9999',
          email: 'contato@studioalpha.com',
          website: 'https://studioalpha.com',
          instagram: '@studioalpha',
          proprietario: {
            id: 1,
            nome: 'João Silva',
            email: 'joao@studioalpha.com'
          },
          salas: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nome: 'Studio Beta',
          descricao: 'Espaço criativo para gravações e ensaios',
          endereco: 'Av. Paulista, 456 - São Paulo, SP',
          telefone: '(11) 88888-8888',
          email: 'info@studiobeta.com',
          proprietario: {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@studiobeta.com'
          },
          salas: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      set({ 
        studios: mockStudios,
        studioFilters: { ...get().studioFilters, ...filters },
        isLoading: false 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar estúdios'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
    }
  },

  fetchRooms: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiUtils.rooms.list(filters)
      set({ 
        rooms: response.data.results || response.data,
        roomFilters: { ...get().roomFilters, ...filters },
        isLoading: false 
      })
    } catch {
      // Se der erro na API, usar dados mock
      const mockRooms: Room[] = [
        {
          id: 1,
          nome: 'Sala A - Gravação',
          descricao: 'Sala profissional para gravação com isolamento acústico',
          capacidade: 8,
          preco_hora: 150.00,
          equipamentos: ['Mesa de som', 'Microfones', 'Monitores', 'Interface de áudio'],
          disponivel: true,
          imagens: [],
          estudio_id: 1,
          estudio: {
            id: 1,
            nome: 'Studio Alpha',
            endereco: 'Rua das Flores, 123 - São Paulo, SP'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          nome: 'Sala B - Ensaio',
          descricao: 'Sala ampla para ensaios de bandas',
          capacidade: 12,
          preco_hora: 80.00,
          equipamentos: ['Bateria', 'Amplificadores', 'Microfones', 'Sistema de som'],
          disponivel: true,
          imagens: [],
          estudio_id: 1,
          estudio: {
            id: 1,
            nome: 'Studio Alpha',
            endereco: 'Rua das Flores, 123 - São Paulo, SP'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          nome: 'Sala Premium',
          descricao: 'Sala premium com equipamentos de alta qualidade',
          capacidade: 6,
          preco_hora: 200.00,
          equipamentos: ['Mesa SSL', 'Monitores Genelec', 'Microfones Neumann', 'Pro Tools HDX'],
          disponivel: true,
          imagens: [],
          estudio_id: 2,
          estudio: {
            id: 2,
            nome: 'Studio Beta',
            endereco: 'Av. Paulista, 456 - São Paulo, SP'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      set({ 
        rooms: mockRooms,
        roomFilters: { ...get().roomFilters, ...filters },
        isLoading: false 
      })
    }
  },

  getStudio: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Implementar quando o backend tiver o endpoint
      const studios = get().studios
      const studio = studios.find(s => s.id === id)
      
      if (studio) {
        set({ selectedStudio: studio, isLoading: false })
      } else {
        // Buscar na API se não estiver no cache
        await get().fetchStudios()
        const updatedStudios = get().studios
        const foundStudio = updatedStudios.find(s => s.id === id)
        set({ selectedStudio: foundStudio || null, isLoading: false })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar estúdio'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
    }
  },

  getRoom: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiUtils.rooms.get(id)
      set({ selectedRoom: response.data, isLoading: false })
    } catch {
      // Se der erro na API, buscar nos dados mock
      const rooms = get().rooms
      const room = rooms.find(r => r.id === id)
      
      if (room) {
        set({ selectedRoom: room, isLoading: false })
      } else {
        set({ 
          error: 'Sala não encontrada',
          isLoading: false 
        })
      }
    }
  },

  searchStudios: async (query: string) => {
    await get().fetchStudios({ search: query })
  },

  searchRooms: async (query: string, filters = {}) => {
    await get().fetchRooms({ ...filters, search: query })
  },

  setStudioFilters: (filters: StudioFilters) => {
    set((state) => ({ studioFilters: { ...state.studioFilters, ...filters } }))
  },

  setRoomFilters: (filters: RoomFilters) => {
    set((state) => ({ roomFilters: { ...state.roomFilters, ...filters } }))
  },

  setSelectedStudio: (studio: Studio | null) => {
    set({ selectedStudio: studio })
  },

  setSelectedRoom: (room: Room | null) => {
    set({ selectedRoom: room })
  },

  clearError: () => {
    set({ error: null })
  },
}))

// Hook para facilitar o uso
export const useStudios = () => {
  return useStudioStore()
}

export const useRooms = () => {
  return useStudioStore()
}