import { apiRequest } from './api';
import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth';

const AUTH_TOKEN_KEY = 'dumpshield.auth.token';

export const authStorage = {
  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
};

export const authService = {
  login: (credentials: LoginCredentials) =>
    apiRequest<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (credentials: RegisterCredentials) =>
    apiRequest<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: (token: string) =>
    apiRequest<AuthUser>('/api/v1/auth/me', {
      token,
    }),
};
