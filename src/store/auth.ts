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
      localStorage.setItem('SHREE SHIDDI VINAYAK_token', token);
      localStorage.setItem('SHREE SHIDDI VINAYAK_admin', JSON.stringify(admin));
    }
    set({ isAuthenticated: true, admin, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('SHREE SHIDDI VINAYAK_token');
      localStorage.removeItem('SHREE SHIDDI VINAYAK_admin');
    }
    set({ isAuthenticated: false, admin: null, token: null });
  },
}));
