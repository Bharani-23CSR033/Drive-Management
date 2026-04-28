// src/api/authApi.js

import axiosInstance from './axiosInstance';

const authApi = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  verifyOtp: (data) => axiosInstance.post('/auth/verify-otp', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  getMe: () => axiosInstance.get('/auth/me'),
};

export default authApi;