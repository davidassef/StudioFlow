// Export API configuration and base service
export { api, apiService } from './api';

// Export individual services
export { authService } from './auth';
export { studiosService } from './studios';
export { bookingsService } from './bookings';

// Export storage helpers
export {
  getStoredToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearStoredTokens,
} from './api';

// Re-export default exports for convenience
export { default as auth } from './auth';
export { default as studios } from './studios';
export { default as bookings } from './bookings';

// Combined services object for easy import
export const services = {
  auth: authService,
  studios: studiosService,
  bookings: bookingsService,
};

export default services;