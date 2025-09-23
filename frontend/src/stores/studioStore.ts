import { create } from 'zustand'
import { db } from '@/lib/supabase'

export interface Room {
  id: string
  nome: string
  capacidade: number
  preco_hora: number
  descricao?: string
  is_disponivel: boolean
  created_at: string
  updated_at: string
}

export interface RoomFilters {
  search?: string
  preco_min?: number
  preco_max?: number
  capacidade_min?: number
  disponivel?: boolean
  [key: string]: unknown
}

export interface Booking {
  id: string
  sala_id: string
  cliente_id: string
  data_inicio: string
  data_fim: string
  valor_total: number
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO'
  observacoes?: string
  created_at: string
  updated_at: string
  sala?: Room
  cliente?: any
}

export interface BookingFilters {
  status?: string
  data_inicio?: string
  data_fim?: string
  sala_id?: string
  cliente_id?: string
  [key: string]: unknown
}

interface StudioState {
  rooms: Room[]
  bookings: Booking[]
  selectedRoom: Room | null
  selectedBooking: Booking | null
  roomFilters: RoomFilters
  bookingFilters: BookingFilters
  isLoading: boolean
  error: string | null

  // Room Actions
  fetchRooms: (filters?: RoomFilters) => Promise<void>
  getRoom: (id: string) => Promise<void>
  searchRooms: (query: string, filters?: RoomFilters) => Promise<void>
  createRoom: (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateRoom: (id: string, updates: Partial<Room>) => Promise<void>
  deleteRoom: (id: string) => Promise<void>
  setRoomFilters: (filters: RoomFilters) => void
  setSelectedRoom: (room: Room | null) => void

  // Booking Actions
  fetchBookings: (filters?: BookingFilters) => Promise<void>
  getBooking: (id: string) => Promise<void>
  createBooking: (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'valor_total'>) => Promise<void>
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>
  cancelBooking: (id: string) => Promise<void>
  setBookingFilters: (filters: BookingFilters) => void
  setSelectedBooking: (booking: Booking | null) => void

  // Common Actions
  clearError: () => void
}

export const useStudioStore = create<StudioState>((set, get) => ({
  rooms: [],
  bookings: [],
  selectedRoom: null,
  selectedBooking: null,
  roomFilters: {},
  bookingFilters: {},
  isLoading: false,
  error: null,

  // Room Actions
  fetchRooms: async (filters = {}) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await db.getRooms()

      if (error) {
        set({ error: error.message, isLoading: false })
        return
      }

      let filteredRooms = data || []

      // Apply client-side filters
      if (filters.preco_min) {
        filteredRooms = filteredRooms.filter(room => room.preco_hora >= filters.preco_min!)
      }

      if (filters.preco_max) {
        filteredRooms = filteredRooms.filter(room => room.preco_hora <= filters.preco_max!)
      }

      if (filters.capacidade_min) {
        filteredRooms = filteredRooms.filter(room => room.capacidade >= filters.capacidade_min!)
      }

      if (filters.disponivel !== undefined) {
        filteredRooms = filteredRooms.filter(room => room.is_disponivel === filters.disponivel)
      }

      set({ rooms: filteredRooms, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao buscar salas',
        isLoading: false
      })
    }
  },

  getRoom: async (id: string) => {
    set({ isLoading: true, error: null })

    const { data, error } = await db.getRoom(id)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    set({ selectedRoom: data, isLoading: false })
  },

  searchRooms: async (query: string, filters = {}) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await db.getRooms()

      if (error) {
        set({ error: error.message, isLoading: false })
        return
      }

      let filteredRooms = data || []

      // Apply search filter
      if (query) {
        filteredRooms = filteredRooms.filter(room =>
          room.nome.toLowerCase().includes(query.toLowerCase()) ||
          room.descricao?.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Apply other filters
      if (filters.preco_min) {
        filteredRooms = filteredRooms.filter(room => room.preco_hora >= filters.preco_min!)
      }

      if (filters.preco_max) {
        filteredRooms = filteredRooms.filter(room => room.preco_hora <= filters.preco_max!)
      }

      if (filters.capacidade_min) {
        filteredRooms = filteredRooms.filter(room => room.capacidade >= filters.capacidade_min!)
      }

      if (filters.disponivel !== undefined) {
        filteredRooms = filteredRooms.filter(room => room.is_disponivel === filters.disponivel)
      }

      set({ rooms: filteredRooms, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro na busca',
        isLoading: false
      })
    }
  },

  createRoom: async (roomData) => {
    set({ isLoading: true, error: null })

    const { data, error } = await db.createRoom(roomData)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    // Refresh rooms list
    await get().fetchRooms()
  },

  updateRoom: async (id, updates) => {
    set({ isLoading: true, error: null })

    const { data, error } = await db.updateRoom(id, updates)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    // Refresh rooms list and selected room
    await get().fetchRooms()
    if (get().selectedRoom?.id === id) {
      set({ selectedRoom: data })
    }
  },

  deleteRoom: async (id) => {
    set({ isLoading: true, error: null })

    const { error } = await db.deleteRoom(id)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    // Refresh rooms list and clear selection if deleted
    await get().fetchRooms()
    if (get().selectedRoom?.id === id) {
      set({ selectedRoom: null })
    }
  },

  setRoomFilters: (filters) => {
    set({ roomFilters: filters })
  },

  setSelectedRoom: (room) => {
    set({ selectedRoom: room })
  },

  // Booking Actions
  fetchBookings: async (filters = {}) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await db.getBookings()

      if (error) {
        set({ error: error.message, isLoading: false })
        return
      }

      let filteredBookings = data || []

      // Apply client-side filters
      if (filters.status) {
        filteredBookings = filteredBookings.filter(booking => booking.status === filters.status)
      }

      if (filters.sala_id) {
        filteredBookings = filteredBookings.filter(booking => booking.sala_id === filters.sala_id)
      }

      if (filters.cliente_id) {
        filteredBookings = filteredBookings.filter(booking => booking.cliente_id === filters.cliente_id)
      }

      set({ bookings: filteredBookings, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao buscar agendamentos',
        isLoading: false
      })
    }
  },

  getBooking: async (id: string) => {
    set({ isLoading: true, error: null })

    const { data, error } = await db.getBooking(id)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    set({ selectedBooking: data, isLoading: false })
  },

  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null })

    const { data, error } = await db.createBooking(bookingData)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    // Refresh bookings list
    await get().fetchBookings()
  },

  updateBooking: async (id, updates) => {
    set({ isLoading: true, error: null })

    const { data, error } = await db.updateBooking(id, updates)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    // Refresh bookings list and selected booking
    await get().fetchBookings()
    if (get().selectedBooking?.id === id) {
      set({ selectedBooking: data })
    }
  },

  cancelBooking: async (id) => {
    await get().updateBooking(id, { status: 'CANCELADO' })
  },

  setBookingFilters: (filters) => {
    set({ bookingFilters: filters })
  },

  setSelectedBooking: (booking) => {
    set({ selectedBooking: booking })
  },

  clearError: () => {
    set({ error: null })
  }
}))
