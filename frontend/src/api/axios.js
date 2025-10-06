import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

// Add token to all requests except public endpoints
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const publicEndpoints = ['/api/models/', '/api/auth/signup/', '/api/auth/login/'];
  
  // Skip adding token for public endpoints
  if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
    return config;
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;