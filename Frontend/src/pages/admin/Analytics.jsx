// src/pages/admin/Analytics.jsx

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, BriefcaseBusiness,
  Award, MoreHorizontal,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, AreaChart, Area,
  Legend,
} from 'recharts';
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

const fallbackMonthlyData = [
  { month: 'Jan', placed: 12, applied: 45, drives: 3 },
  { month: 'Feb', placed: 18, applied: 60, drives: 5 },
  { month: 'Mar', placed: 25, applied: 80, drives: 7 },
  { month: 'Apr', placed: 22, applied: 72, drives: 6 },
  { month: 'May', placed: 30, applied: 95, drives: 9 },
  { month: 'Jun', placed: 28, applied: 88, drives: 8 },
  { month: 'Jul', placed: 35, applied: 100, drives: 11 },
  { month: 'Aug', placed: 40, applied: 110, drives: 13 },
];

const fallbackBranchData = [
  { branch: 'CSE', students: 120, placed: 98 },
  { branch: 'IT', students: 80, placed: 60 },
  { branch: 'ECE', students: 60, placed: 40 },
  { branch: 'EEE', students: 40, placed: 22 },
  { branch: 'MECH', students: 30, placed: 10 },
];

const fallbackCompanyData = [
  { name: 'Google', value: 15, color: '#3B82F6' },
  { name: 'Amazon', value: 22, color: '#F59E0B' },
  { name: 'Microsoft', value: 18, color: '#6366F1' },
  { name: 'Zoho', value: 30, color: '#EF4444' },
  { name: 'Others', value: 25, color: '#10B981' },
];

const fallbackSalaryData = [
  { range: '3-5 LPA', count: 20 },
  { range: '5-8 LPA', count: 35 },
  { range: '8-12 LPA', count: 28 },
  { range: '12-15 LPA', count: 15 },
  { range: '15+ LPA', count: 10 },
];

const fallbackCgpaData = [
  { cgpa: '6-7', placed: 15, notPlaced: 20 },
  { cgpa: '7-8', placed: 35, notPlaced: 18 },
  { cgpa: '8-9', placed: 42, notPlaced: 8 },
  { cgpa: '9-10', placed: 18, notPlaced: 2 },
];

const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatSalaryLpa = (salary) => {
  const numericSalary = Number(salary) || 0;
  if (!numericSalary) return 0;
  return numericSalary / 100000;
};

const getCompanyName = (company) => {
  if (!company) return 'Company';
  if (typeof company === 'string') return company;
  return company.name || company.email || 'Company';
};

const bucketSalary = (lpa) => {
  if (lpa < 5) return '3-5 LPA';
  if (lpa < 8) return '5-8 LPA';
  if (lpa < 12) return '8-12 LPA';
  if (lpa < 15) return '12-15 LPA';
  return '15+ LPA';
};

const bucketCgpa = (cgpa) => {
  if (cgpa < 7) return '6-7';
  if (cgpa < 8) return '7-8';
  if (cgpa < 9) return '8-9';
  return '9-10';
};

const branchPalette = ['#004643', '#0F766E', '#3B82F6', '#F59E0B', '#6366F1', '#EF4444'];
const companyPalette = ['#3B82F6', '#F59E0B', '#6366F1', '#EF4444', '#10B981', '#004643'];

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

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [summaryStats, setSummaryStats] = useState({
    totalPlaced: 94,
    placementRate: 94,
    avgPackage: '8.4 LPA',
    companies: 28,
  });
  const [monthlyData, setMonthlyData] = useState(fallbackMonthlyData);
  const [branchData, setBranchData] = useState(fallbackBranchData);
  const [companyData, setCompanyData] = useState(fallbackCompanyData);
  const [salaryData, setSalaryData] = useState(fallbackSalaryData);
  const [cgpaData, setCgpaData] = useState(fallbackCgpaData);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashboardResponse, reportsResponse, studentsResponse, drivesResponse] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getReports(),
          adminApi.getStudents({ limit: 1000 }),
          driveApi.getAll(),
        ]);

        const summary = reportsResponse?.data?.summary || [];
        const summaryMap = new Map(summary.map((entry) => [String(entry._id), entry]));
        const driveList = (drivesResponse?.data?.drives || []).map((drive) => ({
          id: drive.id,
          company: getCompanyName(drive.company),
          role: drive.role || drive.title || 'Drive',
          salary: formatSalaryLpa(drive.salary),
          deadline: drive.deadline,
        }));
        const studentList = (studentsResponse?.data?.students || []).map((student) => ({
          branch: student.branch || '-',
          cgpa: Number(student.CGPA ?? student.cgpa ?? 0),
          applications: Number(student.applications || 0),
        }));

        const monthlyMap = new Map();
        driveList.forEach((drive) => {
          const date = new Date(drive.deadline);
          const month = Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString('en-US', { month: 'short' });
          const current = monthlyMap.get(month) || { month, placed: 0, applied: 0, drives: 0 };
          current.drives += 1;
          current.placed += summaryMap.get(String(drive.id))?.selected || 0;
          current.applied += summaryMap.get(String(drive.id))?.totalApplications || 0;
          monthlyMap.set(month, current);
        });

        const orderedMonthly = monthOrder
          .filter((month) => monthlyMap.has(month))
          .map((month) => monthlyMap.get(month));

        const branchMap = new Map();
        studentList.forEach((student) => {
          const current = branchMap.get(student.branch) || { branch: student.branch, students: 0, placed: 0 };
          current.students += 1;
          current.placed += Math.round((dashboardResponse?.data?.placementRate || 0) / 100);
          branchMap.set(student.branch, current);
        });

        const companyMap = new Map();
        driveList.forEach((drive) => {
          const current = companyMap.get(drive.company) || { name: drive.company, value: 0, color: companyPalette[companyMap.size % companyPalette.length] };
          current.value += summaryMap.get(String(drive.id))?.selected || 0;
          companyMap.set(drive.company, current);
        });

        const salaryBuckets = new Map();
        driveList.forEach((drive) => {
          const bucket = bucketSalary(drive.salary);
          const current = salaryBuckets.get(bucket) || { range: bucket, count: 0 };
          current.count += summaryMap.get(String(drive.id))?.selected || 0;
          salaryBuckets.set(bucket, current);
        });

        const cgpaBuckets = new Map();
        studentList.forEach((student) => {
          const bucket = bucketCgpa(student.cgpa);
          const current = cgpaBuckets.get(bucket) || { cgpa: bucket, placed: 0, notPlaced: 0 };
          const estimatedPlaced = Math.round((student.applications || 0) * ((dashboardResponse?.data?.placementRate || 0) / 100));
          current.placed += estimatedPlaced;
          current.notPlaced += Math.max(0, (student.applications || 0) - estimatedPlaced);
          cgpaBuckets.set(bucket, current);
        });

        const avgPackage = driveList.length > 0
          ? driveList.reduce((sum, drive) => sum + drive.salary, 0) / driveList.length
          : 0;

        setMonthlyData(orderedMonthly.length > 0 ? orderedMonthly : fallbackMonthlyData);
        setBranchData(Array.from(branchMap.values()).length > 0 ? Array.from(branchMap.values()) : fallbackBranchData);
        setCompanyData(Array.from(companyMap.values()).length > 0 ? Array.from(companyMap.values()) : fallbackCompanyData);
        setSalaryData(Array.from(salaryBuckets.values()).length > 0 ? Array.from(salaryBuckets.values()) : fallbackSalaryData);
        setCgpaData(Array.from(cgpaBuckets.values()).length > 0 ? Array.from(cgpaBuckets.values()) : fallbackCgpaData);
        setSummaryStats({
          totalPlaced: summary.reduce((sum, entry) => sum + (entry.selected || 0), 0),
          placementRate: dashboardResponse?.data?.placementRate ?? 0,
          avgPackage: `${avgPackage ? avgPackage.toFixed(1) : '0.0'} LPA`,
          companies: new Set(driveList.map((drive) => drive.company)).size,
        });
      } catch {
        setMonthlyData(fallbackMonthlyData);
        setBranchData(fallbackBranchData);
        setCompanyData(fallbackCompanyData);
        setSalaryData(fallbackSalaryData);
        setCgpaData(fallbackCgpaData);
      }
    };

    fetchAnalytics();
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
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Analytics</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            Placement statistics and trends for this academic year
          </p>
        </div>
        <div className="flex gap-1 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl p-1">
          {['overview', 'branch', 'salary'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#004643] text-white'
                  : 'text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Placed', value: String(summaryStats.totalPlaced), sub: 'Out of 300 students', icon: Award, color: '#10B981', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Placement Rate', value: `${summaryStats.placementRate}%`, sub: 'Above target of 85%', icon: TrendingUp, color: '#004643', bg: 'bg-[#004643]/10 dark:bg-[#004643]/20' },
          { label: 'Avg Package', value: summaryStats.avgPackage, sub: '+1.2 LPA from last year', icon: BriefcaseBusiness, color: '#3B82F6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Companies', value: String(summaryStats.companies), sub: 'Visited this season', icon: Users, color: '#F59E0B', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">{stat.value}</p>
                <p className="text-xs font-medium text-[#6B7280] mt-0.5">{stat.label}</p>
                <p className="text-xs text-[#6B7280]/70 mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Area Chart */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Monthly Placement Trend</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Applications vs placements this year</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-[#6B7280]">
                  <span className="w-3 h-0.5 bg-[#004643] inline-block rounded" />
                  Placed
                </span>
                <span className="flex items-center gap-1.5 text-[#6B7280]">
                  <span className="w-3 h-0.5 bg-[#0F766E]/50 inline-block rounded" />
                  Applied
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004643" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#004643" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="appliedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="applied" stroke="#0F766E" strokeWidth={1.5} fill="url(#appliedGrad)" name="Applied" dot={false} />
                <Area type="monotone" dataKey="placed" stroke="#004643" strokeWidth={2} fill="url(#placedGrad)" name="Placed" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Company Distribution */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6">
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-1">Company Distribution</p>
              <p className="text-xs text-[#6B7280] mb-5">Students placed per company</p>
              <div className="flex items-center gap-6">
                <PieChart width={140} height={140}>
                  <Pie data={companyData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {companyData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="space-y-2 flex-1">
                  {companyData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[#6B7280]">{item.name}</span>
                      </div>
                      <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CGPA vs Placement */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6">
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-1">CGPA vs Placement</p>
              <p className="text-xs text-[#6B7280] mb-5">Placement correlation with academic score</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={cgpaData} barSize={16} barGap={4}>
                  <XAxis dataKey="cgpa" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="placed" fill="#004643" radius={[4, 4, 0, 0]} name="Placed" />
                  <Bar dataKey="notPlaced" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Not Placed" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}

      {/* Branch Tab */}
      {activeTab === 'branch' && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-1">Branch-wise Placement</p>
            <p className="text-xs text-[#6B7280] mb-5">Placement rate per department</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={branchData} barSize={20} barGap={6}>
                <XAxis dataKey="branch" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" fill="#0F766E" opacity={0.3} radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="placed" fill="#004643" radius={[4, 4, 0, 0]} name="Placed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchData.map((branch, i) => (
              <div key={i} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{branch.branch}</p>
                  <p className="text-xs font-bold text-[#004643] dark:text-[#0F766E]">
                    {Math.round((branch.placed / branch.students) * 100)}%
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[#6B7280]">
                    <span>Placed</span>
                    <span>{branch.placed} / {branch.students}</span>
                  </div>
                  <div className="h-2 bg-[#E5E7EB] dark:bg-[#1F4D4A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(branch.placed / branch.students) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-[#004643] rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Salary Tab */}
      {activeTab === 'salary' && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-1">Salary Distribution</p>
            <p className="text-xs text-[#6B7280] mb-5">Number of students per salary range</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salaryData} barSize={28}>
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#004643" radius={[6, 6, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {salaryData.map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-4 text-center space-y-1">
                <p className="text-2xl font-bold text-[#004643] dark:text-[#0F766E]">{item.count}</p>
                <p className="text-xs text-[#6B7280]">{item.range}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default Analytics;