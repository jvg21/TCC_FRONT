import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '../../store/notificationStore';

export const Notification = () => {
  const { t } = useTranslation();
  const { notifications, hideNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        // Choose the right styles and icon based on notification type
        let bgColor = 'bg-blue-50 dark:bg-blue-900';
        let textColor = 'text-blue-800 dark:text-blue-100';
        let borderColor = 'border-blue-300 dark:border-blue-700';
        let Icon = Info;

        if (notification.type === 'error') {
          bgColor = 'bg-red-50 dark:bg-red-900';
          textColor = 'text-red-800 dark:text-red-100';
          borderColor = 'border-red-300 dark:border-red-700';
          Icon = AlertCircle;
        } else if (notification.type === 'success') {
          bgColor = 'bg-green-50 dark:bg-green-900';
          textColor = 'text-green-800 dark:text-green-100';
          borderColor = 'border-green-300 dark:border-green-700';
          Icon = CheckCircle;
        } else if (notification.type === 'warning') {
          bgColor = 'bg-yellow-50 dark:bg-yellow-900';
          textColor = 'text-yellow-800 dark:text-yellow-100';
          borderColor = 'border-yellow-300 dark:border-yellow-700';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={notification.id}
            className={`${bgColor} ${borderColor} ${textColor} border rounded-lg shadow-lg p-4 max-w-md flex items-start animate-slide-up`}
            role="alert"
          >
            <div className="flex-shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => hideNotification(notification.id)}
              className="ml-4 flex-shrink-0 inline-flex"
              aria-label={t('close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};