// src/pages/company/Dashboard.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness, Users, TrendingUp,
  CheckCircle, Plus, ArrowRight,
  MoreHorizontal, Clock, ArrowUpRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';
import useAuthStore from '../../store/authStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const MiniBar = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: i === data.length - 1 ? 1 : 0.35,
          }}
          className="w-1.5 rounded-sm"
        />
      ))}
    </div>
  );
};

const applicationData = [
  { day: 'Mon', apps: 12 },
  { day: 'Tue', apps: 18 },
  { day: 'Wed', apps: 15 },
  { day: 'Thu', apps: 25 },
  { day: 'Fri', apps: 22 },
  { day: 'Sat', apps: 8 },
  { day: 'Sun', apps: 5 },
];

const hiringData = [
  { month: 'Jan', hired: 3 },
  { month: 'Feb', hired: 5 },
  { month: 'Mar', hired: 8 },
  { month: 'Apr', hired: 6 },
  { month: 'May', hired: 10 },
  { month: 'Jun', hired: 9 },
];

const myDrives = [
  { id: 1, role: 'Software Engineer Intern', applicants: 45, shortlisted: 12, status: 'Active', deadline: 'Apr 20', daysLeft: 2 },
  { id: 2, role: 'Backend Developer', applicants: 62, shortlisted: 18, status: 'Active', deadline: 'Apr 22', daysLeft: 4 },
  { id: 3, role: 'Full Stack Dev', applicants: 38, shortlisted: 8, status: 'Closed', deadline: 'Apr 10', daysLeft: 0 },
];

const recentApplicants = [
  { name: 'Arjun Sharma', college: 'VIT Chennai', cgpa: 8.5, role: 'SWE Intern', status: 'Shortlisted' },
  { name: 'Priya Menon', college: 'PSG Tech', cgpa: 7.8, role: 'Backend Dev', status: 'Applied' },
  { name: 'Divya Lakshmi', college: 'SASTRA Univ', cgpa: 9.1, role: 'SWE Intern', status: 'Shortlisted' },
  { name: 'Arun Kumar', college: 'NIT Trichy', cgpa: 8.8, role: 'Full Stack', status: 'Selected' },
];

const statusStyle = {
  Shortlisted: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  Applied: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
  Selected: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  Rejected: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-[#111827] dark:text-[#E6F4F1] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const CompanyDashboard = () => {
  const { user } = useAuthStore();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 font-medium">Company Dashboard</p>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1] mt-0.5">
            Welcome, {user?.name || 'Recruiter'}
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            Manage your drives, review applicants, and hire top talent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/company/applicants/1"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643] transition-all"
          >
            <Users size={14} />
            View Applicants
          </Link>
          <Link
            to="/company/post-drive"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004643] text-white text-sm font-medium hover:bg-[#036b64] transition-all"
          >
            <Plus size={14} />
            Post Drive
          </Link>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applicants', value: '145', sub: 'Compare from last month', trend: '+23', pct: '18%', spark: [80, 90, 100, 110, 120, 130, 138, 145], color: '#3B82F6' },
          { label: 'Active Drives', value: '2', sub: 'Compare from last month', trend: '+1', pct: '50%', spark: [1, 1, 1, 2, 2, 2, 2, 2], color: '#004643' },
          { label: 'Shortlisted', value: '38', sub: 'Compare from last month', trend: '+8', pct: '26%', spark: [20, 22, 25, 28, 30, 33, 36, 38], color: '#F59E0B' },
          { label: 'Selected', value: '12', sub: 'Compare from last month', trend: '+4', pct: '50%', spark: [5, 6, 7, 8, 9, 10, 11, 12], color: '#10B981' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/60 font-medium">{s.label}</p>
              <button className="text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1]">
                <MoreHorizontal size={14} />
              </button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-[#111827] dark:text-[#E6F4F1]">{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} style={{ color: s.color }} />
                  <span className="text-xs font-semibold" style={{ color: s.color }}>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar Chart — Daily Applications */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Daily Applications</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Applications received this week</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={applicationData} barSize={20}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="apps" fill="#004643" radius={[4, 4, 0, 0]} name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line Chart — Monthly Hiring */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
          <div className="mb-5">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Monthly Hiring</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Candidates selected per month</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hiringData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="hired" stroke="#004643" strokeWidth={2.5} dot={{ fill: '#004643', r: 3 }} name="Hired" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* My Drives */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">My Drives</p>
            <p className="text-xs text-[#6B7280] mt-0.5">All placement drives you have posted</p>
          </div>
          <Link
            to="/company/post-drive"
            className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline flex items-center gap-1"
          >
            Post new <ArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-5 px-6 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
          {['Role', 'Applicants', 'Shortlisted', 'Status', 'Action'].map((h) => (
            <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
          ))}
        </div>

        {myDrives.map((drive, i) => (
          <div
            key={drive.id}
            className="grid grid-cols-5 items-center px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
          >
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.role}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock size={10} className="text-[#6B7280]" />
                <p className={`text-xs ${drive.daysLeft <= 3 && drive.status === 'Active' ? 'text-red-500 font-medium' : 'text-[#6B7280]'}`}>
                  {drive.status === 'Active' ? `${drive.daysLeft}d left` : drive.deadline}
                </p>
              </div>
            </div>
            <p className="text-sm font-bold text-[#111827] dark:text-[#E6F4F1]">{drive.applicants}</p>
            <p className="text-sm font-bold text-[#004643] dark:text-[#0F766E]">{drive.shortlisted}</p>
            <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              drive.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${drive.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {drive.status}
            </span>
            <Link
              to={`/company/applicants/${drive.id}`}
              className="flex items-center gap-1 text-xs font-medium text-[#004643] dark:text-[#0F766E] hover:underline"
            >
              View <ArrowUpRight size={11} />
            </Link>
          </div>
        ))}
      </motion.div>

      {/* Recent Applicants */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Recent Applicants</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Latest candidates who applied</p>
          </div>
          <Link
            to="/company/applicants/1"
            className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {recentApplicants.map((applicant, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] hover:border-[#004643] dark:hover:border-[#0F766E] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#004643] rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {applicant.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{applicant.name}</p>
                  <p className="text-xs text-[#6B7280]">{applicant.college} · CGPA {applicant.cgpa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-[#6B7280] hidden sm:block">{applicant.role}</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[applicant.status]}`}>
                  {applicant.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default CompanyDashboard;