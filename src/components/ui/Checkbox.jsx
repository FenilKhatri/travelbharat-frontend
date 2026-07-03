import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkbox = ({ checked, onChange, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 rounded',
    md: 'w-5 h-5 rounded-md',
    lg: 'w-6 h-6 rounded-md'
  };

  const iconSizes = {
    sm: '10',
    md: '14',
    lg: '16'
  };

  return (
    <label 
      className={`relative inline-flex items-center justify-center cursor-pointer align-middle ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <input 
        type="checkbox"
        className="sr-only"
        checked={checked || false} 
        onChange={onChange}
      />
      <div 
        className={`${sizeClasses[size] || sizeClasses.md} border-2 flex items-center justify-center transition-all duration-200 ease-in-out
          ${checked 
            ? 'bg-[#E85D04] border-[#E85D04] shadow-sm' 
            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-[#E85D04] dark:hover:border-[#E85D04]'
          }
        `}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              width={iconSizes[size] || '14'}
              height={iconSizes[size] || '14'}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    </label>
  );
};

export default Checkbox;
