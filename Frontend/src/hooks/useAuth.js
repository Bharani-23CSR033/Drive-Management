// src/hooks/useAuth.js

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { ROLES } from '../constants/roles';

const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

  const login = useCallback(async (email, password) => {
    try {
      // Replace with real API call when backend is ready
      // const res = await authApi.login({ email, password });
      // setAuth(res.data.user, res.data.token);
      const mockUser = { name: 'Bhagath K', email, role: ROLES.STUDENT };
      setAuth(mockUser, 'mock-token');
      toast.success('Logged in successfully');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Login failed');
    }
  }, [navigate, setAuth]);

  const register = useCallback(async (data) => {
    try {
      // Replace with real API call when backend is ready
      // const res = await authApi.register(data);
      // setAuth(res.data.user, res.data.token);
      const mockUser = { name: data.name, email: data.email, role: data.role };
      setAuth(mockUser, 'mock-token');
      toast.success('Account created successfully');
      const paths = {
        [ROLES.STUDENT]: '/student/dashboard',
        [ROLES.ADMIN]: '/admin/dashboard',
        [ROLES.COMPANY]: '/company/dashboard',
      };
      navigate(paths[data.role] || '/student/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    }
  }, [navigate, setAuth]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
    toast.success('Logged out');
  }, [logout, navigate]);

  const isRole = useCallback((role) => user?.role === role, [user]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
    isStudent: isRole(ROLES.STUDENT),
    isAdmin: isRole(ROLES.ADMIN),
    isCompany: isRole(ROLES.COMPANY),
  };
};

export default useAuth;