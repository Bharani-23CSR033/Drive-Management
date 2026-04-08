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
        primary: '#004643',
        'primary-hover': '#036b64',
        accent: '#0F766E',
        'dark-bg': '#0F2F2C',
        'dark-card': '#143C3A',
        'dark-border': '#1F4D4A',
        'dark-text': '#E6F4F1',
      },
    },
  },
  plugins: [],
}