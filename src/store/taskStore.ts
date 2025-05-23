// src/store/taskStore.ts
import { create } from 'zustand';
import { Task, TaskState, TaskStatus, TaskPriority } from '../types/task';
import { getCookie } from '../utils/cookies';
import { getNotificationStore } from './notificationStore';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const response = await fetch('https://localhost:7198/Task/GetListTasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    
      const data = await response.json();
    
      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to fetch tasks');
      }
    
      set({ tasks: data.objeto, loading: false });
    
    } catch (error) {
      let errorMessage = 'Failed to fetch tasks';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
    }
  },
  
  getTask: (id: number) => {
    return get().tasks.find(task => task.taskId === id);
  },

  addTask: async (taskData: Omit<Task, 'taskId' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');

    try {
      const newTask = {
        ...taskData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('https://localhost:7198/Task/AddTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newTask })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add task');
      }

      set(state => ({
        tasks: [...state.tasks, data.objeto],
        loading: false
      }));

      getNotificationStore().showNotification(data.mensagem || 'Task added successfully', 'success');

      return data.objeto;

    } catch (error) {
      let errorMessage = 'Failed to add task';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },

  updateTask: async (id: number, taskData: Partial<Task>) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const updateData = {
        ...taskData,
        taskId: id,
        updatedAt: new Date().toISOString()
      };
      
      const response = await fetch('https://localhost:7198/Task/UpdateTask', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...updateData })
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update task');
      }
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.taskId === id ? { ...task, ...taskData } : task
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem || 'Task updated successfully', 'success');
    } catch (error) {
      let errorMessage = 'Failed to update task';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },
  
  toggleTaskStatus: async (id: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    try {
      const response = await fetch(`https://localhost:7198/Task/ToggleStatusTask/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to toggle task status');
      } 
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.taskId === id ? { ...task, isActive: !task.isActive } : task
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem || 'Task status updated successfully', 'success');
    } catch (error) {
      let errorMessage = 'Failed to toggle task status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },
  
  assignTask: async (taskId: number, userId: number) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const task = get().getTask(taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      
      const response = await fetch('https://localhost:7198/Task/AssignTask', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId, assigneeId: userId })
      });
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to assign task');
      }
      
      set(state => ({
        tasks: state.tasks.map(t => 
          t.taskId === taskId ? { ...t, assigneeId: userId } : t
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem || 'Task assigned successfully', 'success');
    } catch (error) {
      let errorMessage = 'Failed to assign task';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId: number, status: TaskStatus) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const task = get().getTask(taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      
      const response = await fetch('https://localhost:7198/Task/UpdateTaskStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId, status })
      });
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update task status');
      }
      
      set(state => ({
        tasks: state.tasks.map(t => 
          t.taskId === taskId ? { ...t, status } : t
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem || 'Task status updated successfully', 'success');
    } catch (error) {
      let errorMessage = 'Failed to update task status';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },
  
  updateTaskPriority: async (taskId: number, priority: TaskPriority) => {
    set({ loading: true, error: null });
    const token = getCookie('authToken');
    
    try {
      const task = get().getTask(taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      
      const response = await fetch('https://localhost:7198/Task/UpdateTaskPriority', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId, priority })
      });
      
      const data = await response.json();
      
      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update task priority');
      }
      
      set(state => ({
        tasks: state.tasks.map(t => 
          t.taskId === taskId ? { ...t, priority } : t
        ),
        loading: false
      }));
      
      getNotificationStore().showNotification(data.mensagem || 'Task priority updated successfully', 'success');
    } catch (error) {
      let errorMessage = 'Failed to update task priority';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, loading: false });
      getNotificationStore().showError(errorMessage);
      throw error;
    }
  },
  
  getTasksByAssignee: (userId: number) => {
    return get().tasks.filter(task => task.assigneeId === userId);
  },
  
  getTasksByGroup: (groupId: number) => {
    return get().tasks.filter(task => task.groupId === groupId);
  }
}));