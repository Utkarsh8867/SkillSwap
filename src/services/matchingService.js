import api from './api';

export const getAIMatches = (userId) => {
    return api.get(`/matching/${userId}`);
};

export const getMatchScore = (userId, postId) => {
    return api.get(`/matching/${userId}/${postId}`);
};