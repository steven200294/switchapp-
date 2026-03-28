import { create } from 'zustand';
import type { AuthUser } from '@/modules/auth/types/auth.types';
import { getMe } from '@/modules/auth/services/auth.service';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  loadFromStorage: () => Promise<void>;
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
    set({ user, token, isLoggedIn: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, isLoggedIn: false });
  },

  loadFromStorage: async () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { user } = await getMe();
      set({ user, token, isLoggedIn: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoggedIn: false, isLoading: false });
    }
  },
}));
