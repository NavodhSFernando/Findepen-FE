import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router'; 
import { getToken } from './getToken';

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
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error retrieving token', error);
      router.push('/login'); // Redirect in case of error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
