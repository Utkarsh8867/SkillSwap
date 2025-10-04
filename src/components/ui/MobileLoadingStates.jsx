'use client';

import { motion } from 'framer-motion';

export const SkeletonCard = () => (
    <div className="card animate-pulse">
        <div className="content-padding">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
            <div className="flex space-x-2 mt-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14"></div>
            </div>
        </div>
    </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} />
        ))}
    </div>
);

export const MobileSpinner = ({ size = 'md', message = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className={`${sizeClasses[size]} border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full`}
            />
            {message && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    {message}
                </p>
            )}
        </div>
    );
};

export const PullToRefresh = ({ onRefresh, isRefreshing, children }) => {
    return (
        <div className="relative">
            {isRefreshing && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 py-4">
                    <MobileSpinner size="sm" message="Refreshing..." />
                </div>
            )}
            <div className={isRefreshing ? 'pt-16' : ''}>
                {children}
            </div>
        </div>
    );
};

export const EmptyState = ({
    icon = '📭',
    title = 'Nothing here yet',
    description = 'Check back later for updates',
    action = null
}) => (
    <div className="text-center py-12 sm:py-16">
        <div className="text-6xl sm:text-8xl mb-4">{icon}</div>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {description}
        </p>
        {action && (
            <div className="flex justify-center">
                {action}
            </div>
        )}
    </div>
);