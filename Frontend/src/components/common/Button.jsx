// src/components/common/Button.jsx

import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-[#004643] text-white hover:bg-[#036b64] shadow-sm hover:shadow-md',
  secondary: 'bg-white text-[#004643] border border-[#004643] hover:bg-[#004643] hover:text-white',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-[#004643] hover:bg-[#004643]/10',
  accent: 'bg-[#0F766E] text-white hover:bg-[#004643]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
  icon: Icon = null,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#004643]/40
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
};

export default Button;