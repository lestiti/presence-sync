import { create } from 'zustand';

interface AdminAuthStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthStore>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));