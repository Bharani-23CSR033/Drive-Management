// src/pages/auth/ForgotPassword.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
      toast.success('Reset link sent!');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0F2F2C] px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#004643] rounded-lg flex items-center justify-center">
            <BriefcaseBusiness size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#004643] dark:text-[#E6F4F1]">PlaceDrive</span>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-7"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-[#111827] dark:text-[#E6F4F1]">
                  Forgot password?
                </h1>
                <p className="text-[#6B7280] dark:text-[#E6F4F1]/60 text-sm leading-relaxed">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={watch('email') || ''}
                  onChange={(e) => setValue('email', e.target.value)}
                  error={errors.email?.message}
                  required
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#004643] text-white rounded-xl font-medium text-sm hover:bg-[#036b64] transition-all shadow-lg shadow-[#004643]/20 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </form>

              <Link
                to="/login"
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-colors"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle size={40} className="text-emerald-600 dark:text-emerald-400" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">
                  Check your email
                </h2>
                <p className="text-[#6B7280] dark:text-[#E6F4F1]/60 text-sm leading-relaxed">
                  We've sent a password reset link to{' '}
                  <span className="font-medium text-[#111827] dark:text-[#E6F4F1]">
                    {watch('email')}
                  </span>
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;