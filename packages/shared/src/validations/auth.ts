import { z } from 'zod';
import { VALIDATION_RULES, USER_TYPES } from '../constants';

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`),
});

// Register Schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  first_name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, `Nome deve ter pelo menos ${VALIDATION_RULES.NAME_MIN_LENGTH} caracteres`)
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, `Nome deve ter no máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`),
  last_name: z
    .string()
    .min(1, 'Sobrenome é obrigatório')
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, `Sobrenome deve ter pelo menos ${VALIDATION_RULES.NAME_MIN_LENGTH} caracteres`)
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, `Sobrenome deve ter no máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`),
  user_type: z
    .enum([USER_TYPES.CLIENTE, USER_TYPES.PRESTADOR], {
      errorMap: () => ({ message: 'Tipo de usuário inválido' }),
    }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || VALIDATION_RULES.PHONE_PATTERN.test(val),
      'Telefone inválido'
    ),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  }
);

// Update Profile Schema
export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, `Nome deve ter pelo menos ${VALIDATION_RULES.NAME_MIN_LENGTH} caracteres`)
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, `Nome deve ter no máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`),
  last_name: z
    .string()
    .min(1, 'Sobrenome é obrigatório')
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, `Sobrenome deve ter pelo menos ${VALIDATION_RULES.NAME_MIN_LENGTH} caracteres`)
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, `Sobrenome deve ter no máximo ${VALIDATION_RULES.NAME_MAX_LENGTH} caracteres`),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || VALIDATION_RULES.PHONE_PATTERN.test(val),
      'Telefone inválido'
    ),
  bio: z
    .string()
    .max(VALIDATION_RULES.DESCRIPTION_MAX_LENGTH, `Bio deve ter no máximo ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} caracteres`)
    .optional(),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(1, 'Nova senha é obrigatória')
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Nova senha deve ter pelo menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`),
  confirmNewPassword: z
    .string()
    .min(1, 'Confirmação da nova senha é obrigatória'),
}).refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: 'Senhas não coincidem',
    path: ['confirmNewPassword'],
  }
);

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;