// src/hooks/useNotification.js

import { useState, useCallback } from 'react';
import useNotificationStore from '../store/notificationStore';

const useNotification = () => {
  const {
    notifications,
    setNotifications,
    markRead,
    markAllRead,
    removeNotification,
    clearAll,
  } = useNotificationStore();

  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with real API: const res = await notificationApi.getAll();
      // setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [setNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markRead,
    markAllRead,
    removeNotification,
    clearAll,
  };
};

export default useNotification;