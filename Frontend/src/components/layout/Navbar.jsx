// src/components/layout/Navbar.jsx

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BriefcaseBusiness, Bell, Moon, Sun } from 'lucide-react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import useAuthStore from '../../store/authStore';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Drives', to: '/student/drives' },
    { label: 'About', to: '/#about' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300
          ${scrolled
            ? 'bg-white/90 dark:bg-[#0F2F2C]/90 backdrop-blur-md shadow-md border-b border-[#E5E7EB] dark:border-[#1F4D4A]'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#004643] rounded-lg flex items-center justify-center group-hover:bg-[#036b64] transition-colors">
              <BriefcaseBusiness size={18} className="text-white" />
            </div>
            <span className="font-bold text-[#004643] dark:text-[#E6F4F1] text-lg tracking-tight">
              PlaceDrive
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  text-sm font-medium transition-colors duration-200
                  ${location.pathname === link.to
                    ? 'text-[#004643] dark:text-[#E6F4F1]'
                    : 'text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1]'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-gray-100 dark:hover:bg-[#1F4D4A] dark:hover:text-[#E6F4F1] transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-gray-100 dark:hover:bg-[#1F4D4A] transition-all">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <Avatar name={user?.name || 'User'} size="sm" />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 dark:hover:bg-[#1F4D4A] transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-30 bg-white dark:bg-[#0F2F2C] border-b border-[#E5E7EB] dark:border-[#1F4D4A] shadow-lg md:hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[#1F4D4A]">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" fullWidth>Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm" fullWidth>Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;