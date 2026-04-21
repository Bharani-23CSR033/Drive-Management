// src/pages/admin/StudentList.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, ChevronDown,
  Mail, Phone, Eye, MoreHorizontal,
  CheckCircle, XCircle, Clock,
} from 'lucide-react';
import Modal from '../../components/common/Modal';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const students = [
  { id: 1, name: 'Arjun Sharma', email: 'arjun@vit.ac.in', phone: '+91 98765 11111', college: 'VIT Chennai', branch: 'CSE', cgpa: 8.5, year: '4th', status: 'Placed', company: 'Google', applications: 8 },
  { id: 2, name: 'Priya Menon', email: 'priya@psgtech.edu', phone: '+91 98765 22222', college: 'PSG Tech', branch: 'IT', cgpa: 7.8, year: '4th', status: 'Shortlisted', company: 'Amazon', applications: 5 },
  { id: 3, name: 'Rahul Nair', email: 'rahul@kongu.edu', phone: '+91 98765 33333', college: 'Kongu Engg', branch: 'CSE', cgpa: 7.2, year: '4th', status: 'Applied', company: 'Zoho', applications: 12 },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@srm.edu.in', phone: '+91 98765 44444', college: 'SRM Univ', branch: 'ECE', cgpa: 8.1, year: '4th', status: 'Placed', company: 'TCS', applications: 6 },
  { id: 5, name: 'Karthik Raja', email: 'karthik@anna.edu', phone: '+91 98765 55555', college: 'Anna Univ', branch: 'CSE', cgpa: 6.8, year: '4th', status: 'Applied', company: '-', applications: 3 },
  { id: 6, name: 'Divya Lakshmi', email: 'divya@sastra.edu', phone: '+91 98765 66666', college: 'SASTRA Univ', branch: 'IT', cgpa: 9.1, year: '4th', status: 'Shortlisted', company: 'Microsoft', applications: 4 },
  { id: 7, name: 'Arun Kumar', email: 'arun@nit.edu', phone: '+91 98765 77777', college: 'NIT Trichy', branch: 'CSE', cgpa: 8.8, year: '4th', status: 'Placed', company: 'Razorpay', applications: 7 },
  { id: 8, name: 'Meena Iyer', email: 'meena@ceg.edu', phone: '+91 98765 88888', college: 'CEG Anna Univ', branch: 'IT', cgpa: 7.5, year: '4th', status: 'Applied', company: '-', applications: 9 },
];

const statusStyle = {
  Placed: { text: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle },
  Shortlisted: { text: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock },
  Applied: { text: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: Clock },
  Rejected: { text: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
};

const StudentList = () => {
  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selected, setSelected] = useState([]);

  const colleges = ['All', ...new Set(students.map((s) => s.college))];
  const statuses = ['All', 'Placed', 'Shortlisted', 'Applied'];

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchCollege = collegeFilter === 'All' || s.college === collegeFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchCollege && matchStatus;
  });

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s.id));
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
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Student List</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            {students.length} students · {students.filter((s) => s.status === 'Placed').length} placed
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <span className="text-xs bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] px-3 py-1.5 rounded-lg font-medium">
              {selected.length} selected
            </span>
          )}
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643] transition-all">
            <Download size={14} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-2.5 focus-within:border-[#004643] focus-within:ring-2 focus-within:ring-[#004643]/15 transition-all">
          <Search size={14} className="text-[#6B7280] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none"
          />
        </div>

        {[
          { value: collegeFilter, setter: setCollegeFilter, options: colleges, label: 'College' },
          { value: statusFilter, setter: setStatusFilter, options: statuses, label: 'Status' },
        ].map((filter) => (
          <div key={filter.label} className="relative">
            <select
              value={filter.value}
              onChange={(e) => filter.setter(e.target.value)}
              className="appearance-none bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-2.5 pr-8 text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] transition-all cursor-pointer"
            >
              {filter.options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
          </div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-7 items-center px-6 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
          <div className="flex items-center gap-3 col-span-2">
            <input
              type="checkbox"
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={selectAll}
              className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
            />
            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Student</p>
          </div>
          {['College', 'CGPA', 'Applications', 'Status', 'Actions'].map((h) => (
            <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <AnimatePresence>
          {filtered.map((student, i) => {
            const StatusIcon = statusStyle[student.status]?.icon || Clock;
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-7 items-center px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
              >
                {/* Name */}
                <div className="col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(student.id)}
                    onChange={() => toggleSelect(student.id)}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
                  />
                  <div className="w-8 h-8 bg-[#004643] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{student.name}</p>
                    <p className="text-xs text-[#6B7280]">{student.branch}</p>
                  </div>
                </div>

                <p className="text-xs text-[#6B7280] truncate pr-2">{student.college}</p>

                <div>
                  <p className="text-sm font-bold text-[#111827] dark:text-[#E6F4F1]">{student.cgpa}</p>
                  <div className="w-12 h-1 bg-[#E5E7EB] dark:bg-[#1F4D4A] rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-[#004643] rounded-full"
                      style={{ width: `${(student.cgpa / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{student.applications}</p>

                <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[student.status]?.text}`}>
                  <StatusIcon size={10} />
                  {student.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
                  >
                    <Eye size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all">
                    <Mail size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Student Detail Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Details"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#004643] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <p className="text-base font-bold text-[#111827] dark:text-[#E6F4F1]">{selectedStudent.name}</p>
                <p className="text-sm text-[#6B7280]">{selectedStudent.branch} · {selectedStudent.year} Year</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusStyle[selectedStudent.status]?.text}`}>
                  {selectedStudent.status}
                  {selectedStudent.company !== '-' && ` · ${selectedStudent.company}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: selectedStudent.email, icon: Mail },
                { label: 'Phone', value: selectedStudent.phone, icon: Phone },
                { label: 'College', value: selectedStudent.college, icon: null },
                { label: 'CGPA', value: selectedStudent.cgpa, icon: null },
                { label: 'Applications', value: selectedStudent.applications, icon: null },
                { label: 'Company', value: selectedStudent.company, icon: null },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                  <p className="text-xs text-[#6B7280]">{item.label}</p>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

    </motion.div>
  );
};

export default StudentList;