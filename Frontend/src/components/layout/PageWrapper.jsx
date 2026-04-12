// src/components/layout/PageWrapper.jsx

import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const PageWrapper = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`min-h-screen bg-[#FAFAFA] dark:bg-[#0F2F2C] ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;