import axios from 'axios';
import { router } from 'expo-router'; 
import { getToken } from './getToken';
import { clearAuthToken } from './tokenValidation';

const api = axios.create({
  baseURL: 'http://192.168.1.6:5141/api/', 
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken(); // Get token from SecureStore
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Don't redirect automatically - let components handle auth errors
    } catch (error) {
      console.error('Error retrieving token', error);
      // Don't redirect automatically - let components handle auth errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear the stored token on 401 errors
      await clearAuthToken();
      console.log("Token cleared due to 401 error - redirecting to login");
      
      // Redirect to login screen
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
