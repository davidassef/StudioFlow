// Export all stores
export { useAuthStore, useAuth, useUser, useAuthActions } from './auth';
export { useStudiosStore, useStudios, useSelectedStudio, useFavoriteStudios, useRooms, useStudiosLoading, useStudiosError, useStudioFilters } from './studios';
export { 
  useBookingsStore, 
  useBookings, 
  useMyBookings, 
  useSelectedBooking, 
  useAvailability, 
  useAvailableSlots, 
  useBookingsLoading, 
  useBookingsError, 
  useBookingFilters,
  useBookingsByStatus,
  useUpcomingBookings
} from './bookings';

// Re-export store types for convenience
export type { AuthState } from './auth';

// Combined store actions for easier access
export const useStores = () => ({
  auth: useAuthStore(),
  studios: useStudiosStore(),
  bookings: useBookingsStore(),
});

// Reset all stores (useful for logout)
export const resetAllStores = () => {
  useAuthStore.getState().logout();
  useStudiosStore.getState().resetState();
  useBookingsStore.getState().resetState();
};