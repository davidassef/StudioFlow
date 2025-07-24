import { apiService } from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthTokens,
  User,
} from '../types';

export const authService = {
  /**
   * Realiza login do usuário
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/auth/login/', credentials);
    return response;
  },

  /**
   * Registra novo usuário
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/auth/register/', data);
    return response;
  },

  /**
   * Faz logout do usuário
   */
  logout: async (): Promise<void> => {
    try {
      await apiService.post('/auth/logout/');
    } catch (error) {
      // Mesmo se der erro no servidor, limpa os dados locais
      console.warn('Erro ao fazer logout no servidor:', error);
    }
  },

  /**
   * Renova o token de acesso
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiService.post<AuthTokens>('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response;
  },

  /**
   * Obtém dados do usuário atual
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiService.get<User>('/auth/user/');
    return response;
  },

  /**
   * Atualiza perfil do usuário
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiService.patch<User>('/auth/user/', data);
    return response;
  },

  /**
   * Altera senha do usuário
   */
  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }): Promise<void> => {
    await apiService.post('/auth/change-password/', data);
  },

  /**
   * Solicita reset de senha
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiService.post('/auth/password-reset/', { email });
  },

  /**
   * Confirma reset de senha
   */
  confirmPasswordReset: async (data: {
    token: string;
    new_password: string;
  }): Promise<void> => {
    await apiService.post('/auth/password-reset/confirm/', data);
  },

  /**
   * Verifica se o token é válido
   */
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await apiService.post('/auth/token/verify/', { token });
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Deleta conta do usuário
   */
  deleteAccount: async (): Promise<void> => {
    await apiService.delete('/auth/user/');
  },
};

export default authService;