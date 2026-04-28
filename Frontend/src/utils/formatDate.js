// src/utils/formatDate.js

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, pattern);
};

export const formatRelative = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatDeadline = (date) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `${diff} days left`;
};

export const formatSalary = (value) => {
  if (!value) return '-';
  return `₹${value} LPA`;
};

export const getDaysLeft = (deadline) => {
  if (!deadline) return null;
  const d = typeof deadline === 'string' ? parseISO(deadline) : deadline;
  if (!isValid(d)) return null;
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
};