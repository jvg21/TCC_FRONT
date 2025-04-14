// src/store/userStore.ts
import { create } from 'zustand';
import { User } from '../types/user';
import { getNotificationStore } from './notificationStore';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

// Simulação de um backend - em um cenário real, isso seria substituído por chamadas de API
let mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'IT',
    position: 'Software Developer',
    hireDate: '2022-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'HR',
    position: 'HR Manager',
    hireDate: '2021-08-10',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    department: 'Finance',
    position: 'Accountant',
    hireDate: '2023-03-22',
  },
];

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });

    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));

      set({ users: mockUsers, loading: false });
    } catch (error) {
      let errorMessage = 'Failed to fetch users';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  addUser: async (userData: Omit<User, 'id'>) => {
    set({ loading: true, error: null });

    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));

      const newUser: User = {
        ...userData,
        id: Date.now().toString(), // Gerar um ID único baseado no timestamp atual
      };

      mockUsers = [...mockUsers, newUser];
      
      set(state => ({ 
        users: [...state.users, newUser],
        loading: false 
      }));

      getNotificationStore().showNotification('User added successfully', 'success');
      
      return newUser;
    } catch (error) {
      let errorMessage = 'Failed to add user';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    set({ loading: true, error: null });

    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));

      mockUsers = mockUsers.map(user => 
        user.id === id ? { ...user, ...userData } : user
      );

      set(state => ({
        users: state.users.map(user =>
          user.id === id ? { ...user, ...userData } : user
        ),
        loading: false
      }));

      getNotificationStore().showNotification('User updated successfully', 'success');
    } catch (error) {
      let errorMessage = 'Failed to update user';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });

    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));

      mockUsers = mockUsers.filter(user => user.id !== id);

      set(state => ({
        users: state.users.filter(user => user.id !== id),
        loading: false
      }));

      getNotificationStore().showNotification('User deleted successfully', 'success');
    } catch (error) {
      let errorMessage = 'Failed to delete user';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  }
}));