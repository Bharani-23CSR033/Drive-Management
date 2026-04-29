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
      className="h-16 flex items-center justify-between px-6 gap-4 sticky top-0 z-20 theme-topbar transition-theme"
    >
      {/* Mobile Menu Button */}
      <button
        onClick={onMobileMenuOpen}
        className="md:hidden p-2 rounded-lg transition-all"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-light)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div
        className="flex items-center gap-2 flex-1 max-w-md rounded-xl px-3 py-2 transition-all duration-300"
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${searchFocused ? 'var(--border-focus)' : 'var(--border-color)'}`,
          boxShadow: searchFocused ? '0 0 0 3px var(--accent-light)' : 'none',
        }}
      >
        <Search size={15} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0" />
        <input
          type="text"
          placeholder="Search drives, companies..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder-[var(--text-muted)]"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg transition-all"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-light)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-all"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-light)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* User */}
        <div
          className="flex items-center gap-2 pl-2"
          style={{ borderLeft: '1px solid var(--border-color)' }}
        >
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="hidden sm:block">
            <p
              className="text-sm font-medium leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {user?.name || 'User'}
            </p>
            <p
              className="text-xs capitalize leading-tight"
              style={{ color: 'var(--text-muted)' }}
            >
              {user?.role || 'student'}
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;