// Auth validations
export {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  changePasswordSchema,
  type LoginFormData,
  type RegisterFormData,
  type UpdateProfileFormData,
  type ChangePasswordFormData,
} from './auth';

// Booking validations
export {
  createBookingSchema,
  updateBookingSchema,
  bookingFiltersSchema,
  availabilityQuerySchema,
  type CreateBookingFormData,
  type UpdateBookingFormData,
  type BookingFiltersFormData,
  type AvailabilityQueryData,
} from './booking';

// Common validation utilities
import { z } from 'zod';

export const commonValidations = {
  // ID validation
  id: z.number().min(1, 'ID inválido'),
  
  // Pagination
  page: z.number().min(1, 'Página deve ser maior que 0').optional(),
  limit: z.number().min(1).max(100, 'Limite máximo é 100').optional(),
  
  // Search
  search: z.string().max(100, 'Busca deve ter no máximo 100 caracteres').optional(),
  
  // Sort
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  
  // Date range
  dateRange: z.object({
    start: z.string().date('Data inicial inválida'),
    end: z.string().date('Data final inválida'),
  }).refine(
    (data) => new Date(data.end) >= new Date(data.start),
    {
      message: 'Data final deve ser posterior ou igual à data inicial',
      path: ['end'],
    }
  ),
};

// Generic form validation helper
export const createFormValidator = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  return {
    validate: (data: unknown) => {
      try {
        return {
          success: true,
          data: schema.parse(data),
          errors: null,
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            data: null,
            errors: error.flatten().fieldErrors,
          };
        }
        return {
          success: false,
          data: null,
          errors: { _form: ['Erro de validação desconhecido'] },
        };
      }
    },
    
    validateField: (field: keyof T, value: unknown) => {
      try {
        const fieldSchema = schema.shape[field];
        fieldSchema.parse(value);
        return { success: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            error: error.errors[0]?.message || 'Erro de validação',
          };
        }
        return {
          success: false,
          error: 'Erro de validação desconhecido',
        };
      }
    },
  };
};