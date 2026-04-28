// src/utils/validators.js

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\s+/g, ''));
};

export const isValidCGPA = (cgpa) => {
  const val = parseFloat(cgpa);
  return !isNaN(val) && val >= 0 && val <= 10;
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isStrongPassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateProfileForm = (data) => {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!data.email || !isValidEmail(data.email)) errors.email = 'Enter a valid email';
  if (data.phone && !isValidPhone(data.phone)) errors.phone = 'Enter a valid 10-digit phone number';
  if (data.cgpa && !isValidCGPA(data.cgpa)) errors.cgpa = 'CGPA must be between 0 and 10';
  return errors;
};

export const validateDriveForm = (data) => {
  const errors = {};
  if (!data.company || data.company.trim().length < 2) errors.company = 'Company name is required';
  if (!data.role || data.role.trim().length < 2) errors.role = 'Role is required';
  if (!data.salary) errors.salary = 'Salary is required';
  if (!data.deadline) errors.deadline = 'Deadline is required';
  return errors;
};