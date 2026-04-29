// src/components/student/DriveCard.jsx

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';

const DriveCard = ({ drive }) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,70,67,0.1)' }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-4 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 ${drive.color || 'bg-[#004643]'} rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
            {drive.abbr || drive.company?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
            <p className="text-xs text-[#6B7280]">{drive.role}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          drive.type === 'Internship'
            ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
            : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
        }`}>
          {drive.type}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-[#6B7280]">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {drive.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          <span className={drive.daysLeft <= 3 ? 'text-red-500 font-semibold' : ''}>
            {drive.daysLeft}d left
          </span>
        </span>
        <span className="text-[#004643] dark:text-[#0F766E] font-bold">
          {drive.salary}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {drive.skills?.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-md text-xs text-[#6B7280]"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] dark:border-[#1F4D4A]">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${drive.eligible ? 'bg-emerald-500' : 'bg-red-400'}`} />
          <span className={`text-xs font-medium ${drive.eligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {drive.eligible ? 'Eligible' : 'Not eligible'}
          </span>
        </div>
        <Link
          to={`/student/drives/${drive.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-[#004643] dark:text-[#0F766E] hover:underline group-hover:gap-2 transition-all"
        >
          View Details
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
};

export default DriveCard;