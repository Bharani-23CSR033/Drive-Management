// src/api/adminApi.js

import axiosInstance from './axiosInstance';

const adminApi = {
  getDashboard: () => axiosInstance.get('/admin/dashboard'),
  getStudents: (params) => axiosInstance.get('/admin/students', { params }),
  shortlistStudent: (id) => axiosInstance.put(`/admin/students/${id}/shortlist`),
  sendNotification: (data) => axiosInstance.post('/admin/notifications/send', data),
  getReports: (params) => axiosInstance.get('/admin/reports', { params }),
  getAttendance: (driveId) => axiosInstance.get(`/admin/attendance/${driveId}`),
  markAttendance: (driveId, data) => axiosInstance.post(`/admin/attendance/${driveId}`, data),
  updateApplicationStatus: (id, status) => axiosInstance.put(`/applications/${id}/status`, { status }),
};

export default adminApi;