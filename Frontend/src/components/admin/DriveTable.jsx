// src/components/admin/DriveTable.jsx

import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Users, Clock, MoreHorizontal } from 'lucide-react';

const DriveTable = ({ drives, onEdit, onDelete, onMenuToggle, openMenu }) => {
  return (
    <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">
      <div className="grid grid-cols-6 px-6 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
        {['Company', 'Role', 'Applicants', 'Deadline', 'Status', 'Actions'].map((h) => (
          <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
        ))}
      </div>

      <AnimatePresence>
        {drives.map((drive, i) => (
          <motion.div
            key={drive.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-6 items-center px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${drive.color || 'bg-[#004643]'} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {drive.abbr || drive.company?.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
            </div>

            <div>
              <p className="text-sm text-[#111827] dark:text-[#E6F4F1]">{drive.role}</p>
              <p className="text-xs text-[#6B7280]">{drive.type}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-[#6B7280]" />
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.applicants}</p>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#6B7280]" />
              <p className="text-sm text-[#111827] dark:text-[#E6F4F1]">{drive.deadline}</p>
            </div>

            <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              drive.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${drive.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {drive.status}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(drive)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => onDelete(drive)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DriveTable;