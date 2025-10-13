'use client';

import { motion } from 'framer-motion';
import { FaUsers, FaExchangeAlt, FaLightbulb, FaHeart } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
  >
    <div className="flex justify-center items-center mb-4 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <div className="container-responsive section-padding">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">About SkillSwap</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          SkillSwap is a community-driven platform where talented individuals connect, 
          collaborate, and grow together by exchanging their unique skills and expertise.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <FeatureCard
          icon={<FaUsers size={32} />}
          title="Community First"
          description="Built by creators, for creators. We believe in the power of community collaboration."
          delay={0.2}
        />
        <FeatureCard
          icon={<FaExchangeAlt size={32} />}
          title="Skill Exchange"
          description="Trade your expertise for the skills you need. No money required, just passion."
          delay={0.4}
        />
        <FeatureCard
          icon={<FaLightbulb size={32} />}
          title="Learn & Grow"
          description="Expand your skillset while helping others achieve their goals."
          delay={0.6}
        />
        <FeatureCard
          icon={<FaHeart size={32} />}
          title="Made with Love"
          description="Crafted with care to provide the best experience for our community."
          delay={0.8}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          To create a world where knowledge flows freely, where every person can both teach and learn, 
          and where collaboration drives innovation. We believe that everyone has something valuable to offer, 
          and everyone has something new to learn.
        </p>
      </motion.div>
    </div>
  );
}