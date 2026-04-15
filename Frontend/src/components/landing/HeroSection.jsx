// src/components/landing/HeroSection.jsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Users, Building2, TrendingUp } from 'lucide-react';
import Button from '../common/Button';

const floatingCards = [
  {
    icon: BriefcaseBusiness,
    label: 'Active Drives',
    value: '24',
    color: 'bg-[#004643]',
    delay: 0,
  },
  {
    icon: Users,
    label: 'Students Placed',
    value: '1,200+',
    color: 'bg-[#0F766E]',
    delay: 0.15,
  },
  {
    icon: Building2,
    label: 'Companies',
    value: '80+',
    color: 'bg-amber-500',
    delay: 0.3,
  },
  {
    icon: TrendingUp,
    label: 'Placement Rate',
    value: '94%',
    color: 'bg-blue-500',
    delay: 0.45,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HeroSection = ({ featuresRef }) => {
  const scrollToFeatures = () => {
    featuresRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#FAFAFA] dark:bg-[#0F2F2C]">

      {/* Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#004643]/8 dark:bg-[#004643]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#0F766E]/6 dark:bg-[#0F766E]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#004643]/3 dark:bg-[#004643]/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004643]/10 dark:bg-[#004643]/30 text-[#004643] dark:text-[#E6F4F1] text-xs font-medium border border-[#004643]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004643] dark:bg-[#0F766E] animate-pulse" />
                Campus Placement Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] dark:text-[#E6F4F1] leading-tight tracking-tight">
                Your Career
                <span className="block text-[#004643] dark:text-[#0F766E]">
                  Starts Here.
                </span>
              </h1>
              <p className="text-lg text-[#6B7280] dark:text-[#E6F4F1]/70 leading-relaxed max-w-lg">
                Manage campus placement drives seamlessly. Students apply, admins coordinate, companies hire — all in one unified platform.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#004643] text-white rounded-xl font-medium text-sm hover:bg-[#036b64] transition-all shadow-lg shadow-[#004643]/25"
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <motion.button
                onClick={scrollToFeatures}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#143C3A] text-[#004643] dark:text-[#E6F4F1] rounded-xl font-medium text-sm border border-[#E5E7EB] dark:border-[#1F4D4A] hover:border-[#004643] dark:hover:border-[#0F766E] transition-all"
              >
                Explore Features
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-[#004643] border-2 border-white dark:border-[#0F2F2C] flex items-center justify-center text-white text-xs font-medium"
                    style={{ opacity: 1 - i * 0.15 }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/60">
                <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">1,200+</span> students placed this year
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Dashboard Mock */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative bg-white dark:bg-[#143C3A] rounded-2xl border border-[#E5E7EB] dark:border-[#1F4D4A] shadow-2xl shadow-[#004643]/10 p-6 space-y-5">

              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6B7280]">Welcome back</p>
                  <p className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Student Dashboard</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#004643] flex items-center justify-center">
                  <BriefcaseBusiness size={16} className="text-white" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {floatingCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + card.delay, duration: 0.5 }}
                      className="bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#1F4D4A]"
                    >
                      <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center mb-2`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <p className="text-lg font-bold text-[#111827] dark:text-[#E6F4F1]">{card.value}</p>
                      <p className="text-xs text-[#6B7280]">{card.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Drive */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Recent Drives</p>
                {[
                  { company: 'Google', role: 'SWE Intern', status: 'Applied', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                  { company: 'Amazon', role: 'Backend Dev', status: 'Shortlisted', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
                  { company: 'Zoho', role: 'Full Stack', status: 'Pending', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A]"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1]">{item.company}</p>
                      <p className="text-xs text-[#6B7280]">{item.role}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.color}`}>
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="absolute -bottom-5 -left-5 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-3 shadow-lg flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-medium text-[#111827] dark:text-[#E6F4F1]">3 new drives today</p>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="absolute -top-5 -right-5 bg-[#004643] rounded-xl px-4 py-3 shadow-lg"
            >
              <p className="text-xs font-medium text-white">🎉 Offer Received!</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;