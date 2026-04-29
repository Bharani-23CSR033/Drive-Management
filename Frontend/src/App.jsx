// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import useAuthStore from './store/authStore';
import { ROLES } from './constants/roles';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import DriveList from './pages/student/DriveList';
import DriveDetail from './pages/student/DriveDetail';
import Application from './pages/student/Application';
import StudentProfile from './pages/student/Profile';
import Feedback from './pages/student/Feedback';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageDrives from './pages/admin/ManageDrives';
import StudentList from './pages/admin/StudentList';
import Analytics from './pages/admin/Analytics';
import Attendance from './pages/admin/Attendance';
import Reports from './pages/admin/Reports';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import PostDrive from './pages/company/PostDrive';
import Applicants from './pages/company/Applicants';

// Shared Pages
import NotFound from './pages/shared/NotFound';
import Notifications from './pages/shared/Notifications';
import Calendar from './pages/shared/Calendar';

// Landing Page (to be created)
import LandingPage from './pages/LandingPage';

// ─── Protected Route ───────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ─── Dashboard Layout (Sidebar + TopBar) ───────────────────────────
const DashboardLayout = ({ children, darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#0F2F2C]">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-60 transition-all duration-300">
        <TopBar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onMobileMenuOpen={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        <main className="flex-1 px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// ─── Public Layout (Navbar + Footer) ───────────────────────────────
const PublicLayout = ({ children, darkMode, toggleDarkMode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

// ─── App ────────────────────────────────────────────────────────────
const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem('darkMode', !prev);
      return !prev;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: darkMode ? '#143C3A' : '#fff',
              color: darkMode ? '#E6F4F1' : '#111827',
              border: `1px solid ${darkMode ? '#1F4D4A' : '#E5E7EB'}`,
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                <PageWrapper><LandingPage /></PageWrapper>
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper><Login /></PageWrapper>
            }
          />
          <Route
            path="/signup"
            element={
              <PageWrapper><Signup /></PageWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageWrapper><ForgotPassword /></PageWrapper>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><StudentDashboard /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/drives"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><DriveList /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/drives/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><DriveDetail /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/drives/:id/apply"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Application /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><StudentProfile /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/feedback"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Feedback /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><AdminDashboard /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/drives"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><ManageDrives /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><StudentList /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Analytics /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Attendance /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Reports /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Company Routes */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><CompanyDashboard /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/post-drive"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><PostDrive /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/applicants/:driveId"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Applicants /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN, ROLES.COMPANY]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Notifications /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN, ROLES.COMPANY]}>
                <DashboardLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <PageWrapper><Calendar /></PageWrapper>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;