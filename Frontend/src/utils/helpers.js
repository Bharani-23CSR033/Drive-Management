// src/utils/helpers.js

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const truncate = (text = '', length = 50) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

export const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatSalaryRange = (min, max) => {
  if (!min && !max) return '-';
  if (!max) return `₹${min} LPA+`;
  return `₹${min}–${max} LPA`;
};

export const getStatusColor = (status) => {
  const map = {
    applied: 'info',
    shortlisted: 'success',
    rejected: 'danger',
    selected: 'success',
    pending: 'warning',
    active: 'success',
    closed: 'neutral',
  };
  return map[status?.toLowerCase()] || 'neutral';
};

export const groupByKey = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

export const sortByDate = (array, key = 'createdAt', order = 'desc') => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const downloadJSON = (data, filename = 'data') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const isEligible = (student, drive) => {
  if (!student || !drive) return false;
  if (drive.cgpa && parseFloat(student.cgpa) < parseFloat(drive.cgpa)) return false;
  if (drive.branches?.length > 0 && !drive.branches.includes(student.branch)) return false;
  if (drive.batch && student.batch !== drive.batch) return false;
  return true;
};