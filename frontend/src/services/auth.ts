import api from './api';

export const login = async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const register = async (data: any) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};
