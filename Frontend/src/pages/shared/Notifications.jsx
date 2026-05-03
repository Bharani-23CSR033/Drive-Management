// src/pages/shared/Notifications.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, BriefcaseBusiness,
  Users, Clock, Trash2, Check,
} from 'lucide-react';
import studentApi from '../../api/studentApi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const getNotificationIcon = (type) => {
  const iconMap = {
    shortlisted: CheckCircle,
    drive: BriefcaseBusiness,
    reminder: Clock,
    update: Clock,
    default: Bell,
  };
  return iconMap[type] || iconMap.default;
};

const getNotificationColor = (type) => {
  const colorMap = {
    shortlisted: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    drive: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    reminder: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    update: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  };
  return colorMap[type] || colorMap.default;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getNotifications();
        setNotifications(data.notifications || []);
        setError(null);
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    try {
      await studentApi.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const markAllRead = async () => {
    try {
      await Promise.all(notifications.filter(n => !n.read).map(n => studentApi.markNotificationRead(n._id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const clearAll = () => setNotifications([]);

  const filtered = notifications.filter((n) => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'Drives') return n.type === 'drive' || n.type === 'deadline';
    if (filter === 'Updates') return n.type === 'shortlisted' || n.type === 'update';
    return true;
  });

  const formatTime = (createdAt) => {
    const now = new Date();
    const notifDate = new Date(createdAt);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    return notifDate.toLocaleDateString();
  };

  const groupByDate = (notifs) => {
    const groups = {};
    notifs.forEach((n) => {
      const now = new Date();
      const notifDate = new Date(n.createdAt);
      const diffDays = Math.floor((now - notifDate) / 86400000);

      let key = 'Earlier';
      if (diffDays === 0) key = 'Today';
      else if (diffDays === 1) key = 'Yesterday';

      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  };

  const grouped = groupByDate(filtered);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004643]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 max-w-3xl"
    >

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-[#004643] text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-xs font-medium text-[#6B7280] hover:border-[#004643] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-all"
            >
              <Check size={12} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-xs font-medium text-[#6B7280] hover:border-red-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={12} />
              Clear all
            </button>
          )}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2">
        {['All', 'Unread', 'Drives', 'Updates'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              filter === tab
                ? 'bg-[#004643] text-white border-[#004643]'
                : 'bg-white dark:bg-[#143C3A] border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280] hover:border-[#004643] dark:hover:text-[#E6F4F1]'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 bg-[#004643]/10 dark:bg-[#004643]/20 rounded-2xl flex items-center justify-center mb-4">
            <Bell size={28} className="text-[#004643] dark:text-[#0F766E]" />
          </div>
          <p className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">All caught up</p>
          <p className="text-sm text-[#6B7280] mt-1">No notifications to show</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, notifs]) => (
            <motion.div key={date} variants={itemVariants} className="space-y-2">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide px-1">{date}</p>
              <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">
                <AnimatePresence>
                  {notifs.map((notif, i) => {
                    const Icon = getNotificationIcon(notif.type);
                    const color = getNotificationColor(notif.type);
                    return (
                      <motion.div
                        key={notif._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => markRead(notif._id)}
                        className={`flex items-start gap-4 px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 cursor-pointer transition-colors group ${
                          !notif.read
                            ? 'bg-[#004643]/3 dark:bg-[#004643]/10 hover:bg-[#004643]/6'
                            : 'hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-semibold ${!notif.read ? 'text-[#111827] dark:text-[#E6F4F1]' : 'text-[#6B7280]'}`}>
                              {notif.title}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notif.read && (
                                <div className="w-2 h-2 bg-[#004643] rounded-full flex-shrink-0" />
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                                className="p-1 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{notif.message || notif.desc}</p>
                          <p className="text-xs text-[#6B7280]/60 mt-1">{formatTime(notif.createdAt)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;