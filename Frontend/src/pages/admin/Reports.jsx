// src/pages/admin/Reports.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download, FileText, Table,
  Filter, ChevronDown, CheckCircle,
  TrendingUp, Users, BriefcaseBusiness,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const reportData = [
  { month: 'Jan', placed: 12, drives: 3 },
  { month: 'Feb', placed: 18, drives: 5 },
  { month: 'Mar', placed: 25, drives: 7 },
  { month: 'Apr', placed: 22, drives: 6 },
  { month: 'May', placed: 30, drives: 9 },
  { month: 'Jun', placed: 28, drives: 8 },
];

const reportTypes = [
  {
    id: 'placement',
    title: 'Placement Report',
    desc: 'Complete placement summary with company, role, and student details',
    icon: BriefcaseBusiness,
    color: 'bg-[#004643]',
    rows: 94,
  },
  {
    id: 'student',
    title: 'Student Report',
    desc: 'All registered students with academic and application details',
    icon: Users,
    color: 'bg-blue-500',
    rows: 300,
  },
  {
    id: 'drive',
    title: 'Drive Summary',
    desc: 'All placement drives with applicant count and status',
    icon: FileText,
    color: 'bg-amber-500',
    rows: 28,
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    desc: 'Student attendance across all recruitment events',
    icon: CheckCircle,
    color: 'bg-emerald-500',
    rows: 450,
  },
];

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

const Reports = () => {
  const [dateRange, setDateRange] = useState('This Year');
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (type, format) => {
    const key = `${type}-${format}`;
    setDownloading(key);
    await new Promise((r) => setTimeout(r, 1500));
    setDownloading(null);
    toast.success(`${format.toUpperCase()} report downloaded`);
  };

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
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Reports</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            Generate and download placement reports
          </p>
        </div>
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-2.5 pr-8 text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] transition-all cursor-pointer"
          >
            {['This Month', 'Last 3 Months', 'This Year', 'All Time'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Drives', value: '28', trend: '+5 this month', icon: BriefcaseBusiness, color: '#004643' },
          { label: 'Students Placed', value: '94', trend: '+12 this month', icon: CheckCircle, color: '#10B981' },
          { label: 'Avg Package', value: '8.4 LPA', trend: '+1.2 from last year', icon: TrendingUp, color: '#3B82F6' },
          { label: 'Companies', value: '28', trend: '+4 this month', icon: Users, color: '#F59E0B' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#6B7280]">{stat.label}</p>
                <Icon size={14} style={{ color: stat.color }} />
              </div>
              <p className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">{stat.value}</p>
              <p className="text-xs" style={{ color: stat.color }}>{stat.trend}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Chart */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Monthly Summary</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Placements and drives per month</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#6B7280]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#004643] inline-block" />
              Placed
            </span>
            <span className="flex items-center gap-1.5 text-[#6B7280]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0F766E]/40 inline-block" />
              Drives
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={reportData} barSize={16} barGap={4}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="drives" fill="#0F766E" opacity={0.35} radius={[4, 4, 0, 0]} name="Drives" />
            <Bar dataKey="placed" fill="#004643" radius={[4, 4, 0, 0]} name="Placed" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Report Cards */}
      <motion.div variants={itemVariants}>
        <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-4">Download Reports</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${report.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{report.title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{report.desc}</p>
                    <p className="text-xs text-[#004643] dark:text-[#0F766E] font-medium mt-1">{report.rows} records</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDownload(report.id, 'pdf')}
                    disabled={!!downloading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-xl text-xs font-semibold hover:bg-[#004643]/20 transition-all disabled:opacity-60"
                  >
                    {downloading === `${report.id}-pdf` ? (
                      <div className="w-3 h-3 border-2 border-[#004643]/30 border-t-[#004643] rounded-full animate-spin" />
                    ) : (
                      <FileText size={13} />
                    )}
                    PDF
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDownload(report.id, 'excel')}
                    disabled={!!downloading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all disabled:opacity-60"
                  >
                    {downloading === `${report.id}-excel` ? (
                      <div className="w-3 h-3 border-2 border-emerald-300 border-t-emerald-700 rounded-full animate-spin" />
                    ) : (
                      <Table size={13} />
                    )}
                    Excel
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Reports;