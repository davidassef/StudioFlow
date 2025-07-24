import { create } from 'zustand'
import { apiUtils } from '@/lib/api'
import { useNotifications } from './notificationStore'

export interface Booking {
  id: number
  cliente: {
    id: number
    nome: string
    email: string
    telefone?: string
  }
  sala: {
    id: number
    nome: string
    preco_hora: number
    estudio: {
      id: number
      nome: string
    }
  }
  data_inicio: string
  data_fim: string
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO'
  observacoes?: string
  valor_total: number
  created_at: string
  updated_at: string
}

export interface BookingFilters {
  status?: string
  data_inicio?: string
  data_fim?: string
  cliente_id?: number
  sala_id?: number
  search?: string
  [key: string]: unknown
}

export interface CreateBookingData {
  sala_id: number
  data_inicio: string
  data_fim: string
  observacoes?: string
  [key: string]: unknown
}

interface BookingState {
  bookings: Booking[]
  selectedBooking: Booking | null
  filters: BookingFilters
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchBookings: (filters?: BookingFilters) => Promise<void>
  getBooking: (id: number) => Promise<void>
  createBooking: (data: CreateBookingData) => Promise<Booking>
  updateBooking: (id: number, data: Partial<CreateBookingData>) => Promise<void>
  cancelBooking: (id: number, reason?: string) => Promise<void>
  confirmBooking: (id: number) => Promise<void>
  setFilters: (filters: BookingFilters) => void
  setSelectedBooking: (booking: Booking | null) => void
  clearError: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchBookings: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiUtils.bookings.list(filters)
      set({ 
        bookings: response.data.results || response.data,
        filters: { ...get().filters, ...filters },
        isLoading: false 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar agendamentos'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
    }
  },

  getBooking: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiUtils.bookings.get(id)
      set({ 
        selectedBooking: response.data,
        isLoading: false 
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao carregar agendamento'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
    }
  },

  createBooking: async (data: CreateBookingData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiUtils.bookings.create(data)
      const newBooking = response.data
      
      set((state) => ({ 
        bookings: [newBooking, ...state.bookings],
        isLoading: false 
      }))
      
      return newBooking
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao criar agendamento'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw error
    }
  },

  updateBooking: async (id: number, data: Partial<CreateBookingData>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiUtils.bookings.update(id, data)
      const updatedBooking = response.data
      
      set((state) => ({
        bookings: state.bookings.map((booking) => 
          booking.id === id ? updatedBooking : booking
        ),
        selectedBooking: state.selectedBooking?.id === id ? updatedBooking : state.selectedBooking,
        isLoading: false
      }))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao atualizar agendamento'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw error
    }
  },

  cancelBooking: async (id: number, reason?: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiUtils.bookings.update(id, { 
        status: 'CANCELADO',
        observacoes: reason 
      })
      
      set((state) => ({
        bookings: state.bookings.map((booking) => 
          booking.id === id 
            ? { ...booking, status: 'CANCELADO' as const, observacoes: reason }
            : booking
        ),
        selectedBooking: state.selectedBooking?.id === id 
          ? { ...state.selectedBooking, status: 'CANCELADO' as const, observacoes: reason }
          : state.selectedBooking,
        isLoading: false
      }))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao cancelar agendamento'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw error
    }
  },

  confirmBooking: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      await apiUtils.bookings.update(id, { status: 'CONFIRMADO' })
      
      set((state) => ({
        bookings: state.bookings.map((booking) => 
          booking.id === id 
            ? { ...booking, status: 'CONFIRMADO' as const }
            : booking
        ),
        selectedBooking: state.selectedBooking?.id === id 
          ? { ...state.selectedBooking, status: 'CONFIRMADO' as const }
          : state.selectedBooking,
        isLoading: false
      }))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao confirmar agendamento'
      set({ 
        error: errorMessage,
        isLoading: false 
      })
      throw error
    }
  },

  setFilters: (filters: BookingFilters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
  },

  setSelectedBooking: (booking: Booking | null) => {
    set({ selectedBooking: booking })
  },

  clearError: () => {
    set({ error: null })
  },
}))

// Hook para facilitar o uso
export const useBookings = () => {
  const store = useBookingStore()
  const { showSuccess } = useNotifications()

  const createBookingWithNotification = async (data: CreateBookingData) => {
    try {
      const booking = await store.createBooking(data)
      showSuccess('Agendamento criado', 'Seu agendamento foi criado com sucesso!')
      return booking
    } catch (error) {
      // Erro já tratado no store
      throw error
    }
  }

  const cancelBookingWithNotification = async (id: number, reason?: string) => {
    try {
      await store.cancelBooking(id, reason)
      showSuccess('Agendamento cancelado', 'O agendamento foi cancelado com sucesso.')
    } catch (error) {
      // Erro já tratado no store
      throw error
    }
  }

  const confirmBookingWithNotification = async (id: number) => {
    try {
      await store.confirmBooking(id)
      showSuccess('Agendamento confirmado', 'O agendamento foi confirmado com sucesso!')
    } catch (error) {
      // Erro já tratado no store
      throw error
    }
  }

  return {
    ...store,
    createBookingWithNotification,
    cancelBookingWithNotification,
    confirmBookingWithNotification,
  }
}