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

};

export default authService;
