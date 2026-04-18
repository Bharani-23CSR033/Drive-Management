// src/pages/auth/Signup.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, ArrowRight, Mail, Lock, User, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import { ROLES } from '../../constants/roles';
import useAuthStore from '../../store/authStore';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum([ROLES.STUDENT, ROLES.ADMIN, ROLES.COMPANY]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const roles = [
  { value: ROLES.STUDENT, label: 'Student', icon: User, desc: 'Looking for placement' },
  { value: ROLES.ADMIN, label: 'Admin', icon: Building2, desc: 'Placement cell coordinator' },
  { value: ROLES.COMPANY, label: 'Company', icon: BriefcaseBusiness, desc: 'Hiring from campus' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: ROLES.STUDENT },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const mockUser = { name: data.name, email: data.email, role: data.role };
      setAuth(mockUser, 'mock-token-123');
      toast.success('Account created successfully!');
      const paths = {
        [ROLES.STUDENT]: '/student/dashboard',
        [ROLES.ADMIN]: '/admin/dashboard',
        [ROLES.COMPANY]: '/company/dashboard',
      };
      navigate(paths[data.role]);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-[#0F2F2C]">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004643] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BriefcaseBusiness size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">PlaceDrive</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-6"
        >
          <h2 className="text-4xl font-bold text-white leading-tight">
            Join thousands of students getting placed.
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            Create your account and access placement drives from top companies across the country.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Apply to multiple drives in seconds',
              'Get real-time status updates',
              'Never miss a deadline with smart alerts',
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <p className="text-white/80 text-sm">{point}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} PlaceDrive. All rights reserved.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-7"
        >
          {/* Mobile Logo */}
          <motion.div variants={itemVariants} className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#004643] rounded-lg flex items-center justify-center">
              <BriefcaseBusiness size={16} className="text-white" />
            </div>
            <span className="font-bold text-[#004643] dark:text-[#E6F4F1]">PlaceDrive</span>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl font-bold text-[#111827] dark:text-[#E6F4F1]">
              Create account
            </h1>
            <p className="text-[#6B7280] dark:text-[#E6F4F1]/60 text-sm">
              Get started with PlaceDrive today
            </p>
          </motion.div>

          {/* Role Selector */}
          <motion.div variants={itemVariants} className="space-y-2">
            <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1]">I am a</p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.value);
                      setValue('role', r.value);
                    }}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200
                      ${isSelected
                        ? 'border-[#004643] bg-[#004643]/8 dark:bg-[#004643]/20'
                        : 'border-[#E5E7EB] dark:border-[#1F4D4A] hover:border-[#004643]/50'
                      }
                    `}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#004643]' : 'bg-gray-100 dark:bg-[#1F4D4A]'}`}>
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-[#6B7280]'} />
                    </div>
                    <span className={`text-xs font-medium ${isSelected ? 'text-[#004643] dark:text-[#E6F4F1]' : 'text-[#6B7280]'}`}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              type="text"
              icon={User}
              value={watch('name') || ''}
              onChange={(e) => setValue('name', e.target.value)}
              error={errors.name?.message}
              required
            />

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

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              value={watch('confirmPassword') || ''}
              onChange={(e) => setValue('confirmPassword', e.target.value)}
              error={errors.confirmPassword?.message}
              required
            />

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
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-[#6B7280]"
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;