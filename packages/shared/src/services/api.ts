import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, AUTH_CONSTANTS, ERROR_MESSAGES } from '../constants';
import type { ApiResponse, ApiError } from '../types';

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getStoredRefreshToken();
          if (refreshToken) {
            const newToken = await refreshAuthToken(refreshToken);
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance(originalRequest);
            }
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          clearStoredTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject(formatApiError(error));
    }
  );

  return instance;
};

// Storage helpers (works for both web and mobile)
const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
  }
  // For React Native, this would be AsyncStorage
  return null;
};

const getStoredRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
  }
  return null;
};

const setStoredTokens = (token: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY, refreshToken);
  }
};

const clearStoredTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
  }
};

// Refresh token function
const refreshAuthToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    
    const { access } = response.data;
    if (access) {
      setStoredTokens(access, refreshToken);
      return access;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Error formatter
const formatApiError = (error: any): ApiError => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          code: 'VALIDATION_ERROR',
          details: data.errors || data,
        };
      case 401:
        return {
          message: ERROR_MESSAGES.UNAUTHORIZED,
          code: 'UNAUTHORIZED',
        };
      case 403:
        return {
          message: ERROR_MESSAGES.FORBIDDEN,
          code: 'FORBIDDEN',
        };
      case 404:
        return {
          message: ERROR_MESSAGES.NOT_FOUND,
          code: 'NOT_FOUND',
        };
      case 409:
        return {
          message: ERROR_MESSAGES.BOOKING_CONFLICT,
          code: 'CONFLICT',
        };
      case 500:
      default:
        return {
          message: ERROR_MESSAGES.SERVER_ERROR,
          code: 'SERVER_ERROR',
        };
    }
  }
  
  if (error.request) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
    };
  }
  
  return {
    message: error.message || 'Erro desconhecido',
    code: 'UNKNOWN_ERROR',
  };
};

// API instance
export const api = createApiInstance();

// Generic API methods
export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.get(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.post(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.put(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.patch(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await api.delete(url, config);
    return response.data;
  },
};

// Export storage helpers for use in stores
export {
  getStoredToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearStoredTokens,
};