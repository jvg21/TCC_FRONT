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

      const groupsData = data.objeto || [];
      
      // Para cada grupo, buscar usuários
      const groupsWithUsers = await Promise.all(
        groupsData.map(async (group: Group) => {
          try {
            // Buscar usuários associados ao grupo
            const usersResponse = await fetch(`https://localhost:7198/Group/GetListUserByGroup/${group.groupId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            const usersData = await usersResponse.json();
            
            if (!usersData.erro && usersData.objeto) {
              return { ...group, users: usersData.objeto };
            }
            
            return { ...group, users: [] };

          } catch (err) {
            console.error(`Failed to fetch users for group ${group.groupId}:`, err);
            return { ...group, users: [] };
          }
        })
      );

      set({ groups: groupsWithUsers, loading: false });
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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

      // Iniciar com uma lista vazia de usuários
      const newGroupWithUsers = { 
        ...data.objeto,
        users: []
      };

      // Update state with the new group
      set(state => ({
        groups: [...state.groups, newGroupWithUsers],
        loading: false
      }));

      getNotificationStore().showNotification(data.mensagem, 'success');

      return newGroupWithUsers;

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
      const updateData = {
        ...groupData,
        groupId: id,
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch('https://localhost:7198/Group/UpdateGroup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updateData })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update group');
      }
      
      // Manter a lista de usuários atual ao atualizar o grupo
      const currentGroup = get().groups.find(g => g.groupId === id);
      
      if (!currentGroup) {
        throw new Error('Group not found');
      }
      
      set(state => ({
        groups: state.groups.map(group => {
          if (group.groupId === id) {
            return {
              ...group,
              ...groupData,
              groupId: id,
              users: currentGroup.users
            };
          }
          return group;
        }),
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
        groups: state.groups.map(g => {
          if (g.groupId === id) {
            return {
              ...g,
              isActive: !g.isActive
            };
          }
          return g;
        }),
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

  addUserToGroup: async (groupId: number, userId: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const response = await fetch('https://localhost:7198/User/AddUserXGroup', {
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

      // Buscar o usuário adicionado para atualizar o estado
      const userResponse = await fetch(`https://localhost:7198/User/GetUserById/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = await userResponse.json();
      
      if (userData.erro || !userData.objeto) {
        // Se não conseguir obter os dados do usuário, buscar o grupo completo novamente
        await get().fetchGroups();
      } else {
        // Atualizar o estado com o novo usuário adicionado ao grupo
        set(state => ({
          groups: state.groups.map(g => {
            if (g.groupId === groupId) {
              return {
                ...g,
                users: [...(g.users || []), userData.objeto]
              };
            }
            return g;
          }),
          loading: false
        }));
      }
      
      getNotificationStore().showNotification(data.mensagem || 'User added to group successfully', 'success');

      return data.objeto;

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

  removeUserFromGroup: async (groupId: number, userId: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const response = await fetch('https://localhost:7198/User/DeleteUserXGroup', {
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

      // Atualizar o estado removendo o usuário do grupo
      set(state => ({
        groups: state.groups.map(g => {
          if (g.groupId === groupId) {
            return {
              ...g,
              users: (g.users || []).filter(u => u.userId !== userId)
            };
          }
          return g;
        }),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem || 'User removed from group successfully', 'success');

      return data.objeto;

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