import { create } from 'zustand';
import { User, UserState } from '../types/user';
import { getNotificationStore } from './notificationStore';
import { getCookie } from '../utils/cookies';

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const response = await fetch('https://localhost:7198/User/GetListUser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    
      const data = await response.json();
    
      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to fetch users');
      }
    
      set({ users: data.objeto, loading: false });
    
    } catch (error) {
      let errorMessage = 'Failed to fetch users';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },
  
  getUser: (id: number) => {
    return get().users.find(user => user.userId === id);
  },

  addUser: async (userData: Omit<User, 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const newUser = {
        ...userData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const response = await fetch('https://localhost:7198/User/AddUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newUser })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add user');
      }

      set(state => ({
        users: [...state.users, data.objeto],
        loading: false
      }));

      getNotificationStore().showNotification(data.mensagem, 'success');

      return data.objeto;

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

  updateUser: async (id: number, userData: Partial<User>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const updateData = {
        ...userData,
        userId: id,
        updatedAt: new Date()
      };
      
      const response = await fetch('https://localhost:7198/User/UpdateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updateData })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update user');
      }
      
      set(state => ({
        users: state.users.map(user =>
          user.userId === id ? { ...user, ...userData } : user
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem, 'success');
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
  
  toggleUser: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const response = await fetch(`https://localhost:7198/User/ToggleStatusUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to toggle user status');
      } 
      
      set(state => ({
        users: state.users.map(user =>
          user.userId === id ? { ...user, isActive: !user.isActive } : user
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem, 'success');
    } catch (error) {
      let errorMessage = 'Failed to toggle user status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },
  
  deleteUser: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const response = await fetch(`https://localhost:7198/User/ToggleStatusUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to delete user');
      } 
      
      // No caso de exclusão, removemos o usuário da lista
      set(state => ({
        users: state.users.filter(user => user.userId !== id),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem, 'success');
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