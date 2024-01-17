import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost/React-TS-DB_Proiect/server',
});

// Добавляем интерцептор запроса
instance.interceptors.request.use((config) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    // Обработка ошибки запроса
    console.error('Request error:', error);
    return Promise.reject(error);
});

export default instance;
