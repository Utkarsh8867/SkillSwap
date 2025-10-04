'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaReact, FaPython, FaJs, FaHtml5, FaCss3, FaNodeJs, FaFigma, FaSketch } from 'react-icons/fa';
import { SiTailwindcss, SiNextdotjs, SiTypescript, SiGraphql, SiMongodb, SiPostgresql, SiDocker, SiKubernetes } from 'react-icons/si';

const skills = [
  { icon: <FaReact className="w-8 h-8" />, name: 'React', color: 'text-blue-400' },
  { icon: <FaPython className="w-8 h-8" />, name: 'Python', color: 'text-yellow-400' },
  { icon: <FaJs className="w-8 h-8" />, name: 'JavaScript', color: 'text-yellow-300' },
  { icon: <FaHtml5 className="w-8 h-8" />, name: 'HTML5', color: 'text-orange-500' },
  { icon: <FaCss3 className="w-8 h-8" />, name: 'CSS3', color: 'text-blue-500' },
  { icon: <FaNodeJs className="w-8 h-8" />, name: 'Node.js', color: 'text-green-500' },
  { icon: <FaFigma className="w-8 h-8" />, name: 'Figma', color: 'text-purple-500' },
  { icon: <SiTailwindcss className="w-8 h-8" />, name: 'Tailwind', color: 'text-cyan-400' },
  { icon: <SiNextdotjs className="w-8 h-8" />, name: 'Next.js', color: 'text-gray-900 dark:text-white' },
  { icon: <SiTypescript className="w-8 h-8" />, name: 'TypeScript', color: 'text-blue-600' },
  { icon: <SiGraphql className="w-8 h-8" />, name: 'GraphQL', color: 'text-pink-500' },
  { icon: <SiMongodb className="w-8 h-8" />, name: 'MongoDB', color: 'text-green-600' }
];

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          className={`absolute ${skill.color} opacity-20 hover:opacity-40 transition-opacity cursor-pointer`}
          style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut'
          }}
          whileHover={{ scale: 1.2 }}
        >
          {skill.icon}
          <span className="sr-only">{skill.name}</span>
        </motion.div>
      ))}
    </div>
  );
};