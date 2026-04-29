// src/components/company/ApplicantCard.jsx

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const statusConfig = {
  Applied: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
  Shortlisted: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  Selected: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
  Rejected: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
};

const ApplicantCard = ({ applicant, onView, onShortlist, onReject }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#004643] rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {applicant.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{applicant.name}</p>
            <p className="text-xs text-[#6B7280]">{applicant.college}</p>
            <p className="text-xs text-[#6B7280]">{applicant.branch} · CGPA {applicant.cgpa}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[applicant.status]}`}>
          {applicant.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {applicant.skills?.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-md text-xs text-[#6B7280]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-2 pt-1 border-t border-[#E5E7EB] dark:border-[#1F4D4A]">
        <button
          onClick={() => onView(applicant)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-xs font-medium text-[#6B7280] hover:border-[#004643] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-all"
        >
          <Eye size={12} />
          View
        </button>
        <button
          onClick={() => onShortlist(applicant.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 transition-all"
        >
          <CheckCircle size={12} />
          Shortlist
        </button>
        <button
          onClick={() => onReject(applicant.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 transition-all"
        >
          <XCircle size={12} />
          Reject
        </button>
      </div>
    </motion.div>
  );
};

export default ApplicantCard;