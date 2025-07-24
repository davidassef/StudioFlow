// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'studioflow_token',
  REFRESH_TOKEN_KEY: 'studioflow_refresh_token',
  USER_KEY: 'studioflow_user',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;

// User Types
export const USER_TYPES = {
  CLIENTE: 'CLIENTE',
  PRESTADOR: 'PRESTADOR',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  PIX: 'PIX',
  CASH: 'CASH',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

// Time Slots
export const TIME_SLOTS = {
  DURATION_OPTIONS: [30, 60, 90, 120, 180, 240], // minutes
  BUSINESS_HOURS: {
    START: '08:00',
    END: '22:00',
  },
  SLOT_INTERVAL: 30, // minutes
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  PHONE_PATTERN: /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 10,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  STUDIOS: '/studios',
  STUDIO_DETAIL: '/studios/:id',
  BOOKINGS: '/agendamentos',
  PROFILE: '/perfil',
  STUDIO_PROFILE: '/perfil-estudio',
  LOGIN: '/login',
  REGISTER: '/register',
  CLIENTS: '/clientes',
  ROOMS: '/salas',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Acesso não autorizado. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  BOOKING_CONFLICT: 'Horário não disponível. Escolha outro horário.',
  PAYMENT_FAILED: 'Falha no pagamento. Tente novamente.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  REGISTER_SUCCESS: 'Cadastro realizado com sucesso!',
  BOOKING_CREATED: 'Agendamento criado com sucesso!',
  BOOKING_UPDATED: 'Agendamento atualizado com sucesso!',
  BOOKING_CANCELLED: 'Agendamento cancelado com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  STUDIO_UPDATED: 'Estúdio atualizado com sucesso!',
} as const;