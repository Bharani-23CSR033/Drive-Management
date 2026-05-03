# Drive Management Frontend

Frontend application for the Drive Management System built with React, Vite, and Tailwind CSS.

## Overview

The frontend provides a responsive user interface for:
- Students browsing and applying to job drives
- Companies posting drives and managing applicants
- Admins managing the entire system
- Real-time notifications and dashboards
- Drive calendar and scheduling

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Animation:** Framer Motion
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React

## Project Structure

```
Frontend/
├── src/
│   ├── api/                    # API integration
│   │   ├── axiosInstance.js
│   │   ├── adminApi.js
│   │   ├── authApi.js
│   │   ├── companyApi.js
│   │   ├── driveApi.js
│   │   ├── feedbackApi.js
│   │   └── studentApi.js
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Reusable components
│   │   ├── admin/              # Admin components
│   │   ├── common/             # Common components
│   │   ├── company/            # Company components
│   │   ├── landing/            # Landing page components
│   │   ├── layout/             # Layout components
│   │   └── student/            # Student components
│   ├── constants/              # App constants
│   │   ├── roles.js
│   │   ├── routes.js
│   │   └── theme.js
│   ├── hooks/                  # Custom hooks
│   │   ├── useApplication.js
│   │   ├── useAuth.js
│   │   ├── useDrive.js
│   │   └── useNotification.js
│   ├── pages/                  # Page components
│   │   ├── LandingPage.jsx
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── company/
│   │   ├── shared/
│   │   └── student/
│   ├── store/                  # Zustand stores
│   │   ├── authStore.js
│   │   ├── driveStore.js
│   │   └── notificationStore.js
│   ├── utils/                  # Utility functions
│   │   ├── formatDate.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/                     # Static files
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── package.json
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables** (.env.local):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Start development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

✅ Responsive design  
✅ Dark mode support  
✅ Role-based UI rendering  
✅ Real-time notifications  
✅ Advanced filtering and search  
✅ Data pagination  
✅ File uploads (Resume)  
✅ Charts and analytics  
✅ CSV export functionality  
✅ Loading states  
✅ Error handling  
✅ Form validation  
✅ Smooth animations  

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Status

✅ **All 22 pages complete**  
✅ **100% API integrated**  
✅ **Responsive design**  
✅ **Dark mode working**  
✅ **No console errors**  
✅ **Production ready**  

## Deployment

The frontend can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify
- Any static hosting service

Build with:
```bash
npm run build
```

Then deploy the `dist` folder.

## Support

For more details, refer to the main project README.md
