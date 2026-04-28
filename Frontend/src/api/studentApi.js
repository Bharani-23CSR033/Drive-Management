// src/api/studentApi.js

import axiosInstance from './axiosInstance';

const studentApi = {
  getProfile: (id) => axiosInstance.get(`/student/profile/${id}`),
  updateProfile: (id, data) => axiosInstance.put(`/student/profile/${id}`, data),
  uploadResume: (formData) => axiosInstance.post('/student/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getDashboard: () => axiosInstance.get('/student/dashboard'),
  getApplications: () => axiosInstance.get('/student/applications'),
  getNotifications: () => axiosInstance.get('/student/notifications'),
  apply: (data) => axiosInstance.post('/applications', data),
};

export default studentApi;