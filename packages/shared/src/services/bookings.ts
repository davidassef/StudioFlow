import { apiService } from './api';
import type {
  Booking,
  CreateBookingData,
  UpdateBookingData,
  BookingSearchParams,
  BookingsResponse,
  AvailabilityResponse,
  TimeSlot,
} from '../types';

export const bookingsService = {
  /**
   * Lista agendamentos com filtros e paginação
   */
  getBookings: async (params?: BookingSearchParams): Promise<BookingsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    
    // Filtros
    if (params?.filters) {
      const { filters } = params;
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.room_id) queryParams.append('room_id', filters.room_id.toString());
      if (filters.studio_id) queryParams.append('studio_id', filters.studio_id.toString());
      if (filters.client_id) queryParams.append('client_id', filters.client_id.toString());
      if (filters.start_date) queryParams.append('start_date', filters.start_date);
      if (filters.end_date) queryParams.append('end_date', filters.end_date);
    }
    
    const url = `/bookings/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiService.get<BookingsResponse>(url);
  },

  /**
   * Obtém detalhes de um agendamento específico
   */
  getBooking: async (id: number): Promise<Booking> => {
    return await apiService.get<Booking>(`/bookings/${id}/`);
  },

  /**
   * Cria um novo agendamento
   */
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    return await apiService.post<Booking>('/bookings/', data);
  },

  /**
   * Atualiza um agendamento existente
   */
  updateBooking: async (id: number, data: UpdateBookingData): Promise<Booking> => {
    return await apiService.patch<Booking>(`/bookings/${id}/`, data);
  },

  /**
   * Cancela um agendamento
   */
  cancelBooking: async (id: number, reason?: string): Promise<Booking> => {
    return await apiService.patch<Booking>(`/bookings/${id}/`, {
      status: 'CANCELLED',
      notes: reason ? `Cancelado: ${reason}` : 'Cancelado pelo usuário',
    });
  },

  /**
   * Confirma um agendamento
   */
  confirmBooking: async (id: number): Promise<Booking> => {
    return await apiService.patch<Booking>(`/bookings/${id}/`, {
      status: 'CONFIRMED',
    });
  },

  /**
   * Marca agendamento como concluído
   */
  completeBooking: async (id: number): Promise<Booking> => {
    return await apiService.patch<Booking>(`/bookings/${id}/`, {
      status: 'COMPLETED',
    });
  },

  /**
   * Marca agendamento como não compareceu
   */
  markAsNoShow: async (id: number): Promise<Booking> => {
    return await apiService.patch<Booking>(`/bookings/${id}/`, {
      status: 'NO_SHOW',
    });
  },

  /**
   * Deleta um agendamento
   */
  deleteBooking: async (id: number): Promise<void> => {
    await apiService.delete(`/bookings/${id}/`);
  },

  /**
   * Verifica disponibilidade de uma sala em uma data específica
   */
  checkAvailability: async (roomId: number, date: string): Promise<AvailabilityResponse> => {
    const params = new URLSearchParams({
      room_id: roomId.toString(),
      date,
    });
    
    return await apiService.get<AvailabilityResponse>(`/bookings/availability/?${params.toString()}`);
  },

  /**
   * Obtém horários disponíveis para uma sala em um período
   */
  getAvailableSlots: async (
    roomId: number,
    startDate: string,
    endDate: string,
    duration = 60
  ): Promise<TimeSlot[]> => {
    const params = new URLSearchParams({
      room_id: roomId.toString(),
      start_date: startDate,
      end_date: endDate,
      duration: duration.toString(),
    });
    
    return await apiService.get<TimeSlot[]>(`/bookings/available-slots/?${params.toString()}`);
  },

  /**
   * Calcula o preço de um agendamento
   */
  calculatePrice: async (data: {
    room_id: number;
    start_time: string;
    end_time: string;
  }): Promise<{ total_price: string; duration_hours: number }> => {
    return await apiService.post('/bookings/calculate-price/', data);
  },

  /**
   * Obtém agendamentos do usuário atual
   */
  getMyBookings: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<BookingsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `/bookings/my-bookings/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiService.get<BookingsResponse>(url);
  },

  /**
   * Obtém agendamentos de um estúdio (para prestadores)
   */
  getStudioBookings: async (
    studioId: number,
    params?: {
      status?: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<BookingsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `/studios/${studioId}/bookings/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiService.get<BookingsResponse>(url);
  },

  /**
   * Obtém estatísticas de agendamentos
   */
  getBookingStats: async (studioId?: number): Promise<{
    total_bookings: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    completed_bookings: number;
    total_revenue: string;
    this_month_bookings: number;
    this_month_revenue: string;
  }> => {
    const url = studioId 
      ? `/studios/${studioId}/booking-stats/`
      : '/bookings/stats/';
    
    return await apiService.get(url);
  },

  /**
   * Envia lembrete de agendamento
   */
  sendBookingReminder: async (bookingId: number): Promise<void> => {
    await apiService.post(`/bookings/${bookingId}/send-reminder/`);
  },
};

export default bookingsService;