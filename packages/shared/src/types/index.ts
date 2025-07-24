// Auth types
export type {
  User,
  UserProfile,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthResponse,
  AuthState,
  AuthActions
} from './auth';

// Studio types
export type {
  Studio,
  Room,
  StudioImage,
  RoomImage,
  StudioFilters,
  StudioSearchParams,
  StudiosResponse
} from './studio';

// Booking types
export type {
  Booking,
  BookingStatus,
  CreateBookingData,
  UpdateBookingData,
  BookingFilters,
  BookingSearchParams,
  BookingsResponse,
  TimeSlot,
  AvailabilityResponse,
  Payment,
  PaymentMethod,
  PaymentStatus
} from './booking';

// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'time';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: Record<string, any>;
}