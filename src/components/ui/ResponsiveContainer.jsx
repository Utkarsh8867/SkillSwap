'use client';

import { motion } from 'framer-motion';

export const ResponsiveContainer = ({
    children,
    className = '',
    maxWidth = 'max-w-7xl',
    padding = 'px-4 sm:px-6 lg:px-8',
    animate = false
}) => {
    const containerClasses = `
    ${maxWidth} mx-auto ${padding} w-full
    ${className}
  `;

    if (animate) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={containerClasses}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={containerClasses}>
            {children}
        </div>
    );
};

export const ResponsiveGrid = ({
    children,
    cols = { base: 1, sm: 2, lg: 3, xl: 4 },
    gap = 'gap-4 sm:gap-6',
    className = ''
}) => {
    const gridClasses = `
    grid 
    grid-cols-${cols.base} 
    sm:grid-cols-${cols.sm} 
    lg:grid-cols-${cols.lg} 
    xl:grid-cols-${cols.xl} 
    ${gap} 
    ${className}
  `;

    return (
        <div className={gridClasses}>
            {children}
        </div>
    );
};

export const ResponsiveStack = ({
    children,
    direction = { base: 'col', sm: 'row' },
    gap = 'gap-4',
    align = 'items-start',
    justify = 'justify-start',
    className = ''
}) => {
    const stackClasses = `
    flex 
    flex-${direction.base} 
    sm:flex-${direction.sm} 
    ${gap} 
    ${align} 
    ${justify} 
    ${className}
  `;

    return (
        <div className={stackClasses}>
            {children}
        </div>
    );
};