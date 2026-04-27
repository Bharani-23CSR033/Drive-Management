// src/pages/shared/Notifications.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, BriefcaseBusiness,
  Users, Clock, Trash2, Check,
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const initialNotifications = [
  { id: 1, type: 'shortlisted', title: 'Shortlisted at Google', desc: 'You have been shortlisted for Software Engineer Intern role at Google.', time: '2 hours ago', read: false, icon: CheckCircle, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { id: 2, type: 'drive', title: 'New Drive Posted', desc: 'Microsoft has posted a new drive for SDE Intern. Deadline: Apr 25.', time: '5 hours ago', read: false, icon: BriefcaseBusiness, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { id: 3, type: 'reminder', title: 'Deadline Reminder', desc: 'Amazon Backend Developer drive closes in 2 days. Apply now.', time: '1 day ago', read: false, icon: Clock, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { id: 4, type: 'drive', title: 'New Drive Posted', desc: 'Razorpay has posted a Full Stack Developer role. Salary: 15 LPA.', time: '1 day ago', read: true, icon: BriefcaseBusiness, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { id: 5, type: 'shortlisted', title: 'Application Update', desc: 'Your application to Zoho Full Stack has moved to review stage.', time: '2 days ago', read: true, icon: CheckCircle, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { id: 6, type: 'reminder', title: 'Profile Incomplete', desc: 'Complete your profile to improve your chances of getting shortlisted.', time: '3 days ago', read: true, icon: Users, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { id: 7, type: 'drive', title: 'Drive Closed', desc: 'Infosys Systems Engineer drive has been closed. Results will be announced soon.', time: '4 days ago', read: true, icon: BriefcaseBusiness, color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('All');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const filtered = notifications.filter((n) => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'Drives') return n.type === 'drive';
    if (filter === 'Updates') return n.type === 'shortlisted';
    return true;
  });

  const groupByDate = (notifs) => {
    const groups = {};
    notifs.forEach((n) => {
      const key = n.time.includes('hour') ? 'Today' :
        n.time.includes('1 day') ? 'Yesterday' : 'Earlier';
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    return groups;
  };

  const grouped = groupByDate(filtered);

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
                    const Icon = notif.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => markRead(notif.id)}
                        className={`flex items-start gap-4 px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 cursor-pointer transition-colors ${
                          !notif.read
                            ? 'bg-[#004643]/3 dark:bg-[#004643]/10 hover:bg-[#004643]/6'
                            : 'hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.color}`}>
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
                                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                className="p-1 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{notif.desc}</p>
                          <p className="text-xs text-[#6B7280]/60 mt-1">{notif.time}</p>
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