// src/pages/auth/Login.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, ArrowRight, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import useAuthStore from '../../store/authStore';
import { ROLES } from '../../constants/roles';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Temporary mock login — replace with API call later
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser = { name: 'Bhagath K', email: data.email, role: ROLES.STUDENT };
      setAuth(mockUser, 'mock-token-123');
      toast.success('Welcome back!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-[#0F2F2C]">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004643] relative overflow-hidden flex-col justify-between p-12">

        {/* Background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BriefcaseBusiness size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">PlaceDrive</span>
        </div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your placement journey starts here.
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Track drives, manage applications, and land your dream job — all from one dashboard.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '1,200+', label: 'Placed Students' },
              { value: '80+', label: 'Companies' },
              { value: '94%', label: 'Success Rate' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-white/60 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} PlaceDrive. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <motion.div variants={itemVariants} className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#004643] rounded-lg flex items-center justify-center">
              <BriefcaseBusiness size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#004643] dark:text-[#E6F4F1]">PlaceDrive</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl font-bold text-[#111827] dark:text-[#E6F4F1]">
              Welcome back
            </h1>
            <p className="text-[#6B7280] dark:text-[#E6F4F1]/60 text-sm">
              Sign in to your account to continue
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={watch('email') || ''}
              onChange={(e) => setValue('email', e.target.value)}
              error={errors.email?.message}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={watch('password') || ''}
              onChange={(e) => setValue('password', e.target.value)}
              error={errors.password?.message}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
                />
                <span className="text-sm text-[#6B7280]">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#004643] dark:text-[#0F766E] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#004643] text-white rounded-xl font-medium text-sm hover:bg-[#036b64] transition-all shadow-lg shadow-[#004643]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#1F4D4A]" />
            <span className="text-xs text-[#6B7280]">or continue with</span>
            <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#1F4D4A]" />
          </motion.div>

          {/* Role Quick Login (Dev Helper) */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
            {[
              { role: ROLES.STUDENT, label: 'Student', path: '/student/dashboard' },
              { role: ROLES.ADMIN, label: 'Admin', path: '/admin/dashboard' },
              { role: ROLES.COMPANY, label: 'Company', path: '/company/dashboard' },
            ].map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => {
                  setAuth({ name: item.label, role: item.role }, 'mock-token');
                  navigate(item.path);
                }}
                className="py-2 px-3 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-xs font-medium text-[#6B7280] hover:border-[#004643] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-all"
              >
                {item.label}
              </button>
            ))}
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-[#6B7280]"
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
            >
              Sign up for free
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;