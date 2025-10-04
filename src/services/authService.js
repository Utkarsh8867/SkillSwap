import api from './api';

export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const getMyProfile = () => {
  return api.get('/auth/me');
};

export const refreshToken = () => {
  return api.post('/auth/refresh');
};