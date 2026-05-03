// src/pages/admin/StudentList.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, ChevronDown,
  Mail, Phone, Eye, MoreHorizontal,
  CheckCircle, XCircle, Clock,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import adminApi from '../../api/adminApi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const statusStyle = {
  Placed: { text: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle },
  Shortlisted: { text: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock },
  Applied: { text: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: Clock },
  Rejected: { text: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getStudents();
        setStudents(data.students || []);
        setError(null);
      } catch (err) {
        setError('Failed to load students');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const colleges = ['All', ...new Set(students.map((s) => s.college).filter(Boolean))];
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
    setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s._id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004643]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
            {students.length} students
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
                key={student._id}
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
                    checked={selected.includes(student._id)}
                    onChange={() => toggleSelect(student._id)}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
                  />
                  <div className="w-8 h-8 bg-[#004643] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{student.name}</p>
                    <p className="text-xs text-[#6B7280]">{student.branch || 'N/A'}</p>
                  </div>
                </div>

                <p className="text-xs text-[#6B7280] truncate pr-2">{student.college || 'N/A'}</p>

                <div>
                  <p className="text-sm font-bold text-[#111827] dark:text-[#E6F4F1]">{student.cgpa || student.CGPA || 'N/A'}</p>
                  <div className="w-12 h-1 bg-[#E5E7EB] dark:bg-[#1F4D4A] rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-[#004643] rounded-full"
                      style={{ width: `${((student.cgpa || student.CGPA || 0) / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{student.applicationCount || 0}</p>

                <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[student.status]?.text}`}>
                  <StatusIcon size={10} />
                  {student.status || 'Applied'}
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
                <p className="text-sm text-[#6B7280]">{selectedStudent.branch || 'N/A'} · {selectedStudent.college || 'N/A'}</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusStyle[selectedStudent.status]?.text}`}>
                  {selectedStudent.status || 'Applied'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: selectedStudent.email, icon: Mail },
                { label: 'Phone', value: selectedStudent.phone || 'N/A', icon: Phone },
                { label: 'College', value: selectedStudent.college || 'N/A', icon: null },
                { label: 'CGPA', value: selectedStudent.cgpa || selectedStudent.CGPA || 'N/A', icon: null },
                { label: 'Applications', value: selectedStudent.applicationCount || 0, icon: null },
                { label: 'Branch', value: selectedStudent.branch || 'N/A', icon: null },
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