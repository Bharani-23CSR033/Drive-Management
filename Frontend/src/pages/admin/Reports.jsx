// src/pages/admin/Reports.jsx

import { useEffect, useState } from 'react';
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
import adminApi from '../../api/adminApi';
import driveApi from '../../api/driveApi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const fallbackReportData = [
  { month: 'Jan', placed: 12, drives: 3 },
  { month: 'Feb', placed: 18, drives: 5 },
  { month: 'Mar', placed: 25, drives: 7 },
  { month: 'Apr', placed: 22, drives: 6 },
  { month: 'May', placed: 30, drives: 9 },
  { month: 'Jun', placed: 28, drives: 8 },
];

const fallbackReportTypes = [
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

const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatSalaryLpa = (salary) => {
  const numericSalary = Number(salary) || 0;
  if (!numericSalary) return '-';
  const lpa = numericSalary / 100000;
  return `${Number.isInteger(lpa) ? lpa : lpa.toFixed(1)} LPA`;
};

const formatDateLabel = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getCompanyName = (company) => {
  if (!company) return 'Company';
  if (typeof company === 'string') return company;
  return company.name || company.email || 'Company';
};

const createCsv = (headers, rows) => [
  headers.join(','),
  ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
].join('\n');

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
  const [summaryStats, setSummaryStats] = useState({
    totalDrives: 0,
    studentsPlaced: 0,
    avgPackage: '0 LPA',
    companies: 0,
    totalStudents: 0,
  });
  const [reportData, setReportData] = useState(fallbackReportData);
  const [reportTypes, setReportTypes] = useState(fallbackReportTypes);
  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRows, setAttendanceRows] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [dashboardResponse, reportsResponse, studentsResponse, drivesResponse] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getReports({ range: dateRange }),
          adminApi.getStudents({ limit: 1000 }),
          driveApi.getAll(),
        ]);

        const reportDrives = reportsResponse?.data?.drives || [];
        const summary = reportsResponse?.data?.summary || [];
        const summaryMap = new Map(summary.map((entry) => [String(entry._id), entry]));
        const liveDrives = (drivesResponse?.data?.drives || []).map((drive) => ({
          id: drive.id,
          company: getCompanyName(drive.company),
          role: drive.role || drive.title || 'Drive',
          salary: formatSalaryLpa(drive.salary),
          deadline: formatDateLabel(drive.deadline),
          status: drive.status || 'Active',
          applicants: drive.applicants || 0,
          attendance: Array.isArray(drive.attendance) ? drive.attendance : [],
        }));
        const liveStudents = (studentsResponse?.data?.students || []).map((student) => ({
          id: student.id,
          name: student.name || 'Student',
          college: student.college || '-',
          branch: student.branch || '-',
          cgpa: student.CGPA ?? student.cgpa ?? 0,
          applications: student.applications || 0,
        }));

        const monthlyMap = new Map();
        liveDrives.forEach((drive) => {
          const date = new Date(drive.deadline);
          const month = Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString('en-US', { month: 'short' });
          const current = monthlyMap.get(month) || { month, placed: 0, drives: 0 };
          current.drives += 1;
          current.placed += summaryMap.get(String(drive.id))?.selected || 0;
          monthlyMap.set(month, current);
        });

        const orderedMonthly = monthOrder
          .filter((month) => monthlyMap.has(month))
          .map((month) => monthlyMap.get(month));

        const attendanceList = liveDrives.flatMap((drive) => (
          drive.attendance.map((entry) => ({
            drive: drive.role,
            company: drive.company,
            student: entry.student?.name || entry.student?.email || 'Student',
            status: String(entry.status || '').toLowerCase(),
            markedAt: entry.markedAt ? new Date(entry.markedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-',
          }))
        ));

        const totalSelected = summary.reduce((sum, entry) => sum + (entry.selected || 0), 0);
        const avgSalary = liveDrives.length > 0
          ? liveDrives.reduce((sum, drive) => sum + (Number(drive.salary.replace(/[^0-9.]/g, '')) || 0), 0) / liveDrives.length
          : 0;

        setDrives(liveDrives);
        setStudents(liveStudents);
        setAttendanceRows(attendanceList);
        setReportData(orderedMonthly.length > 0 ? orderedMonthly : fallbackReportData);
        setSummaryStats({
          totalDrives: liveDrives.length || dashboardResponse?.data?.totalDrives || 0,
          studentsPlaced: totalSelected,
          avgPackage: `${avgSalary ? avgSalary.toFixed(1) : '0'} LPA`,
          companies: new Set(liveDrives.map((drive) => drive.company)).size,
          totalStudents: dashboardResponse?.data?.totalStudents || liveStudents.length,
        });
        setReportTypes([
          {
            id: 'placement',
            title: 'Placement Report',
            desc: 'Complete placement summary with company, role, and student details',
            icon: BriefcaseBusiness,
            color: 'bg-[#004643]',
            rows: totalSelected,
          },
          {
            id: 'student',
            title: 'Student Report',
            desc: 'All registered students with academic and application details',
            icon: Users,
            color: 'bg-blue-500',
            rows: liveStudents.length,
          },
          {
            id: 'drive',
            title: 'Drive Summary',
            desc: 'All placement drives with applicant count and status',
            icon: FileText,
            color: 'bg-amber-500',
            rows: liveDrives.length,
          },
          {
            id: 'attendance',
            title: 'Attendance Report',
            desc: 'Student attendance across all recruitment events',
            icon: CheckCircle,
            color: 'bg-emerald-500',
            rows: attendanceList.length,
          },
        ]);
      } catch {
        setReportData(fallbackReportData);
        setReportTypes(fallbackReportTypes);
      }
    };

    fetchReports();
  }, [dateRange]);

  const handleDownload = async (type, format) => {
    const key = `${type}-${format}`;
    setDownloading(key);
    const fileName = `${type}-${dateRange.toLowerCase().replace(/\s+/g, '-')}.${format === 'pdf' ? 'txt' : 'csv'}`;

    const datasets = {
      placement: createCsv(['month', 'placed', 'drives'], reportData),
      student: createCsv(['name', 'college', 'branch', 'cgpa', 'applications'], students),
      drive: createCsv(['company', 'role', 'salary', 'deadline', 'status', 'applicants'], drives),
      attendance: createCsv(['drive', 'company', 'student', 'status', 'markedAt'], attendanceRows),
    };

    const blob = new Blob([datasets[type] || ''], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
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
          { label: 'Total Drives', value: String(summaryStats.totalDrives), trend: '+5 this month', icon: BriefcaseBusiness, color: '#004643' },
          { label: 'Students Placed', value: String(summaryStats.studentsPlaced), trend: '+12 this month', icon: CheckCircle, color: '#10B981' },
          { label: 'Avg Package', value: summaryStats.avgPackage, trend: '+1.2 from last year', icon: TrendingUp, color: '#3B82F6' },
          { label: 'Companies', value: String(summaryStats.companies), trend: '+4 this month', icon: Users, color: '#F59E0B' },
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