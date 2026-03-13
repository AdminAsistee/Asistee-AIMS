import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  type: 'administrator' | 'client' | 'supervisor' | 'cleaner' | 'guest' | 'messenger' | 'accountant' | 'banned';
  bio?: string;
  phone?: string;
  address?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await api.post('/api/v1/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('aims_token', token);
        set({ token, user, isAuthenticated: true });
      },

      register: async (name, email, password, passwordConfirmation) => {
        const response = await api.post('/api/v1/register', {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        const { token, user } = response.data;
        localStorage.setItem('aims_token', token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('aims_token');
        set({ token: null, user: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'aims-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
