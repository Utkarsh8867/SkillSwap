'use client';

import { motion } from 'framer-motion';
import { FaStar, FaFire, FaCrown, FaGem } from 'react-icons/fa';

const SkillBadge = ({ 
  skill, 
  level = 'beginner', 
  rating = 0, 
  className = '',
  interactive = true,
  showRating = true,
  size = 'md'
}) => {
  const levels = {
    beginner: {
      color: 'from-green-400 to-green-600',
      icon: FaStar,
      text: 'Beginner'
    },
    intermediate: {
      color: 'from-blue-400 to-blue-600',
      icon: FaFire,
      text: 'Intermediate'
    },
    advanced: {
      color: 'from-purple-400 to-purple-600',
      icon: FaCrown,
      text: 'Advanced'
    },
    expert: {
      color: 'from-yellow-400 to-yellow-600',
      icon: FaGem,
      text: 'Expert'
    }
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const levelData = levels[level];
  const IconComponent = levelData.icon;

  return (
    <motion.div
      className={`
        inline-flex items-center gap-2 rounded-full
        bg-gradient-to-r ${levelData.color}
        text-white font-medium shadow-lg
        backdrop-blur-sm border border-white/20
        ${sizes[size]} ${className}
        ${interactive ? 'hover:scale-105 cursor-pointer' : ''}
      `}
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <IconComponent className="w-3 h-3" />
      <span>{skill}</span>
      
      {showRating && rating > 0 && (
        <div className="flex items-center gap-1 ml-1">
          <FaStar className="w-3 h-3 text-yellow-300" />
          <span className="text-xs">{rating.toFixed(1)}</span>
        </div>
      )}
    </motion.div>
  );
};

export default SkillBadge;