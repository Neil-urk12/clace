import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; 

import type { LoginCredentials, RegisterPayloadBackend } from '@/types/auth';

const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  async register(userData: RegisterPayloadBackend) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await axios.post(`${API_URL}/logout`, { token }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      }
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if the server request fails, we should still clear local auth data
      return { success: true };
    }
  },
};

export default authService;
