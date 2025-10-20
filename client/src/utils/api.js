import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== REGISTRATION API ====================

export const registerStep1 = async (userData) => {
  const response = await api.post('/auth/register/step1', userData);
  return response.data;
};

export const registerStep2 = async (otpData) => {
  const response = await api.post('/auth/register/step2', otpData);
  return response.data;
};

export const registerStep3 = async (walletData) => {
  const response = await api.post('/auth/register/step3', walletData);
  return response.data;
};

export const resendOTP = async (userId) => {
  const response = await api.post('/auth/resend-otp', { userId });
  return response.data;
};

// ==================== LOGIN API ====================

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const verifyWallet = async (walletData) => {
  const response = await api.post('/auth/verify-wallet', walletData);
  return response.data;
};

// ==================== USER API ====================

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default api;
