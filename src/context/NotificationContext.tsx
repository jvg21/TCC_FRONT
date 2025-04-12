import React, { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: (id: number) => void;
  showError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counter, setCounter] = useState(0);

  const showNotification = (message: string, type: NotificationType) => {
    const id = counter;
    setCounter(prev => prev + 1);
    
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      hideNotification(id);
    }, 5000);
  };

  const hideNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showError = (message: string) => {
    showNotification(message, 'error');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        hideNotification,
        showError
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};