// src/api/feedbackApi.js

import axiosInstance from './axiosInstance';

const feedbackApi = {
  submit: (data) => axiosInstance.post('/feedback', data),
  getByDrive: (driveId) => axiosInstance.get(`/feedback/${driveId}`),
};

export default feedbackApi;