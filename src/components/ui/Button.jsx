'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

// Simple className utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'outline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95 select-none touch-manipulation
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg
      hover:from-blue-700 hover:to-purple-700 hover:shadow-xl
      focus:ring-blue-500 dark:focus:ring-blue-400
      disabled:from-gray-400 disabled:to-gray-500
    `,
    outline: `
      bg-transparent border-2 border-gray-300 dark:border-gray-600 
      text-gray-700 dark:text-gray-300 shadow-sm
      hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400
      focus:ring-gray-500 dark:focus:ring-gray-400
      disabled:border-gray-200 disabled:text-gray-400
    `,
    ghost: `
      bg-transparent text-gray-700 dark:text-gray-300
      hover:bg-gray-100 dark:hover:bg-gray-700
      focus:ring-gray-500 dark:focus:ring-gray-400
      disabled:text-gray-400
    `,
    danger: `
      bg-red-600 text-white shadow-lg
      hover:bg-red-700 hover:shadow-xl
      focus:ring-red-500 dark:focus:ring-red-400
      disabled:bg-red-400
    `,
    success: `
      bg-green-600 text-white shadow-lg
      hover:bg-green-700 hover:shadow-xl
      focus:ring-green-500 dark:focus:ring-green-400
      disabled:bg-green-400
    `
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs min-h-[32px]',
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]', // Better touch target for mobile
    lg: 'px-6 py-3 text-lg min-h-[48px]',
    xl: 'px-8 py-4 text-xl min-h-[56px]'
  };

  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabledStyles,
        className
      )}
      {...props}
    >
      {isLoading && (
        <FaSpinner className="animate-spin mr-2 flex-shrink-0" />
      )}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
    </motion.button>
  );
};