import api from './api';

export const getAllUsers = () => {
    return api.get('/users');
};

export const createUser = (userData) => {
    return api.post('/users', userData);
};

export const getNearbyUsers = (lat, lng, radius = 10) => {
    return api.get(`/users/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
};

export const getUserById = (userId) => {
    return api.get(`/users/${userId}`);
};

export const updateUserProfile = (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
};

export const searchUsers = (searchQuery, page = 1, limit = 10) => {
    return api.get('/users/search', {
        params: { search: searchQuery, page, limit }
    });
};

export const getUserPosts = (userId) => {
    return api.get(`/users/${userId}/posts`);
};

export const followUser = (userId) => {
    return api.post(`/users/${userId}/follow`);
};

export const unfollowUser = (userId) => {
    return api.delete(`/users/${userId}/follow`);
};

export const getFollowers = (userId) => {
    return api.get(`/users/${userId}/followers`);
};

export const getFollowing = (userId) => {
    return api.get(`/users/${userId}/following`);
};

export const getUserBookmarks = (userId, params = {}) => {
    return api.get(`/users/${userId}/bookmarks`, { params });
};