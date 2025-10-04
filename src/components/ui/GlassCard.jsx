'use client';

import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  blur = 'md',
  ...props 
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const baseClasses = `
    relative overflow-hidden rounded-2xl
    bg-white/10 dark:bg-white/5
    border border-white/20 dark:border-white/10
    shadow-xl shadow-black/10
    ${blurClasses[blur]}
  `;

  const hoverClasses = hover ? `
    hover:bg-white/20 dark:hover:bg-white/10
    hover:border-white/30 dark:hover:border-white/20
    hover:shadow-2xl hover:shadow-black/20
    transition-all duration-300
  ` : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5 } : {}}
      {...props}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;