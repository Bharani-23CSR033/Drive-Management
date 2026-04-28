// src/components/common/Toast.jsx

import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#111827',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
        success: {
          iconTheme: { primary: '#004643', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#fff' },
        },
      }}
    />
  );
};

export default Toast;