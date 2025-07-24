/**
 * Validation utilities for common Brazilian formats and general validations
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate CPF (Brazilian individual taxpayer registry)
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  
  let checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  
  if (checkDigit !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  
  checkDigit = 11 - (sum % 11);
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
  
  return checkDigit === parseInt(cleaned.charAt(10));
};

/**
 * Validate CNPJ (Brazilian company taxpayer registry)
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return false;
  
  // Check for known invalid CNPJs
  if (/^(\d)\1{13}$/.test(cleaned)) return false;
  
  // Validate first check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i];
  }
  
  let checkDigit1 = sum % 11;
  checkDigit1 = checkDigit1 < 2 ? 0 : 11 - checkDigit1;
  
  if (checkDigit1 !== parseInt(cleaned.charAt(12))) return false;
  
  // Validate second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i];
  }
  
  let checkDigit2 = sum % 11;
  checkDigit2 = checkDigit2 < 2 ? 0 : 11 - checkDigit2;
  
  return checkDigit2 === parseInt(cleaned.charAt(13));
};

/**
 * Validate Brazilian phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Mobile: 11 digits (2 area code + 9 + 8 digits)
  // Landline: 10 digits (2 area code + 8 digits)
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Validate CEP (Brazilian postal code)
 */
export const isValidCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    feedback.push('Senha deve ter pelo menos 8 caracteres');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Senha deve conter pelo menos uma letra minúscula');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Senha deve conter pelo menos uma letra maiúscula');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    feedback.push('Senha deve conter pelo menos um número');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Senha deve conter pelo menos um caractere especial');
  } else {
    score += 1;
  }
  
  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate if string is a valid number
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};

/**
 * Validate if value is a positive number
 */
export const isPositiveNumber = (value: number | string): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Validate if date is in the future
 */
export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
};

/**
 * Validate if date is in the past
 */
export const isPastDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Validate if time is in valid format (HH:MM)
 */
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;
  return timeRegex.test(time);
};

/**
 * Validate if date is in valid format (YYYY-MM-DD)
 */
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Validate if datetime is in valid ISO format
 */
export const isValidDateTime = (datetime: string): boolean => {
  const dateObj = new Date(datetime);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Validate file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validate image file
 */
export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return isValidFileType(file, allowedTypes);
};

/**
 * Clean and validate Brazilian document (CPF or CNPJ)
 */
export const validateBrazilianDocument = (document: string): {
  isValid: boolean;
  type: 'CPF' | 'CNPJ' | null;
  cleaned: string;
} => {
  const cleaned = document.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return {
      isValid: isValidCPF(cleaned),
      type: 'CPF',
      cleaned,
    };
  }
  
  if (cleaned.length === 14) {
    return {
      isValid: isValidCNPJ(cleaned),
      type: 'CNPJ',
      cleaned,
    };
  }
  
  return {
    isValid: false,
    type: null,
    cleaned,
  };
};

/**
 * Validate required fields in an object
 */
export const validateRequiredFields = <T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      missingFields.push(String(field));
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

/**
 * Validate and sanitize search query
 */
export const validateSearchQuery = (query: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!query || query.trim().length === 0) {
    errors.push('Consulta de busca não pode estar vazia');
  }
  
  if (query.length > 100) {
    errors.push('Consulta de busca muito longa (máximo 100 caracteres)');
  }
  
  const sanitized = sanitizeString(query);
  
  if (sanitized.length < 2) {
    errors.push('Consulta de busca deve ter pelo menos 2 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
};