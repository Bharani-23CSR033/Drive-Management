// src/pages/shared/NotFound.jsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0F2F2C] px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-9 h-9 bg-[#004643] rounded-xl flex items-center justify-center">
            <BriefcaseBusiness size={18} className="text-white" />
          </div>
          <span className="font-bold text-[#004643] dark:text-[#E6F4F1] text-lg">PlaceDrive</span>
        </div>

        {/* 404 */}
        <div className="space-y-2">
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="text-8xl font-black text-[#004643] dark:text-[#0F766E] leading-none"
          >
            404
          </motion.p>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">
            Page not found
          </h1>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        {/* Illustration */}
        <div className="w-32 h-32 bg-[#004643]/10 dark:bg-[#004643]/20 rounded-full flex items-center justify-center mx-auto">
          <div className="w-20 h-20 bg-[#004643]/20 dark:bg-[#004643]/30 rounded-full flex items-center justify-center">
            <BriefcaseBusiness size={36} className="text-[#004643] dark:text-[#0F766E]" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <Link
            to="/student/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-[#111827] dark:text-[#E6F4F1] rounded-xl text-sm font-semibold hover:border-[#004643] transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;