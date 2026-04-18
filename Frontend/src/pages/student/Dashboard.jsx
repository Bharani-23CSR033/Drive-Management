// src/pages/student/Dashboard.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness, FileText, CheckCircle,
  Clock, ArrowRight, TrendingUp, Bell, Calendar,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { SkeletonCard } from '../../components/common/Skeleton';
import useAuthStore from '../../store/authStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stats = [
  {
    label: 'Applied Drives',
    value: '12',
    icon: FileText,
    trend: '+3 this week',
    color: 'bg-blue-500',
    trendUp: true,
  },
  {
    label: 'Shortlisted',
    value: '4',
    icon: CheckCircle,
    trend: '+1 today',
    color: 'bg-emerald-500',
    trendUp: true,
  },
  {
    label: 'Pending',
    value: '6',
    icon: Clock,
    trend: '2 closing soon',
    color: 'bg-amber-500',
    trendUp: false,
  },
  {
    label: 'Active Drives',
    value: '24',
    icon: BriefcaseBusiness,
    trend: '5 new today',
    color: 'bg-[#004643]',
    trendUp: true,
  },
];

const recentApplications = [
  { company: 'Google', role: 'Software Engineer Intern', status: 'shortlisted', date: 'Apr 15', logo: 'G' },
  { company: 'Amazon', role: 'Backend Developer', status: 'applied', date: 'Apr 14', logo: 'A' },
  { company: 'Zoho', role: 'Full Stack Developer', status: 'applied', date: 'Apr 13', logo: 'Z' },
  { company: 'Infosys', role: 'Systems Engineer', status: 'rejected', date: 'Apr 10', logo: 'I' },
  { company: 'Wipro', role: 'DevOps Engineer', status: 'applied', date: 'Apr 9', logo: 'W' },
];

const recommendedDrives = [
  { company: 'Microsoft', role: 'SDE Intern', salary: '₹8 LPA', deadline: 'Apr 20', logo: 'M', color: 'bg-blue-500' },
  { company: 'Swiggy', role: 'Backend Engineer', salary: '₹12 LPA', deadline: 'Apr 22', logo: 'S', color: 'bg-orange-500' },
  { company: 'CRED', role: 'Frontend Dev', salary: '₹10 LPA', deadline: 'Apr 25', logo: 'C', color: 'bg-purple-500' },
  { company: 'Razorpay', role: 'Full Stack Dev', salary: '₹15 LPA', deadline: 'Apr 28', logo: 'R', color: 'bg-blue-700' },
];

const activityTimeline = [
  { action: 'Shortlisted at Google', time: '2 hours ago', type: 'success' },
  { action: 'Applied to Amazon', time: '1 day ago', type: 'info' },
  { action: 'Profile updated', time: '2 days ago', type: 'neutral' },
  { action: 'Applied to Zoho', time: '3 days ago', type: 'info' },
  { action: 'Account created', time: '1 week ago', type: 'neutral' },
];

const statusVariant = {
  shortlisted: 'success',
  applied: 'info',
  rejected: 'danger',
  selected: 'success',
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-[#004643] rounded-2xl p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-white/60 text-sm">Good morning 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-white/70 text-sm">
              You have <span className="text-white font-semibold">3 new drives</span> matching your profile today.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/student/drives"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#004643] rounded-xl text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Browse Drives
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} hover className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
                  <TrendingUp size={12} />
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#111827] dark:text-[#E6F4F1]">
                  {stat.value}
                </p>
                <p className="text-sm text-[#6B7280] mt-0.5">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Applications */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card padding="p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
              <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">
                Recent Applications
              </h2>
              <Link
                to="/student/drives"
                className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-[#E5E7EB] dark:divide-[#1F4D4A]">
              {recentApplications.map((app, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#004643] rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {app.logo}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1]">
                        {app.company}
                      </p>
                      <p className="text-xs text-[#6B7280]">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      label={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      variant={statusVariant[app.status]}
                    />
                    <span className="text-xs text-[#6B7280]">{app.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1] mb-5">
              Activity
            </h2>
            <div className="space-y-4">
              {activityTimeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                      item.type === 'success' ? 'bg-emerald-500' :
                      item.type === 'info' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    {i < activityTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-[#E5E7EB] dark:bg-[#1F4D4A] mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-[#111827] dark:text-[#E6F4F1] font-medium leading-tight">
                      {item.action}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recommended Drives */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">
            Recommended Drives
          </h2>
          <Link
            to="/student/drives"
            className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedDrives.map((drive, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,70,67,0.12)' }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl p-5 space-y-4 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 ${drive.color} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                  {drive.logo}
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <Clock size={11} />
                  {drive.deadline}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">
                  {drive.company}
                </p>
                <p className="text-xs text-[#6B7280] mt-0.5">{drive.role}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#004643] dark:text-[#0F766E]">
                  {drive.salary}
                </span>
                <Link
                  to="/student/drives"
                  className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
                >
                  Apply →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Notifications Banner */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl px-5 py-4"
      >
        <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <Bell size={16} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Interview scheduled with Google
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            Tomorrow at 10:00 AM — Technical Round 1
          </p>
        </div>
        <Link
          to="/calendar"
          className="text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline flex items-center gap-1 flex-shrink-0"
        >
          <Calendar size={12} />
          View Calendar
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;