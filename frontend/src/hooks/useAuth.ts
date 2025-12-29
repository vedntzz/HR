import { create } from 'zustand';
import { User, AuthResponse } from '@/types';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email: string, password: string) => {
    const data: AuthResponse = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
    window.location.href = '/login';
  },

  loadUser: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isLoading: false });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
