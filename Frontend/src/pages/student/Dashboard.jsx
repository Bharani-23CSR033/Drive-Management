// src/pages/student/Dashboard.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness, FileText, CheckCircle,
  Clock, ArrowRight, TrendingUp, TrendingDown,
  ArrowUpRight, CalendarDays, Bell, ChevronRight,
  CircleDot, MoreHorizontal,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const sparkData = {
  applied: [3, 5, 4, 7, 6, 9, 8, 12],
  shortlisted: [1, 1, 2, 2, 3, 3, 4, 4],
  pending: [5, 6, 6, 7, 6, 7, 6, 6],
  drives: [18, 19, 20, 21, 22, 22, 23, 24],
};

const Sparkline = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MiniBar = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.4 }}
          className="w-1.5 rounded-sm"
        />
      ))}
    </div>
  );
};

const recentApplications = [
  { company: 'Google', role: 'Software Engineer Intern', status: 'Shortlisted', date: 'Apr 15', statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
  { company: 'Amazon', role: 'Backend Developer', status: 'Applied', date: 'Apr 14', statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
  { company: 'Zoho', role: 'Full Stack Developer', status: 'Applied', date: 'Apr 13', statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
  { company: 'Infosys', role: 'Systems Engineer', status: 'Rejected', date: 'Apr 10', statusColor: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
  { company: 'Wipro', role: 'DevOps Engineer', status: 'Applied', date: 'Apr 9', statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
];

const upcomingDrives = [
  { company: 'Microsoft', role: 'SDE Intern', salary: '8 LPA', deadline: 'Apr 20', daysLeft: 2, abbr: 'MS' },
  { company: 'Swiggy', role: 'Backend Engineer', salary: '12 LPA', deadline: 'Apr 22', daysLeft: 4, abbr: 'SW' },
  { company: 'CRED', role: 'Frontend Dev', salary: '10 LPA', deadline: 'Apr 25', daysLeft: 7, abbr: 'CR' },
];

const activityFeed = [
  { label: 'Shortlisted at Google', sub: '2 hours ago', dot: 'bg-emerald-500' },
  { label: 'Applied to Amazon', sub: '1 day ago', dot: 'bg-blue-500' },
  { label: 'Profile updated', sub: '2 days ago', dot: 'bg-[#004643]' },
  { label: 'Applied to Zoho', sub: '3 days ago', dot: 'bg-blue-500' },
  { label: 'Account created', sub: '1 week ago', dot: 'bg-gray-400' },
];

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >

      {/* ── Top Header Row ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 font-medium">
            Student Dashboard
          </p>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1] mt-0.5">
            Welcome Back, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            Your placement control room — track drives, applications and progress
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/student/drives"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643] transition-all"
          >
            <BriefcaseBusiness size={14} />
            Browse Drives
          </Link>
          <Link
            to="/student/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643] transition-all"
          >
            <FileText size={14} />
            My Profile
          </Link>
          <Link
            to="/calendar"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643] transition-all"
          >
            <CalendarDays size={14} />
            Calendar
          </Link>
          <Link
            to="/notifications"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004643] text-white text-sm font-medium hover:bg-[#036b64] transition-all"
          >
            <Bell size={14} />
            Alerts
          </Link>
        </div>
      </motion.div>

      {/* ── Stat Cards Row ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Applied Drives',
            value: '12',
            sub: 'Compare from last week',
            trend: '+3',
            up: true,
            pct: '18%',
            spark: sparkData.applied,
            color: '#3B82F6',
          },
          {
            label: 'Shortlisted',
            value: '4',
            sub: 'Compare from last week',
            trend: '+1',
            up: true,
            pct: '25%',
            spark: sparkData.shortlisted,
            color: '#10B981',
          },
          {
            label: 'Pending Review',
            value: '6',
            sub: 'Compare from last week',
            trend: '-2',
            up: false,
            pct: '12%',
            spark: sparkData.pending,
            color: '#F59E0B',
          },
          {
            label: 'Active Drives',
            value: '24',
            sub: 'Compare from last week',
            trend: '+5',
            up: true,
            pct: '8%',
            spark: sparkData.drives,
            color: '#004643',
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/60 font-medium">{s.label}</p>
              <button className="text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] transition-colors">
                <MoreHorizontal size={14} />
              </button>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-[#111827] dark:text-[#E6F4F1]">{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {s.up
                    ? <TrendingUp size={12} style={{ color: s.color }} />
                    : <TrendingDown size={12} className="text-red-500" />
                  }
                  <span className="text-xs font-semibold" style={{ color: s.up ? s.color : '#EF4444' }}>
                    {s.trend} ({s.pct})
                  </span>
                </div>
              </div>
              <MiniBar data={s.spark} color={s.color} />
            </div>

            <p className="text-xs text-[#6B7280] dark:text-[#E6F4F1]/40">{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Bento Middle Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Applications Table — spans 2 cols */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Recent Applications</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Your latest drive applications</p>
            </div>
            <Link
              to="/student/drives"
              className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-4 px-6 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
            {['Company', 'Role', 'Status', 'Date'].map((h) => (
              <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
            ))}
          </div>

          {/* Rows */}
          {recentApplications.map((app, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 * i }}
              className="grid grid-cols-4 items-center px-6 py-3.5 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
            >
              <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1]">{app.company}</p>
              <p className="text-xs text-[#6B7280] truncate pr-2">{app.role}</p>
              <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}>
                {app.status}
              </span>
              <p className="text-xs text-[#6B7280]">{app.date}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Activity</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Recent actions</p>
            </div>
            <CircleDot size={14} className="text-emerald-500" />
          </div>

          <div className="space-y-0">
            {activityFeed.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                  {i < activityFeed.length - 1 && (
                    <div className="w-px flex-1 min-h-[24px] bg-[#E5E7EB] dark:bg-[#1F4D4A] my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm text-[#111827] dark:text-[#E6F4F1] leading-snug">{item.label}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Upcoming Deadlines */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Upcoming Deadlines</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Drives closing soon — don't miss out</p>
            </div>
            <Link to="/student/drives" className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDrives.map((drive, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border border-[#E5E7EB] dark:border-[#1F4D4A] hover:border-[#004643] dark:hover:border-[#0F766E] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#004643] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {drive.abbr}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
                    <p className="text-xs text-[#6B7280]">{drive.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#004643] dark:text-[#0F766E]">{drive.salary}</p>
                    <p className="text-xs text-[#6B7280]">Per annum</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-semibold ${drive.daysLeft <= 3 ? 'text-red-500' : 'text-amber-500'}`}>
                      {drive.daysLeft}d left
                    </p>
                    <p className="text-xs text-[#6B7280]">{drive.deadline}</p>
                  </div>
                  <Link
                    to="/student/drives"
                    className="w-7 h-7 rounded-lg bg-[#004643]/10 dark:bg-[#004643]/30 flex items-center justify-center text-[#004643] dark:text-[#E6F4F1] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Placement Progress */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-5">
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Placement Pulse</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Your progress this season</p>
          </div>

          {/* Big metric */}
          <div className="bg-[#004643] rounded-xl p-5 text-center space-y-1">
            <p className="text-4xl font-bold text-white">33%</p>
            <p className="text-white/60 text-xs">Applications shortlisted</p>
            <p className="text-white/40 text-xs">4 of 12 drives</p>
          </div>

          {/* Progress bars */}
          {[
            { label: 'Applied', value: 12, max: 20, color: '#3B82F6' },
            { label: 'Shortlisted', value: 4, max: 12, color: '#10B981' },
            { label: 'Offers', value: 1, max: 4, color: '#004643' },
          ].map((bar, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#6B7280] dark:text-[#E6F4F1]/60">{bar.label}</p>
                <p className="text-xs font-bold text-[#111827] dark:text-[#E6F4F1]">{bar.value}</p>
              </div>
              <div className="h-1.5 bg-[#E5E7EB] dark:bg-[#1F4D4A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(bar.value / bar.max) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: bar.color }}
                />
              </div>
            </div>
          ))}

          <Link
            to="/student/drives"
            className="flex items-center justify-between w-full px-4 py-2.5 bg-[#004643]/8 dark:bg-[#004643]/20 rounded-xl group hover:bg-[#004643]/15 transition-all"
          >
            <span className="text-sm font-medium text-[#004643] dark:text-[#E6F4F1]">Browse more drives</span>
            <ChevronRight size={14} className="text-[#004643] dark:text-[#E6F4F1] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default Dashboard;