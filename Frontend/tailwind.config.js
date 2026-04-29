// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'primary-hover': '#4338CA',
        accent: '#6366F1',
        background: '#F0F2F8',
        card: '#FFFFFF',
        textPrimary: '#1E1E2E',
        textSecondary: '#6B7280',
        border: '#E2E5F1',
        // Dark mode
        'dark-bg': '#0A0A0F',
        'dark-surface': '#111118',
        'dark-card': '#16161F',
        'dark-border': '#1E1E2E',
        'dark-text': '#E8E8F0',
        'dark-muted': '#4A4A6A',
      },
      backgroundImage: {
        'light-gradient': 'linear-gradient(135deg, #F0F2F8 0%, #E8EAF6 50%, #EEF0FB 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #0D0D16 50%, #0A0A0F 100%)',
      },
      boxShadow: {
        'card-light': '0 2px 12px rgba(79, 70, 229, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(79, 70, 229, 0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'card-dark': '0 2px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
        'sidebar': '4px 0 24px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
};