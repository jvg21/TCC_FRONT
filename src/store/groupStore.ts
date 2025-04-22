// src/store/groupStore.ts
import { create } from 'zustand';
import { Group, GroupState } from '../types/group';
import { getCookie } from '../utils/cookies';
import { getNotificationStore } from './notificationStore';

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  loading: false,
  error: null,

  fetchGroups: async () => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const response = await fetch('https://localhost:7198/Group/GetListGroup', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to fetch groups');
      }

      set({ groups: data.objeto, loading: false });

    } catch (error) {
      let errorMessage = 'Failed to fetch groups';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },

  getGroup: (id: number) => {
    return get().groups.find(group => group.groupId === id);
  },

  addGroup: async (groupData: Omit<Group, 'groupId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const newGroup = {
        ...groupData,
        isActive: true, // default value for new groups
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const response = await fetch('https://localhost:7198/Group/AddGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newGroup })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add group');
      }

      // Update state with the new group
      set(state => ({
        groups: [...state.groups, data.objeto],
        loading: false
      }));

      getNotificationStore().showNotification(data.mensagem, 'success');

      return data.objeto;

    } catch (error) {
      let errorMessage = 'Failed to add group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  updateGroup: async (id: number, groupData: Partial<Group>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const updateGroup = {
        ...groupData,
        groupId: id,
        updatedAt: new Date()
      };
      
      const response = await fetch('https://localhost:7198/Group/UpdateGroup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updateGroup })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update group');
      }
      
      set(state => ({
        groups: state.groups.map(group =>
          group.groupId === id ? { ...group, ...groupData } : group
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem, 'success');

    } catch (error) {
      let errorMessage = 'Failed to update group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  deleteGroup: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const response = await fetch(`https://localhost:7198/Group/ToggleStatusGroup/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to delete group');
      } 
      
      set(state => ({
        groups: state.groups.filter(group => group.groupId !== id),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem, 'success');

    } catch (error) {
      let errorMessage = 'Failed to delete group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  toggleGroupStatus: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const group = get().groups.find(group => group.groupId === id);
      
      if (!group) {
        throw new Error('Group not found');
      }
      
      const response = await fetch(`https://localhost:7198/Group/ToggleStatusGroup/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to toggle group status');
      } 
      
      set(state => ({
        groups: state.groups.map(group =>
          group.groupId === id ? { ...group, isActive: !group.isActive} : group
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem, 'success');

    } catch (error) {
      let errorMessage = 'Failed to toggle group status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  addUserToGroup: async (groupId: number, userId: string) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const response = await fetch('https://localhost:7198/Group/AddUserToGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ groupId, userId })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add user to group');
      }

      // Update group in the state
      await get().fetchGroups(); // Refresh all groups to get updated user lists
      
      getNotificationStore().showNotification(data.mensagem, 'success');

    } catch (error) {
      let errorMessage = 'Failed to add user to group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  removeUserFromGroup: async (groupId: number, userId: string) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const response = await fetch('https://localhost:7198/Group/RemoveUserFromGroup', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ groupId, userId })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to remove user from group');
      }

      // Update group in the state
      await get().fetchGroups(); // Refresh all groups to get updated user lists
      
      getNotificationStore().showNotification(data.mensagem, 'success');

    } catch (error) {
      let errorMessage = 'Failed to remove user from group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  }
}));