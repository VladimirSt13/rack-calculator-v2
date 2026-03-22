import { create } from 'zustand'
import { authService, User } from '../services/auth.service'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const data = await authService.login({ email, password })
    localStorage.setItem('accessToken', data.tokens.accessToken)
    localStorage.setItem('refreshToken', data.tokens.refreshToken)
    set({ user: data.user, isAuthenticated: true, isLoading: false })
  },

  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    const data = await authService.register({ email, password, firstName, lastName })
    localStorage.setItem('accessToken', data.tokens.accessToken)
    localStorage.setItem('refreshToken', data.tokens.refreshToken)
    set({ user: data.user, isAuthenticated: true, isLoading: false })
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  checkAuth: async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      set({ isLoading: false })
      return
    }

    try {
      const user = await authService.getCurrentUser()
      // Сервер теперь возвращает roleId в ответе
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  clearUser: () => {
    set({ user: null, isAuthenticated: false })
  },
}))
