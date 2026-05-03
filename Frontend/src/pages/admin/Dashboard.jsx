// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, BriefcaseBusiness, TrendingUp, Award,
  ArrowRight, MoreHorizontal, ArrowUpRight,
  CheckCircle, Clock, XCircle, Plus,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart,
  Pie, Cell,
} from 'recharts';
import adminApi from '../../api/adminApi';

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

const placementData = [
  { month: 'Jan', placed: 12, applied: 45 },
  { month: 'Feb', placed: 18, applied: 60 },
  { month: 'Mar', placed: 25, applied: 80 },
  { month: 'Apr', placed: 22, applied: 72 },
  { month: 'May', placed: 30, applied: 95 },
  { month: 'Jun', placed: 28, applied: 88 },
];

const trendData = [
  { week: 'W1', drives: 3 },
  { week: 'W2', drives: 5 },
  { week: 'W3', drives: 4 },
  { week: 'W4', drives: 8 },
  { week: 'W5', drives: 6 },
  { week: 'W6', drives: 10 },
];

const pieData = [
  { name: 'Placed', value: 94, color: '#004643' },
  { name: 'In Process', value: 120, color: '#0F766E' },
  { name: 'Not Applied', value: 86, color: '#E5E7EB' },
];

const fallbackRecentDrives = [
  { company: 'Google', role: 'SWE Intern', applicants: 45, status: 'Active', deadline: 'Apr 20', abbr: 'G', color: 'bg-blue-500' },
  { company: 'Amazon', role: 'Backend Dev', applicants: 62, status: 'Active', deadline: 'Apr 22', abbr: 'A', color: 'bg-amber-500' },
  { company: 'Microsoft', role: 'SDE Intern', applicants: 38, status: 'Closed', deadline: 'Apr 10', abbr: 'MS', color: 'bg-blue-700' },
  { company: 'Zoho', role: 'Full Stack', applicants: 91, status: 'Active', deadline: 'Apr 28', abbr: 'Z', color: 'bg-red-500' },
  { company: 'Infosys', role: 'Systems Eng', applicants: 120, status: 'Closed', deadline: 'Apr 5', abbr: 'IN', color: 'bg-teal-600' },
];

const recentStudents = [
  { name: 'Arjun Sharma', college: 'VIT Chennai', status: 'Placed', company: 'Google' },
  { name: 'Priya Menon', college: 'PSG Tech', status: 'Shortlisted', company: 'Amazon' },
  { name: 'Rahul Nair', college: 'Kongu Engg', status: 'Applied', company: 'Zoho' },
  { name: 'Sneha Reddy', college: 'SRM Univ', status: 'Placed', company: 'TCS' },
];

const statusStyle = {
  Active: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  Closed: 'text-gray-500 bg-gray-100 dark:bg-gray-800/40 dark:text-gray-400',
  Placed: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  Shortlisted: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  Applied: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
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

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 300,
    activeDrives: 18,
    selectedStudents: 94,
    placementRate: 94,
  });
  const [recentDrives, setRecentDrives] = useState(fallbackRecentDrives);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const [dashboardResponse, reportsResponse] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getReports(),
        ]);

        const dashboard = dashboardResponse?.data || {};
        const reportDrives = reportsResponse?.data?.drives || [];
        const summary = reportsResponse?.data?.summary || [];
        const summaryMap = new Map(summary.map((entry) => [String(entry._id), entry]));

        setDashboardStats({
          totalStudents: dashboard.totalStudents ?? 0,
          activeDrives: reportDrives.filter((drive) => String(drive.status || '').toLowerCase() !== 'closed').length || dashboard.totalDrives || 0,
          selectedStudents: summary.reduce((sum, entry) => sum + (entry.selected || 0), 0),
          placementRate: dashboard.placementRate ?? 0,
        });

        setRecentDrives(reportDrives.length > 0 ? reportDrives.slice(0, 5).map((drive) => ({
          company: drive.company?.name || drive.company || 'Company',
          role: drive.title || drive.role || 'Drive',
          applicants: summaryMap.get(String(drive._id))?.totalApplications || 0,
          status: String(drive.status || '').toLowerCase() === 'closed' ? 'Closed' : 'Active',
          deadline: drive.deadline ? new Date(drive.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-',
          abbr: (drive.company?.name || drive.company || 'D').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'D',
          color: ['bg-blue-500', 'bg-amber-500', 'bg-blue-700', 'bg-red-500', 'bg-teal-600'][Math.abs(String(drive._id).length) % 5],
        })) : fallbackRecentDrives);
      } catch {
        setRecentDrives(fallbackRecentDrives);
      }
    };

    fetchAdminDashboard();
  }, []);

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
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 font-medium">Admin Dashboard</p>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1] mt-0.5">Placement Overview</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            Monitor drives, students, and placement statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/drives"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643] transition-all"
          >
            <BriefcaseBusiness size={14} />
            Manage Drives
          </Link>
          <Link
            to="/admin/drives"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004643] text-white text-sm font-medium hover:bg-[#036b64] transition-all"
          >
            <Plus size={14} />
            New Drive
          </Link>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: String(dashboardStats.totalStudents), sub: 'Compare from last month', trend: '+24', up: true, pct: '8%', spark: [240, 255, 260, 270, 280, 290, 295, 300], color: '#3B82F6' },
          { label: 'Active Drives', value: String(dashboardStats.activeDrives), sub: 'Compare from last month', trend: '+5', up: true, pct: '28%', spark: [10, 11, 13, 12, 14, 15, 16, 18], color: '#004643' },
          { label: 'Students Placed', value: String(dashboardStats.selectedStudents), sub: 'Compare from last month', trend: '+12', up: true, pct: '15%', spark: [60, 65, 70, 75, 78, 82, 88, 94], color: '#10B981' },
          { label: 'Placement Rate', value: `${dashboardStats.placementRate}%`, sub: 'Compare from last month', trend: '+2%', up: true, pct: '2%', spark: [88, 89, 90, 91, 91, 92, 93, 94], color: '#F59E0B' },
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar Chart — Placements */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Placement vs Applications</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Monthly comparison this year</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#004643] inline-block" />
                Placed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0F766E]/40 inline-block" />
                Applied
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={placementData} barSize={14} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="applied" fill="#0F766E" opacity={0.3} radius={[4, 4, 0, 0]} name="Applied" />
              <Bar dataKey="placed" fill="#004643" radius={[4, 4, 0, 0]} name="Placed" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Student Status</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Overall placement breakdown</p>
          </div>
          <div className="flex items-center justify-center">
            <PieChart width={160} height={160}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#6B7280]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Drives Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Recent Drives</p>
              <p className="text-xs text-[#6B7280] mt-0.5">Latest placement drives activity</p>
            </div>
            <Link to="/admin/drives" className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline flex items-center gap-1">
              Manage all <ArrowRight size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-4 px-6 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
            {['Company', 'Applicants', 'Status', 'Deadline'].map((h) => (
              <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
            ))}
          </div>

          {recentDrives.map((drive, i) => (
            <div key={i} className="grid grid-cols-4 items-center px-6 py-3.5 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 ${drive.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {drive.abbr}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
                  <p className="text-xs text-[#6B7280]">{drive.role}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.applicants}</p>
              <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[drive.status]}`}>
                {drive.status}
              </span>
              <p className="text-xs text-[#6B7280]">{drive.deadline}</p>
            </div>
          ))}
        </motion.div>

        {/* Recent Students + Line Chart */}
        <motion.div variants={itemVariants} className="space-y-4">

          {/* Line Chart */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-1">Drive Activity</p>
            <p className="text-xs text-[#6B7280] mb-4">New drives per week</p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={trendData}>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="drives" stroke="#004643" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Students */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Recent Activity</p>
              <Link to="/admin/students" className="text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline">
                View all
              </Link>
            </div>
            {recentStudents.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#004643] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#111827] dark:text-[#E6F4F1]">{s.name}</p>
                    <p className="text-xs text-[#6B7280]">{s.college}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[s.status]}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;