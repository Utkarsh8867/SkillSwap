'use client';

import { motion } from 'framer-motion';

export const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto mb-4"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
            </motion.div>
        </div>
    );
};

export const InlineLoader = ({ size = 'md', message }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex items-center justify-center space-x-3 py-4">
            <div className={`${sizeClasses[size]} border-2 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400`}></div>
            {message && (
                <span className="text-gray-600 dark:text-gray-400 text-sm">{message}</span>
            )}
        </div>
    );
};