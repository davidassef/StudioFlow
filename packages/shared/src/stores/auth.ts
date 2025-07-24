import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, setStoredTokens, clearStoredTokens } from '../services';
import { AUTH_CONSTANTS } from '../constants';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthState,
  AuthActions,
} from '../types';

interface AuthStore extends AuthState, AuthActions {
  // Additional store methods
  initialize: () => Promise<void>;
  checkAuthStatus: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      userType: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          const { user, tokens } = response;
          
          // Store tokens
          setStoredTokens(tokens.access, tokens.refresh);
          
          // Update store
          set({
            user,
            token: tokens.access,
            refreshToken: tokens.refresh,
            userType: user.user_type,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          const { user, tokens } = response;
          
          // Store tokens
          setStoredTokens(tokens.access, tokens.refresh);
          
          // Update store
          set({
            user,
            token: tokens.access,
            refreshToken: tokens.refresh,
            userType: user.user_type,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.warn('Erro ao fazer logout no servidor:', error);
        } finally {
          // Clear stored data
          clearStoredTokens();
          
          // Reset store
          set({
            user: null,
            token: null,
            refreshToken: null,
            userType: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const tokens = await authService.refreshToken(refreshToken);
          
          // Store new tokens
          setStoredTokens(tokens.access, tokens.refresh);
          
          // Update store
          set({
            token: tokens.access,
            refreshToken: tokens.refresh,
          });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      requireAuth: (action: () => void) => {
        const { isAuthenticated } = get();
        if (isAuthenticated) {
          action();
        } else {
          // Trigger auth modal or redirect to login
          if (typeof window !== 'undefined') {
            // For web, you might want to show a modal
            // For now, we'll just redirect
            window.location.href = '/login';
          }
        }
      },

      setUser: (user: User) => {
        set({
          user,
          userType: user.user_type,
          isAuthenticated: true,
        });
      },

      setTokens: (tokens) => {
        setStoredTokens(tokens.access, tokens.refresh);
        set({
          token: tokens.access,
          refreshToken: tokens.refresh,
        });
      },

      // Additional methods
      initialize: async () => {
        const { token } = get();
        if (token) {
          try {
            set({ isLoading: true });
            const user = await authService.getCurrentUser();
            set({
              user,
              userType: user.user_type,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            // Token is invalid, clear auth data
            get().logout();
          }
        }
      },

      checkAuthStatus: () => {
        const { token, user } = get();
        return !!(token && user);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        userType: state.userType,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for common use cases
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    userType: store.userType,
    login: store.login,
    register: store.register,
    logout: store.logout,
    requireAuth: store.requireAuth,
  };
};

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserType = () => useAuthStore((state) => state.userType);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Helper hooks
export const useRequireAuth = () => {
  const requireAuth = useAuthStore((state) => state.requireAuth);
  return requireAuth;
};

export const useIsClient = () => {
  const userType = useUserType();
  return userType === 'CLIENTE';
};

export const useIsProvider = () => {
  const userType = useUserType();
  return userType === 'PRESTADOR';
};