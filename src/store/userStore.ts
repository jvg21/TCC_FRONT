// src/store/userStore.ts
import { create } from 'zustand';
import { User, UserState } from '../types/user';
import { getNotificationStore } from './notificationStore';
import { getCookie } from '../utils/cookies';

export const useUserStore = create<UserState>((set,get) => ({
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
            // API indica erro
            throw new Error(data.mensagem || 'Failed to fetch companies');
          }
    
          set({ users: data.objeto, loading: false });
    
        } catch (error) {
          let errorMessage = 'Failed to fetch companies';
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

  addUser: async (userData: Omit<User, 'UserId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const newUser = {
        ...userData,
        isActive: true, // valor padrão para novas empresas
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
      throw error; // propagar o erro para o chamador
    }
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const updateCompany = {
        ...userData,
        companyId: id,
        updatedAt: new Date()
      };
      const response = await fetch('https://localhost:7198/User/UpdateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updateCompany })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update company');
      }
      set(state => ({
        companies: state.users.map(user =>
          user.userId === id ? { ...user, ...userData } : user
        ),
        loading: false
      }));
      getNotificationStore().showNotification(data.mensagem, 'success');


    } catch (error) {
      let errorMessage = 'Failed to update company';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error; // propagar o erro para o chamador
    }
  },
  toggleUser: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    const idString = id.toString() 
    try {
      const response = await fetch(`https://localhost:7198/User/DeleteUser/${idString}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      console.log(data);
      

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update user');
      } 
      set(state => ({
        companies: state.users.map(user =>
          user.userId === id ? { ...user,isActive:!user.isActive} : user
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
  }
}));