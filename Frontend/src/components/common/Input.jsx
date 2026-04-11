// src/components/common/Input.jsx

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  disabled = false,
  icon: Icon = null,
  className = '',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasValue = value && value.length > 0;
  const floatLabel = focused || hasValue;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`
          relative flex items-center
          border rounded-xl bg-white dark:bg-[#143C3A]
          transition-all duration-300
          ${focused
            ? 'border-[#004643] ring-2 ring-[#004643]/20'
            : error
            ? 'border-red-400 ring-2 ring-red-200'
            : 'border-[#E5E7EB] dark:border-[#1F4D4A]'
          }
        `}
      >
        {Icon && (
          <span className="pl-3 text-[#6B7280] dark:text-[#E6F4F1]/50">
            <Icon size={16} />
          </span>
        )}

        <div className="relative flex-1">
          {label && (
            <label
              className={`
                absolute left-3 pointer-events-none
                transition-all duration-200 origin-left
                ${floatLabel
                  ? 'top-1 text-[10px] text-[#004643] dark:text-[#0F766E] scale-90'
                  : 'top-1/2 -translate-y-1/2 text-sm text-[#6B7280]'
                }
              `}
            >
              {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
          )}

          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={floatLabel ? placeholder : ''}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              w-full px-3 bg-transparent
              text-sm text-[#111827] dark:text-[#E6F4F1]
              focus:outline-none disabled:opacity-50
              ${label ? 'pt-5 pb-2' : 'py-3'}
            `}
          />
        </div>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3 text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 pl-1 animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default Input;