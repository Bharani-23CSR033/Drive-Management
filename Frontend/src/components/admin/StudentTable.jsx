// src/components/admin/StudentTable.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Mail, CheckCircle, Clock, XCircle } from 'lucide-react';

const statusConfig = {
  Placed: { text: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle },
  Shortlisted: { text: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock },
  Applied: { text: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: Clock },
  Rejected: { text: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
};

const StudentTable = ({ students, selected, onSelect, onSelectAll, onView }) => {
  return (
    <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">
      <div className="grid grid-cols-7 items-center px-6 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
        <div className="flex items-center gap-3 col-span-2">
          <input
            type="checkbox"
            checked={selected.length === students.length && students.length > 0}
            onChange={onSelectAll}
            className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
          />
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Student</p>
        </div>
        {['College', 'CGPA', 'Applications', 'Status', 'Actions'].map((h) => (
          <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
        ))}
      </div>

      <AnimatePresence>
        {students.map((student, i) => {
          const StatusIcon = statusConfig[student.status]?.icon || Clock;
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-7 items-center px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
            >
              <div className="col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(student.id)}
                  onChange={() => onSelect(student.id)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
                />
                <div className="w-8 h-8 bg-[#004643] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {student.name?.charAt(0)}
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

              <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[student.status]?.text}`}>
                <StatusIcon size={10} />
                {student.status}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView(student)}
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
    </div>
  );
};

export default StudentTable;