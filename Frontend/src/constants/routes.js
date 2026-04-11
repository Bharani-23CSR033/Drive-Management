// src/constants/routes.js

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  STUDENT: {
    DASHBOARD: '/student/dashboard',
    DRIVES: '/student/drives',
    DRIVE_DETAIL: '/student/drives/:id',
    APPLICATION: '/student/drives/:id/apply',
    PROFILE: '/student/profile',
    FEEDBACK: '/student/feedback',
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    MANAGE_DRIVES: '/admin/drives',
    STUDENT_LIST: '/admin/students',
    ANALYTICS: '/admin/analytics',
    ATTENDANCE: '/admin/attendance',
    REPORTS: '/admin/reports',
  },

  COMPANY: {
    DASHBOARD: '/company/dashboard',
    POST_DRIVE: '/company/post-drive',
    APPLICANTS: '/company/applicants/:driveId',
  },

  SHARED: {
    NOTIFICATIONS: '/notifications',
    CALENDAR: '/calendar',
    NOT_FOUND: '*',
  },
};