import { useState, useCallback } from 'react';

export interface NotificationState {
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  isVisible: boolean;
  id: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showNotification = useCallback((
    message: string, 
    type: 'error' | 'success' | 'warning' | 'info' = 'info',
    duration: number = 4000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: NotificationState = {
      message,
      type,
      isVisible: true,
      id
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }

    return id;
  }, [hideNotification]);

  const showError = useCallback((message: string, duration?: number) => {
    return showNotification(message, 'error', duration);
  }, [showNotification]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    return showNotification(message, 'success', duration);
  }, [showNotification]);

  const showWarning = useCallback((message: string, duration?: number) => {
    return showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message: string, duration?: number) => {
    return showNotification(message, 'info', duration);
  }, [showNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    showNotification,
    hideNotification,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    clearAll
  };
}
