'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaTimes, FaTrash, FaFilter } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import {
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    markAllAsRead,
    clearAllNotifications
} from '@/services/notificationService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'message': return '💬';
            case 'follow': return '👥';
            case 'post_like': return '❤️';
            case 'post_comment': return '💭';
            case 'skill_match': return '🎯';
            case 'review': return '⭐';
            default: return '🔔';
        }
    };

    const getActionText = () => {
        switch (notification.type) {
            case 'message': return 'sent you a message';
            case 'follow': return 'started following you';
            case 'post_like': return 'liked your post';
            case 'post_comment': return 'commented on your post';
            case 'skill_match': return 'matches your skills';
            case 'review': return 'left you a review';
            default: return notification.message;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`p-4 border-b dark:border-gray-700 ${notification.isRead ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
                } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
        >
            <div className="flex items-start space-x-3">
                <div className="text-2xl">{getIcon()}</div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="font-medium">{notification.fromUser?.name}</span> {getActionText()}
                    </p>

                    {notification.data?.postTitle && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                            "{notification.data.postTitle}"
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                        <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Mark as read"
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        onClick={() => onDelete(notification.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const NotificationsPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true);
                const response = await getNotifications();
                // Handle different response structures
                const notificationsData = response.data?.notifications || response.data || [];
                setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
            } catch (error) {
                console.error('Failed to load notifications:', error);
                toast.error('Failed to load notifications');
                setNotifications([]); // Ensure it's always an array
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadNotifications();
        }
    }, [user]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(prev =>
                Array.isArray(prev) ? prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                ) : []
            );
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            setNotifications(prev => Array.isArray(prev) ? prev.filter(notif => notif.id !== notificationId) : []);
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setActionLoading(true);
            await markAllAsRead();
            setNotifications(prev =>
                Array.isArray(prev) ? prev.map(notif => ({ ...notif, isRead: true })) : []
            );
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Are you sure you want to delete all notifications?')) {
            return;
        }

        try {
            setActionLoading(true);
            await clearAllNotifications();
            setNotifications([]);
            toast.success('All notifications cleared');
        } catch (error) {
            toast.error('Failed to clear notifications');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'read') return notif.isRead;
        return true;
    }) : [];

    const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <FaBell className="text-2xl text-primary-500" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Notifications
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <Button
                                    onClick={handleMarkAllAsRead}
                                    disabled={actionLoading}
                                    variant="outline"
                                    size="sm"
                                >
                                    <FaCheck className="w-4 h-4 mr-2" />
                                    Mark All Read
                                </Button>
                            )}

                            {notifications.length > 0 && (
                                <Button
                                    onClick={handleClearAll}
                                    disabled={actionLoading}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <FaTrash className="w-4 h-4 mr-2" />
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center space-x-4">
                        <FaFilter className="text-gray-400" />
                        <div className="flex space-x-2">
                            {['all', 'unread', 'read'].map(filterType => (
                                <button
                                    key={filterType}
                                    onClick={() => setFilter(filterType)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === filterType
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                                    {filterType === 'unread' && unreadCount > 0 && (
                                        <span className="ml-1 bg-white text-primary-500 px-1 rounded-full text-xs">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {filter === 'unread' ? 'No unread notifications' :
                                    filter === 'read' ? 'No read notifications' : 'No notifications'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {filter === 'all'
                                    ? "You're all caught up! New notifications will appear here."
                                    : `No ${filter} notifications to show.`
                                }
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredNotifications.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;