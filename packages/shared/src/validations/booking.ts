import { z } from 'zod';
import { BOOKING_STATUS, VALIDATION_RULES } from '../constants';

// Create Booking Schema
export const createBookingSchema = z.object({
  room_id: z
    .number()
    .min(1, 'Sala é obrigatória'),
  start_time: z
    .string()
    .min(1, 'Horário de início é obrigatório')
    .datetime('Formato de data/hora inválido'),
  end_time: z
    .string()
    .min(1, 'Horário de fim é obrigatório')
    .datetime('Formato de data/hora inválido'),
  notes: z
    .string()
    .max(VALIDATION_RULES.DESCRIPTION_MAX_LENGTH, `Observações devem ter no máximo ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres`)
    .optional(),
}).refine(
  (data) => {
    const start = new Date(data.start_time);
    const end = new Date(data.end_time);
    return end > start;
  },
  {
    message: 'Horário de fim deve ser posterior ao horário de início',
    path: ['end_time'],
  }
).refine(
  (data) => {
    const start = new Date(data.start_time);
    const now = new Date();
    return start > now;
  },
  {
    message: 'Agendamento deve ser para uma data futura',
    path: ['start_time'],
  }
);

// Update Booking Schema
export const updateBookingSchema = z.object({
  start_time: z
    .string()
    .datetime('Formato de data/hora inválido')
    .optional(),
  end_time: z
    .string()
    .datetime('Formato de data/hora inválido')
    .optional(),
  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.COMPLETED,
      BOOKING_STATUS.NO_SHOW,
    ])
    .optional(),
  notes: z
    .string()
    .max(VALIDATION_RULES.DESCRIPTION_MAX_LENGTH, `Observações devem ter no máximo ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres`)
    .optional(),
}).refine(
  (data) => {
    if (data.start_time && data.end_time) {
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      return end > start;
    }
    return true;
  },
  {
    message: 'Horário de fim deve ser posterior ao horário de início',
    path: ['end_time'],
  }
);

// Booking Filters Schema
export const bookingFiltersSchema = z.object({
  status: z
    .enum([
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.CONFIRMED,
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.COMPLETED,
      BOOKING_STATUS.NO_SHOW,
    ])
    .optional(),
  room_id: z
    .number()
    .min(1)
    .optional(),
  studio_id: z
    .number()
    .min(1)
    .optional(),
  client_id: z
    .number()
    .min(1)
    .optional(),
  start_date: z
    .string()
    .date('Formato de data inválido')
    .optional(),
  end_date: z
    .string()
    .date('Formato de data inválido')
    .optional(),
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    }
    return true;
  },
  {
    message: 'Data final deve ser posterior ou igual à data inicial',
    path: ['end_date'],
  }
);

// Availability Query Schema
export const availabilityQuerySchema = z.object({
  room_id: z
    .number()
    .min(1, 'ID da sala é obrigatório'),
  date: z
    .string()
    .min(1, 'Data é obrigatória')
    .date('Formato de data inválido'),
  duration: z
    .number()
    .min(30, 'Duração mínima é 30 minutos')
    .max(480, 'Duração máxima é 8 horas')
    .optional(),
});

// Export types
export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
export type UpdateBookingFormData = z.infer<typeof updateBookingSchema>;
export type BookingFiltersFormData = z.infer<typeof bookingFiltersSchema>;
export type AvailabilityQueryData = z.infer<typeof availabilityQuerySchema>;