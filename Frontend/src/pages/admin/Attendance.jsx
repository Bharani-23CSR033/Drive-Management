// src/pages/admin/Attendance.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, CheckCircle, XCircle,
  Download, ChevronDown, Users,
  Check, X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const drives = [
  { id: 1, company: 'Google', role: 'SWE Intern', date: 'Apr 18, 2026', abbr: 'G', color: 'bg-blue-500' },
  { id: 2, company: 'Amazon', role: 'Backend Dev', date: 'Apr 19, 2026', abbr: 'A', color: 'bg-amber-500' },
  { id: 3, company: 'Zoho', role: 'Full Stack', date: 'Apr 20, 2026', abbr: 'Z', color: 'bg-red-500' },
];

const initialStudents = [
  { id: 1, name: 'Arjun Sharma', college: 'VIT Chennai', branch: 'CSE', present: true },
  { id: 2, name: 'Priya Menon', college: 'PSG Tech', branch: 'IT', present: true },
  { id: 3, name: 'Rahul Nair', college: 'Kongu Engg', branch: 'CSE', present: false },
  { id: 4, name: 'Sneha Reddy', college: 'SRM Univ', branch: 'ECE', present: true },
  { id: 5, name: 'Karthik Raja', college: 'Anna Univ', branch: 'CSE', present: false },
  { id: 6, name: 'Divya Lakshmi', college: 'SASTRA Univ', branch: 'IT', present: true },
  { id: 7, name: 'Arun Kumar', college: 'NIT Trichy', branch: 'CSE', present: true },
  { id: 8, name: 'Meena Iyer', college: 'CEG Anna Univ', branch: 'IT', present: false },
];

const Attendance = () => {
  const [selectedDrive, setSelectedDrive] = useState(drives[0]);
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.college.toLowerCase().includes(search.toLowerCase())
  );

  const present = students.filter((s) => s.present).length;
  const absent = students.length - present;
  const rate = Math.round((present / students.length) * 100);

  const toggleAttendance = (id) => {
    setStudents((prev) => prev.map((s) =>
      s.id === id ? { ...s, present: !s.present } : s
    ));
    setSaved(false);
  };

  const markAll = (value) => {
    setStudents((prev) => prev.map((s) => ({ ...s, present: value })));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Attendance saved successfully');
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
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Attendance</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            Mark and track student attendance for placement drives
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-all"
          >
            <Check size={13} />
            Mark All Present
          </button>
          <button
            onClick={() => markAll(false)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 transition-all"
          >
            <X size={13} />
            Mark All Absent
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-xs font-medium text-[#6B7280] hover:border-[#004643] transition-all">
            <Download size={13} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Drive Selector */}
      <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {drives.map((drive) => (
          <button
            key={drive.id}
            onClick={() => setSelectedDrive(drive)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border flex-shrink-0 transition-all ${
              selectedDrive.id === drive.id
                ? 'bg-[#004643] border-[#004643] text-white'
                : 'bg-white dark:bg-[#143C3A] border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280] hover:border-[#004643] dark:hover:text-[#E6F4F1]'
            }`}
          >
            <div className={`w-7 h-7 ${drive.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {drive.abbr}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold">{drive.company}</p>
              <p className="text-xs opacity-70">{drive.date}</p>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
        {[
          { label: 'Present', value: present, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30', icon: CheckCircle },
          { label: 'Absent', value: absent, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30', icon: XCircle },
          { label: 'Attendance Rate', value: `${rate}%`, color: 'text-[#004643] dark:text-[#0F766E]', bg: 'bg-[#004643]/8 dark:bg-[#004643]/20 border-[#004643]/20', icon: Users },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${stat.bg} border rounded-2xl p-5 flex items-center gap-4`}>
              <div className="flex-1">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{stat.label}</p>
              </div>
              <Icon size={28} className={`${stat.color} opacity-40`} />
            </div>
          );
        })}
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">

        {/* Table Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] sticky top-0 bg-white dark:bg-[#143C3A] z-10">
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">
              {selectedDrive.company} — {selectedDrive.role}
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5">{selectedDrive.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-3 py-2">
              <Search size={13} className="text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none w-32"
              />
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-5 px-6 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
          {['Student', 'College', 'Branch', 'Status', 'Toggle'].map((h) => (
            <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-5 items-center px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${student.present ? 'bg-[#004643]' : 'bg-gray-400'}`}>
                {student.name.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{student.name}</p>
            </div>

            <p className="text-xs text-[#6B7280]">{student.college}</p>
            <p className="text-xs text-[#6B7280]">{student.branch}</p>

            <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              student.present
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {student.present
                ? <><CheckCircle size={10} /> Present</>
                : <><XCircle size={10} /> Absent</>
              }
            </span>

            {/* Toggle Switch */}
            <button
              onClick={() => toggleAttendance(student.id)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${
                student.present ? 'bg-[#004643]' : 'bg-[#E5E7EB] dark:bg-[#1F4D4A]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                student.present ? 'left-6' : 'left-1'
              }`} />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-[#004643] text-white hover:bg-[#036b64]'
          }`}
        >
          {saved ? (
            <span className="flex items-center gap-2">
              <CheckCircle size={14} />
              Saved
            </span>
          ) : (
            'Save Attendance'
          )}
        </motion.button>
      </motion.div>

    </motion.div>
  );
};

export default Attendance;