import { create } from 'zustand';
import { bookingsService } from '../services';
import type {
  Booking,
  CreateBookingData,
  UpdateBookingData,
  BookingFilters,
  BookingSearchParams,
  BookingsResponse,
  AvailabilityResponse,
  TimeSlot,
  BookingStatus,
} from '../types';

interface BookingsState {
  // Data
  bookings: Booking[];
  myBookings: Booking[];
  selectedBooking: Booking | null;
  availability: AvailabilityResponse | null;
  availableSlots: TimeSlot[];
  
  // UI State
  isLoading: boolean;
  isLoadingBooking: boolean;
  isLoadingAvailability: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Filters and pagination
  filters: BookingFilters;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface BookingsActions {
  // Bookings CRUD
  fetchBookings: (params?: BookingSearchParams) => Promise<void>;
  fetchBooking: (id: number) => Promise<void>;
  fetchMyBookings: (params?: { status?: string; page?: number; limit?: number }) => Promise<void>;
  createBooking: (data: CreateBookingData) => Promise<Booking>;
  updateBooking: (id: number, data: UpdateBookingData) => Promise<void>;
  cancelBooking: (id: number, reason?: string) => Promise<void>;
  confirmBooking: (id: number) => Promise<void>;
  completeBooking: (id: number) => Promise<void>;
  markAsNoShow: (id: number) => Promise<void>;
  deleteBooking: (id: number) => Promise<void>;
  
  // Availability
  checkAvailability: (roomId: number, date: string) => Promise<void>;
  getAvailableSlots: (roomId: number, startDate: string, endDate: string, duration?: number) => Promise<void>;
  calculatePrice: (data: { room_id: number; start_time: string; end_time: string }) => Promise<{ total_price: string; duration_hours: number }>;
  
  // Studio bookings (for providers)
  fetchStudioBookings: (studioId: number, params?: any) => Promise<void>;
  getBookingStats: (studioId?: number) => Promise<any>;
  
  // Filters and search
  setFilters: (filters: Partial<BookingFilters>) => void;
  clearFilters: () => void;
  
  // UI actions
  setSelectedBooking: (booking: Booking | null) => void;
  clearError: () => void;
  clearAvailability: () => void;
  resetState: () => void;
}

type BookingsStore = BookingsState & BookingsActions;

const initialState: BookingsState = {
  bookings: [],
  myBookings: [],
  selectedBooking: null,
  availability: null,
  availableSlots: [],
  isLoading: false,
  isLoadingBooking: false,
  isLoadingAvailability: false,
  isCreating: false,
  isUpdating: false,
  error: null,
  filters: {},
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useBookingsStore = create<BookingsStore>((set, get) => ({
  ...initialState,

  // Bookings CRUD
  fetchBookings: async (params?: BookingSearchParams) => {
    set({ isLoading: true, error: null });
    try {
      const response: BookingsResponse = await bookingsService.getBookings(params);
      
      set({
        bookings: response.results,
        totalCount: response.count,
        currentPage: params?.page || 1,
        hasNextPage: !!response.next,
        hasPreviousPage: !!response.previous,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar agendamentos',
        isLoading: false,
      });
    }
  },

  fetchBooking: async (id: number) => {
    set({ isLoadingBooking: true, error: null });
    try {
      const booking = await bookingsService.getBooking(id);
      set({
        selectedBooking: booking,
        isLoadingBooking: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar agendamento',
        isLoadingBooking: false,
      });
    }
  },

  fetchMyBookings: async (params?) => {
    set({ isLoading: true, error: null });
    try {
      const response: BookingsResponse = await bookingsService.getMyBookings(params);
      set({
        myBookings: response.results,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar meus agendamentos',
        isLoading: false,
      });
    }
  },

  createBooking: async (data: CreateBookingData) => {
    set({ isCreating: true, error: null });
    try {
      const booking = await bookingsService.createBooking(data);
      set((state) => ({
        bookings: [booking, ...state.bookings],
        myBookings: [booking, ...state.myBookings],
        isCreating: false,
      }));
      return booking;
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao criar agendamento',
        isCreating: false,
      });
      throw error;
    }
  },

  updateBooking: async (id: number, data: UpdateBookingData) => {
    set({ isUpdating: true, error: null });
    try {
      const updatedBooking = await bookingsService.updateBooking(id, data);
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking.id === id ? updatedBooking : booking
        ),
        myBookings: state.myBookings.map(booking => 
          booking.id === id ? updatedBooking : booking
        ),
        selectedBooking: state.selectedBooking?.id === id ? updatedBooking : state.selectedBooking,
        isUpdating: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao atualizar agendamento',
        isUpdating: false,
      });
      throw error;
    }
  },

  cancelBooking: async (id: number, reason?: string) => {
    set({ isUpdating: true, error: null });
    try {
      const cancelledBooking = await bookingsService.cancelBooking(id, reason);
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking.id === id ? cancelledBooking : booking
        ),
        myBookings: state.myBookings.map(booking => 
          booking.id === id ? cancelledBooking : booking
        ),
        selectedBooking: state.selectedBooking?.id === id ? cancelledBooking : state.selectedBooking,
        isUpdating: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao cancelar agendamento',
        isUpdating: false,
      });
      throw error;
    }
  },

  confirmBooking: async (id: number) => {
    set({ isUpdating: true, error: null });
    try {
      const confirmedBooking = await bookingsService.confirmBooking(id);
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking.id === id ? confirmedBooking : booking
        ),
        selectedBooking: state.selectedBooking?.id === id ? confirmedBooking : state.selectedBooking,
        isUpdating: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao confirmar agendamento',
        isUpdating: false,
      });
      throw error;
    }
  },

  completeBooking: async (id: number) => {
    set({ isUpdating: true, error: null });
    try {
      const completedBooking = await bookingsService.completeBooking(id);
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking.id === id ? completedBooking : booking
        ),
        selectedBooking: state.selectedBooking?.id === id ? completedBooking : state.selectedBooking,
        isUpdating: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao marcar agendamento como concluído',
        isUpdating: false,
      });
      throw error;
    }
  },

  markAsNoShow: async (id: number) => {
    set({ isUpdating: true, error: null });
    try {
      const noShowBooking = await bookingsService.markAsNoShow(id);
      set((state) => ({
        bookings: state.bookings.map(booking => 
          booking.id === id ? noShowBooking : booking
        ),
        selectedBooking: state.selectedBooking?.id === id ? noShowBooking : state.selectedBooking,
        isUpdating: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao marcar como não compareceu',
        isUpdating: false,
      });
      throw error;
    }
  },

  deleteBooking: async (id: number) => {
    set({ isUpdating: true, error: null });
    try {
      await bookingsService.deleteBooking(id);
      set((state) => ({
        bookings: state.bookings.filter(booking => booking.id !== id),
        myBookings: state.myBookings.filter(booking => booking.id !== id),
        selectedBooking: state.selectedBooking?.id === id ? null : state.selectedBooking,
        isUpdating: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao deletar agendamento',
        isUpdating: false,
      });
      throw error;
    }
  },

  // Availability
  checkAvailability: async (roomId: number, date: string) => {
    set({ isLoadingAvailability: true, error: null });
    try {
      const availability = await bookingsService.checkAvailability(roomId, date);
      set({
        availability,
        isLoadingAvailability: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao verificar disponibilidade',
        isLoadingAvailability: false,
      });
    }
  },

  getAvailableSlots: async (roomId: number, startDate: string, endDate: string, duration = 60) => {
    set({ isLoadingAvailability: true, error: null });
    try {
      const slots = await bookingsService.getAvailableSlots(roomId, startDate, endDate, duration);
      set({
        availableSlots: slots,
        isLoadingAvailability: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar horários disponíveis',
        isLoadingAvailability: false,
      });
    }
  },

  calculatePrice: async (data) => {
    try {
      const result = await bookingsService.calculatePrice(data);
      return result;
    } catch (error: any) {
      set({ error: error.message || 'Erro ao calcular preço' });
      throw error;
    }
  },

  // Studio bookings (for providers)
  fetchStudioBookings: async (studioId: number, params?) => {
    set({ isLoading: true, error: null });
    try {
      const response: BookingsResponse = await bookingsService.getStudioBookings(studioId, params);
      set({
        bookings: response.results,
        totalCount: response.count,
        hasNextPage: !!response.next,
        hasPreviousPage: !!response.previous,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar agendamentos do estúdio',
        isLoading: false,
      });
    }
  },

  getBookingStats: async (studioId?: number) => {
    try {
      const stats = await bookingsService.getBookingStats(studioId);
      return stats;
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar estatísticas' });
      throw error;
    }
  },

  // Filters and search
  setFilters: (newFilters: Partial<BookingFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  // UI actions
  setSelectedBooking: (booking: Booking | null) => {
    set({ selectedBooking: booking });
  },

  clearError: () => {
    set({ error: null });
  },

  clearAvailability: () => {
    set({ availability: null, availableSlots: [] });
  },

  resetState: () => {
    set(initialState);
  },
}));

// Selectors
export const useBookings = () => useBookingsStore((state) => state.bookings);
export const useMyBookings = () => useBookingsStore((state) => state.myBookings);
export const useSelectedBooking = () => useBookingsStore((state) => state.selectedBooking);
export const useAvailability = () => useBookingsStore((state) => state.availability);
export const useAvailableSlots = () => useBookingsStore((state) => state.availableSlots);
export const useBookingsLoading = () => useBookingsStore((state) => state.isLoading);
export const useBookingsError = () => useBookingsStore((state) => state.error);
export const useBookingFilters = () => useBookingsStore((state) => state.filters);

// Helper selectors
export const useBookingsByStatus = (status: BookingStatus) => {
  return useBookingsStore((state) => 
    state.bookings.filter(booking => booking.status === status)
  );
};

export const useUpcomingBookings = () => {
  return useBookingsStore((state) => {
    const now = new Date();
    return state.myBookings.filter(booking => {
      const startTime = new Date(booking.start_time);
      return startTime > now && booking.status !== 'CANCELLED';
    });
  });
};