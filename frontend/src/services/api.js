import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createPaste = async (data) => {
    const response = await api.post('/pastes', data);
    return response.data;
};

export const getPaste = async (id) => {
    const response = await api.get(`/pastes/${id}`);
    return response.data;
};

export const healthCheck = async () => {
    const response = await api.get('/healthz');
    return response.data;
};

export default {
    createPaste,
    getPaste,
    healthCheck,
};
