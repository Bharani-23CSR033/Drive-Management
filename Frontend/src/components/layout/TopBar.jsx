// src/components/layout/TopBar.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import Avatar from '../common/Avatar';
import useAuthStore from '../../store/authStore';

const TopBar = ({ darkMode, toggleDarkMode, onMobileMenuOpen }) => {
  const { user } = useAuthStore();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        h-16 flex items-center justify-between
        px-6 gap-4
        bg-white dark:bg-[#143C3A]
        border-b border-[#E5E7EB] dark:border-[#1F4D4A]
        sticky top-0 z-20
      "
    >
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuOpen}
        className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 dark:hover:bg-[#1F4D4A] transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div
        className={`
          flex items-center gap-2 flex-1 max-w-md
          bg-[#FAFAFA] dark:bg-[#0F2F2C]
          border rounded-xl px-3 py-2
          transition-all duration-300
          ${searchFocused
            ? 'border-[#004643] ring-2 ring-[#004643]/20'
            : 'border-[#E5E7EB] dark:border-[#1F4D4A]'
          }
        `}
      >
        <Search size={15} className="text-[#6B7280] flex-shrink-0" />
        <input
          type="text"
          placeholder="Search drives, companies..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="
            flex-1 bg-transparent text-sm
            text-[#111827] dark:text-[#E6F4F1]
            placeholder-[#6B7280] focus:outline-none
          "
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-gray-100 dark:hover:bg-[#1F4D4A] dark:hover:text-[#E6F4F1] transition-all"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-gray-100 dark:hover:bg-[#1F4D4A] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB] dark:border-[#1F4D4A]">
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1] leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-[#6B7280] capitalize leading-tight">
              {user?.role || 'student'}
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;