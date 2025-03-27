import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  register: async (email: string, password: string, name: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      email,
      name,
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  resetPassword: async (email: string) => {
    // Simulate API call
    console.log('Password reset email sent to:', email);
  },
}));