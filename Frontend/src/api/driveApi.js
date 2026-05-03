// src/api/driveApi.js

import axiosInstance from './axiosInstance';

const driveApi = {
  getAll: (params) => axiosInstance.get('/drives', { params }),
  getById: (id) => axiosInstance.get(`/drives/${id}`),
  create: (data) => axiosInstance.post('/drives', data),
  update: (id, data) => axiosInstance.put(`/drives/${id}`, data),
  delete: (id) => axiosInstance.delete(`/drives/${id}`),
  getApplicants: (id) => axiosInstance.get(`/drives/${id}/applicants`),
  getCalendarEvents: () => axiosInstance.get('/calendar/events'),
};

export default driveApi;