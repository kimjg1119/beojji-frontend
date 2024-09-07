import axios from 'axios';
import { API_BASE_URL } from '../config';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.data.message) {
        case 'TOKEN_EXPIRED':
          // Token has expired, log out the user
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 'TOKEN_INVALID':
          // Invalid token, but don't log out
          console.error('Invalid token');
          // You might want to handle this case (e.g., redirect to login or refresh token)
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;