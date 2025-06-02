// src/store/taskStore.ts - Atualizado para backend
import { create } from 'zustand';
import { Task, TaskState } from '../types/task';
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
      const response = await fetch('https://localhost:7198/Task/GetListTask', {
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

      set({ tasks: data.objeto || [], loading: false });

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
      // Preparar dados para envio, removendo campos undefined/null
      const newTask: any = {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status
      };

      // Só incluir assigneeId se existir e for > 0
      if (taskData.assigneeId && taskData.assigneeId > 0) {
        newTask.assigneeId = taskData.assigneeId;
      }

      // Só incluir parentTaskId se existir e for > 0
      if (taskData.parentTaskId && taskData.parentTaskId > 0) {
        newTask.parentTaskId = taskData.parentTaskId;
      }

      const response = await fetch('https://localhost:7198/Task/AddTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to add task');
      }

      // Atualiza o estado com a nova tarefa
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
      // Preparar dados para envio, removendo campos undefined/null
      const updateData: any = {
        taskId: id
      };

      // Só incluir campos que foram fornecidos
      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.dueDate !== undefined) updateData.dueDate = taskData.dueDate;
      if (taskData.priority !== undefined) updateData.priority = taskData.priority;
      if (taskData.status !== undefined) updateData.status = taskData.status;
      
      // Só incluir assigneeId se for > 0
      if (taskData.assigneeId !== undefined && taskData.assigneeId !== undefined   &&  taskData.assigneeId > 0) {
        updateData.assigneeId = taskData.assigneeId;
      }
      
      // Só incluir parentTaskId se for > 0
      if (taskData.parentTaskId !== undefined &&taskData.parentTaskId !== null &&  taskData.parentTaskId > 0) {
        updateData.parentTaskId = taskData.parentTaskId;
      }
      
      const response = await fetch('https://localhost:7198/Task/UpdateTask', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (data.erro) {
        throw new Error(data.mensagem || 'Failed to update task');
      }
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.taskId === id ? { ...task, ...data.objeto } : task
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
      const response = await fetch(`https://localhost:7198/Task/ToogleStatusTask/${id}`, {
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
    // Esta funcionalidade pode ser implementada através do updateTask
    // passando apenas o assigneeId
    await get().updateTask(taskId, { assigneeId: userId });
  },

  getTasksByAssignee: (userId: number) => {
    return get().tasks.filter(task => task.assigneeId === userId);
  }
}));