// src/components/common/Card.jsx

import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick = null,
  padding = 'p-6',
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: '0 12px 32px rgba(0,70,67,0.12)' } : {}}
      transition={{ duration: 0.3 }}
      className={`
        bg-white dark:bg-[#143C3A]
        border border-[#E5E7EB] dark:border-[#1F4D4A]
        rounded-xl shadow-sm
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;