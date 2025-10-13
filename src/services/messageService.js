import api from './api';

export const getConversations = () => {
    return api.get('/messages/conversations');
};

export const getMessages = (conversationId, page = 1, limit = 50) => {
    return api.get(`/messages/${conversationId}`, {
        params: { page, limit }
    });
};

export const sendMessage = (conversationId, messageData) => {
    return api.post(`/messages/${conversationId}`, messageData);
};

export const createConversation = (participantId) => {
    return api.post('/messages/conversations', { participantId });
};

export const markAsRead = (conversationId) => {
    return api.put(`/messages/${conversationId}/read`);
};

export const deleteMessage = (messageId) => {
    return api.delete(`/messages/message/${messageId}`);
};

export const searchMessages = (query) => {
    return api.get('/messages/search', { params: { q: query } });
};

export const contactForExchange = (postId, message) => {
    return api.post('/messages/contact-for-exchange', {
        postId,
        message
    });
};