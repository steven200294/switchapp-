import { create } from 'zustand';
import type { AuthUser } from '@/shared/auth/types/auth.types';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  hydrateToken: () => string | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    set({ user, token, isLoggedIn: true, isLoading: false });
  },

  setUser: (user) => {
    set({ user, isLoggedIn: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isLoggedIn: false, isLoading: false });
  },

  hydrateToken: () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token) {
      set({ token, isLoading: true });
    } else {
      set({ isLoading: false });
    }
    return token;
  },
}));
