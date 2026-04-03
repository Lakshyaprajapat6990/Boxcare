import { create } from 'zustand';
import type { PageName } from '@/types';

interface NavigationState {
  currentPage: PageName;
  setCurrentPage: (page: PageName) => void;
  previousPage: PageName;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'home',
  setCurrentPage: (page) =>
    set((state) => ({
      previousPage: state.currentPage,
      currentPage: page,
    })),
  previousPage: 'home',
}));
