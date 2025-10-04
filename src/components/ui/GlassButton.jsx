'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const GlassButton = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = `
    relative overflow-hidden rounded-xl font-medium transition-all duration-300
    backdrop-blur-md border border-white/20 shadow-lg
    hover:shadow-xl hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-primary-500/80 to-primary-600/80 
      hover:from-primary-600/90 hover:to-primary-700/90
      text-white focus:ring-primary-500
    `,
    secondary: `
      bg-gradient-to-r from-secondary-500/80 to-secondary-600/80
      hover:from-secondary-600/90 hover:to-secondary-700/90
      text-white focus:ring-secondary-500
    `,
    accent: `
      bg-gradient-to-r from-accent-500/80 to-accent-600/80
      hover:from-accent-600/90 hover:to-accent-700/90
      text-white focus:ring-accent-500
    `,
    glass: `
      bg-white/10 hover:bg-white/20 
      text-gray-800 dark:text-white
      focus:ring-white/50
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

GlassButton.displayName = 'GlassButton';

export default GlassButton;