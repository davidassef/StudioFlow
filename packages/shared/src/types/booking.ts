export interface Booking {
  id: number;
  room: Room;
  client: User;
  start_time: string;
  end_time: string;
  total_price: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  payment?: Payment;
}

export type BookingStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export interface CreateBookingData {
  room_id: number;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface UpdateBookingData {
  start_time?: string;
  end_time?: string;
  status?: BookingStatus;
  notes?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  room_id?: number;
  studio_id?: number;
  client_id?: number;
  start_date?: string;
  end_date?: string;
}

export interface BookingSearchParams {
  page?: number;
  limit?: number;
  filters?: BookingFilters;
  sort_by?: 'start_time' | 'created_at' | 'total_price';
  sort_order?: 'asc' | 'desc';
}

export interface BookingsResponse {
  results: Booking[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  price: string;
}

export interface AvailabilityResponse {
  date: string;
  room_id: number;
  slots: TimeSlot[];
}

export interface Payment {
  id: number;
  booking: number;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Re-export types from other modules that are used here
export type { Room, User } from './studio';
export type { User } from './auth';