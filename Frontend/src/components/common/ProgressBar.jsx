// src/components/common/ProgressBar.jsx

import { motion } from 'framer-motion';

const ProgressBar = ({
  value = 0,
  max = 100,
  label = '',
  showValue = true,
  color = '#004643',
  height = 'h-2',
  animate = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#E6F4F1]/60">{label}</p>
          )}
          {showValue && (
            <p className="text-xs font-bold text-[#111827] dark:text-[#E6F4F1]">
              {Math.round(percentage)}%
            </p>
          )}
        </div>
      )}
      <div className={`w-full ${height} bg-[#E5E7EB] dark:bg-[#1F4D4A] rounded-full overflow-hidden`}>
        <motion.div
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;