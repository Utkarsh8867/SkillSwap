import api from './api';

export const checkHealth = () => {
    return api.get('/health');
};