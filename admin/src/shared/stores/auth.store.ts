import { create } from 'zustand';
import { apiFetch } from '@/shared/services/api';

type AuthUser = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
};

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
    if (typeof window !== 'undefined') localStorage.setItem('token', token);
    set({ user, token, isLoggedIn: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ user: null, token: null, isLoggedIn: false });
  },

  loadFromStorage: async () => {
    if (typeof window === 'undefined') { set({ isLoading: false }); return; }
    const token = localStorage.getItem('token');
    if (!token) { set({ isLoading: false }); return; }
    try {
      const { user } = await apiFetch<{ user: AuthUser }>('/auth/me');
      set({ user, token, isLoggedIn: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoggedIn: false, isLoading: false });
    }
  },
}));
