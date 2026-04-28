// src/api/companyApi.js

import axiosInstance from './axiosInstance';

const companyApi = {
  register: (data) => axiosInstance.post('/company/register', data),
  login: (data) => axiosInstance.post('/company/login', data),
  getDrives: () => axiosInstance.get('/company/drives'),
  getApplicants: (driveId) => axiosInstance.get(`/company/applicants/${driveId}`),
  updateApplicant: (id, data) => axiosInstance.put(`/company/applicants/${id}`, data),
  postDrive: (data) => axiosInstance.post('/drives', data),
  updateDrive: (id, data) => axiosInstance.put(`/drives/${id}`, data),
};

export default companyApi;