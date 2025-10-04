import api from './api';

export const updateUserSettings = (settings) => {
    return api.put('/users/settings', settings);
};

export const deleteAccount = () => {
    return api.delete('/users/account');
};

export const getUserSettings = () => {
    return api.get('/users/settings');
};