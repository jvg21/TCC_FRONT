import { create } from 'zustand';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: (id: number) => void;
  showError: (message: string) => void;
}

// Criando o store diretamente, não como factory function
export const useNotificationStore = create<NotificationState>((set, get) => {
  let counter = 0;

  return {
    notifications: [],
    
    showNotification: (message, type) => {
      const id = counter++;
      set(state => ({
        notifications: [...state.notifications, { id, message, type }]
      }));
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        get().hideNotification(id);
      }, 5000);
    },
    
    hideNotification: (id) => {
      set(state => ({
        notifications: state.notifications.filter(notification => notification.id !== id)
      }));
    },
    
    showError: (message) => {
      get().showNotification(message, 'error');
    }
  };
});

// Função auxiliar para acessar o store de fora de componentes React
export const getNotificationStore = () => {
  return {
    showNotification: (message: string, type: NotificationType) => useNotificationStore.getState().showNotification(message, type),
    showError: (message: string) => useNotificationStore.getState().showError(message),
    hideNotification: (id: number) => useNotificationStore.getState().hideNotification(id)
  };
};