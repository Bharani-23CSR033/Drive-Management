// src/components/layout/Sidebar.jsx

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BriefcaseBusiness, FileText,
  User, BarChart3, Users, CalendarDays,
  ClipboardList, MessageSquare, ChevronLeft,
  ChevronRight, LogOut, Building2,
} from 'lucide-react';
import Avatar from '../common/Avatar';
import useAuthStore from '../../store/authStore';
import { ROLES } from '../../constants/roles';

const studentLinks = [
  { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Drives', to: '/student/drives', icon: BriefcaseBusiness },
  { label: 'Applications', to: '/student/applications', icon: FileText },
  { label: 'Profile', to: '/student/profile', icon: User },
  { label: 'Calendar', to: '/calendar', icon: CalendarDays },
  { label: 'Feedback', to: '/student/feedback', icon: MessageSquare },
];

const adminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Manage Drives', to: '/admin/drives', icon: BriefcaseBusiness },
  { label: 'Students', to: '/admin/students', icon: Users },
  { label: 'Attendance', to: '/admin/attendance', icon: ClipboardList },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', to: '/admin/reports', icon: FileText },
  { label: 'Calendar', to: '/calendar', icon: CalendarDays },
];

const companyLinks = [
  { label: 'Dashboard', to: '/company/dashboard', icon: LayoutDashboard },
  { label: 'Post Drive', to: '/company/post-drive', icon: BriefcaseBusiness },
  { label: 'Applicants', to: '/company/applicants', icon: Users },
  { label: 'Profile', to: '/company/profile', icon: Building2 },
];

const linksByRole = {
  [ROLES.STUDENT]: studentLinks,
  [ROLES.ADMIN]: adminLinks,
  [ROLES.COMPANY]: companyLinks,
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const links = linksByRole[user?.role] || studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="
        hidden md:flex flex-col
        fixed left-0 top-0 bottom-0 z-30
        bg-white dark:bg-[#143C3A]
        border-r border-[#E5E7EB] dark:border-[#1F4D4A]
        shadow-sm overflow-hidden
      "
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] gap-3">
        <div className="w-8 h-8 bg-[#004643] rounded-lg flex items-center justify-center flex-shrink-0">
          <BriefcaseBusiness size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-[#004643] dark:text-[#E6F4F1] text-base tracking-tight whitespace-nowrap"
            >
              PlaceDrive
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group
                ${isActive
                  ? 'bg-[#004643] text-white shadow-sm'
                  : 'text-[#6B7280] hover:bg-[#004643]/10 hover:text-[#004643] dark:hover:text-[#E6F4F1]'
                }
              `}
            >
              <Icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="p-3 border-t border-[#E5E7EB] dark:border-[#1F4D4A] space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user?.name || 'User'} size="sm" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1] truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-[#6B7280] truncate capitalize">
                  {user?.role || 'student'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-[#6B7280] hover:bg-red-50 hover:text-red-600
            dark:hover:bg-red-900/20 dark:hover:text-red-400
            transition-all duration-200
          "
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-20
          w-6 h-6 bg-white dark:bg-[#143C3A]
          border border-[#E5E7EB] dark:border-[#1F4D4A]
          rounded-full flex items-center justify-center
          shadow-sm hover:shadow-md
          text-[#6B7280] hover:text-[#004643]
          transition-all duration-200 z-10
        "
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;