// Export all utility functions
export * from './format';
export * from './validation';
export * from './storage';
export * from './helpers';

// Re-export commonly used utilities for convenience
export {
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  formatPhone,
  formatBookingStatus,
  formatUserType,
  formatPaymentMethod,
  formatPaymentStatus,
} from './format';

export {
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  isValidPhone,
  isValidCEP,
  validatePasswordStrength,
  validateBrazilianDocument,
  validateRequiredFields,
  validateSearchQuery,
} from './validation';

export {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  ExpiringStorage,
  sessionStorage,
  cookies,
  STORAGE_KEYS,
  clearAppStorage,
} from './storage';

export {
  generateId,
  generateUUID,
  debounce,
  throttle,
  deepClone,
  deepEqual,
  omit,
  pick,
  groupBy,
  sortBy,
  unique,
  uniqueBy,
  chunk,
  flatten,
  get,
  set,
  isEmpty,
  sleep,
  retry,
  timeout,
  slugify,
  calculateDistance,
  stringToColor,
  getInitials,
  isBrowser,
  isMobile,
  copyToClipboard,
  downloadBlob,
  fileToBase64,
  compressImage,
} from './helpers';