import api from './api';

export const getUserReviews = (userId, params = {}) => {
    return api.get(`/reviews/user/${userId}`, { params });
};

export const createReview = (reviewData) => {
    return api.post('/reviews', reviewData);
};

export const updateReview = (reviewId, reviewData) => {
    return api.put(`/reviews/${reviewId}`, reviewData);
};

export const deleteReview = (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
};