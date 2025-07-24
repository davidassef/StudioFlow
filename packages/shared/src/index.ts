// Export all types
export * from './types';

// Export all constants
export * from './constants';

// Export all validations
export * from './validations';

// Export all services
export * from './services';

// Export all stores
export * from './stores';

// Export all utilities
export * from './utils';

// Export all hooks
export * from './hooks';

// Re-export commonly used items for convenience
export type {
  User,
  UserProfile,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  AuthResponse,
  Studio,
  Room,
  Booking,
  CreateBookingData,
  UpdateBookingData,
  BookingStatus,
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from './types';

export {
  API_ENDPOINTS,
  AUTH_CONSTANTS,
  USER_TYPES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  VALIDATION_RULES,
  ROUTES,
} from './constants';

export {
  loginSchema,
  registerSchema,
  createBookingSchema,
  updateBookingSchema,
} from './validations';

export {
  apiService,
  authService,
  studiosService,
  bookingsService,
  services,
} from './services';

export {
  useAuthStore,
  useStudiosStore,
  useBookingsStore,
  useAuth,
  useUser,
  useStudios,
  useBookings,
  useStores,
  resetAllStores,
} from './stores';

export {
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  formatPhone,
  formatBookingStatus,
  formatUserType,
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  isValidPhone,
  validatePasswordStrength,
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
  generateId,
  generateUUID,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  slugify,
  copyToClipboard,
} from './utils';

export {
  useLocalStorage,
  useDebounce,
  useApi,
  useForm,
  usePaginatedApi,
  useInfiniteScroll,
} from './hooks';