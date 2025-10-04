import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfo } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onDismiss, onMarkAsRead }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'success': return <FaCheck className="text-green-500" />;
            case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
            case 'error': return <FaExclamationTriangle className="text-red-500" />;
            default: return <FaInfo className="text-blue-500" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`p-4 border-l-4 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg ${notification.read ? 'opacity-75' : ''
                } ${notification.type === 'success' ? 'border-green-500' :
                    notification.type === 'warning' ? 'border-yellow-500' :
                        notification.type === 'error' ? 'border-red-500' :
                            'border-blue-500'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                        {getIcon()}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!notification.read && (
                        <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Mark as read"
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onDismiss(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Dismiss"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const NotificationCenter = ({ notifications = [], onDismiss, onMarkAsRead, onClearAll }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <FaBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50"
                    >
                        <div className="p-4 border-b dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Notifications
                                </h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={onClearAll}
                                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <FaBell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                <div className="space-y-2 p-2">
                                    {notifications.map(notification => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onDismiss={onDismiss}
                                            onMarkAsRead={onMarkAsRead}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};