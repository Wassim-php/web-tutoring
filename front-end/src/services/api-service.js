import axios from 'axios';
//Base URL for all API requests
const API_URL = 'http://localhost:3000';

//Configured Axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

//Request interceptor for API calls
//  Automatically adds authentication token to requests if available

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);