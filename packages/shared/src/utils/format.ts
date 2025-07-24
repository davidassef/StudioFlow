import { format, parseISO, isValid, formatDistanceToNow, addDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format currency value to Brazilian Real
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
};

/**
 * Format date to Brazilian format
 */
export const formatDate = (date: string | Date, pattern: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, pattern, { locale: ptBR });
  } catch {
    return '';
  }
};

/**
 * Format time to Brazilian format
 */
export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

/**
 * Format datetime to Brazilian format
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Format date range
 */
export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
};

/**
 * Format time range
 */
export const formatTimeRange = (startTime: string | Date, endTime: string | Date): string => {
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  
  return `${start} - ${end}`;
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    return formatDistanceToNow(dateObj, { 
      addSuffix: true, 
      locale: ptBR 
    });
  } catch {
    return '';
  }
};

/**
 * Format duration in minutes to human readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Format phone number to Brazilian format
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Format CPF
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

/**
 * Format CNPJ
 */
export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return cnpj;
};

/**
 * Format CEP
 */
export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return cep;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format booking status to human readable
 */
export const formatBookingStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Concluído',
    NO_SHOW: 'Não compareceu',
  };
  
  return statusMap[status] || status;
};

/**
 * Format user type to human readable
 */
export const formatUserType = (type: string): string => {
  const typeMap: Record<string, string> = {
    CLIENT: 'Cliente',
    PROVIDER: 'Fornecedor',
    ADMIN: 'Administrador',
  };
  
  return typeMap[type] || type;
};

/**
 * Format payment method to human readable
 */
export const formatPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
    PIX: 'PIX',
    CASH: 'Dinheiro',
    BANK_TRANSFER: 'Transferência Bancária',
  };
  
  return methodMap[method] || method;
};

/**
 * Format payment status to human readable
 */
export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    FAILED: 'Falhou',
    REFUNDED: 'Reembolsado',
  };
  
  return statusMap[status] || status;
};

/**
 * Get today's date range
 */
export const getTodayRange = () => {
  const today = new Date();
  return {
    start: startOfDay(today),
    end: endOfDay(today),
  };
};

/**
 * Get week date range
 */
export const getWeekRange = (date: Date = new Date()) => {
  const start = startOfDay(date);
  const end = endOfDay(addDays(date, 6));
  
  return { start, end };
};

/**
 * Check if date is today
 */
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj > new Date();
};