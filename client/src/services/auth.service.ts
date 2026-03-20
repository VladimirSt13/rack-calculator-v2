import { api } from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', data)
    return response.data.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>('/auth/register', data)
    return response.data.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ data: User }>('/auth/me')
    return response.data.data
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post<{ data: { tokens: AuthTokens } }>('/auth/refresh', {
      refreshToken,
    })
    return response.data.data.tokens
  },

  resetPasswordRequest: async (email: string): Promise<void> => {
    await api.post('/auth/reset-password/request', { email })
  },

  resetPasswordConfirm: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password/confirm', { token, newPassword })
  },
}
