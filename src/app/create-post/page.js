'use client';

import { PostForm } from '@/components/posts/PostForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { motion } from 'framer-motion';
import { FaPlusCircle } from 'react-icons/fa';

const CreatePostPage = () => {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-4 text-primary-500">
            <FaPlusCircle size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Create a New Skill Swap
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share your expertise with the community or find the skills you need to bring your projects to life.
          </p>
        </motion.div>
        
        <PostForm />
      </div>
    </ProtectedRoute>
  );
};

export default CreatePostPage;