import { create } from 'zustand';
import type { AdminUser } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  token: string | null;
  login: (admin: AdminUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  admin: null,
  token: null,
  login: (admin, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('boxcraft_token', token);
      localStorage.setItem('boxcraft_admin', JSON.stringify(admin));
    }
    set({ isAuthenticated: true, admin, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boxcraft_token');
      localStorage.removeItem('boxcraft_admin');
    }
    set({ isAuthenticated: false, admin: null, token: null });
  },
}));
