import api from './api';

export const getNotifications = (page = 1, limit = 20) => {
    return api.get('/notifications', { params: { page, limit } });
};

export const markNotificationAsRead = (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = () => {
    return api.put('/notifications/read-all');
};

export const deleteNotification = (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
};

export const clearAllNotifications = () => {
    return api.delete('/notifications/clear-all');
};

export const getUnreadCount = () => {
    return api.get('/notifications/unread-count');
};

export const createNotification = (notificationData) => {
    return api.post('/notifications', notificationData);
};