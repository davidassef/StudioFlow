export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'CLIENTE' | 'PRESTADOR';
  is_active: boolean;
  date_joined: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  phone?: string;
  bio?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'CLIENTE' | 'PRESTADOR';
  phone?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  userType: 'CLIENTE' | 'PRESTADOR' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  requireAuth: (action: () => void) => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
}