// src/components/student/ApplicationCard.jsx

import { motion } from 'framer-motion';
import { Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';

const statusVariant = {
  shortlisted: 'success',
  applied: 'info',
  rejected: 'danger',
  selected: 'success',
  pending: 'warning',
};

const ApplicationCard = ({ application }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#004643] rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {application.company?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] truncate">
            {application.company}
          </p>
          <p className="text-xs text-[#6B7280] truncate">{application.role}</p>
        </div>
        <Badge
          label={application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
          variant={statusVariant[application.status?.toLowerCase()] || 'neutral'}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <div className="flex items-center gap-1">
          <Clock size={11} />
          <span>Applied {application.date}</span>
        </div>
        <Link
          to={`/student/drives/${application.driveId}`}
          className="flex items-center gap-1 text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
        >
          View <ArrowUpRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
};

export default ApplicationCard;