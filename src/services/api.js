import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Function to test different ports if main port fails
const testPort = async (port) => {
  try {
    const response = await fetch(`http://localhost:${port}/health`);
    return response.ok;
  } catch (e) {
    return false;
  }
};

// Try to find the correct port
(async () => {
  if (!await testPort(5000) && await testPort(5001)) {
    API_URL = 'http://localhost:5001/api';
  }
})();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

export const authService = {
  signIn: async (credentials) => {
    try {
      const response = await api.post('/auth/signin', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred' };
    }
  },

  signUp: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred' };
    }
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  },
};

export default api;