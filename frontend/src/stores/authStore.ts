import { defineStore } from 'pinia';
import authService from '@/services/authService'

import type { User, LoginCredentials, RegisterPayload } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),
  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const response = await authService.login(credentials);
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', response.token);
        return { success: true };
      } catch (error: any) {
        console.error('Login failed:', error);
        this.logout();
        return { 
          success: false, 
          message: error.response?.data?.message || 'Invalid email or password. Please try again.'
        };
      }
    },
    async register(userData: RegisterPayload) {
      try {
        const backendPayload = {
          full_name: userData.fullName,
          email: userData.email,
          password: userData.password,
          is_class_president: userData.role === 'class-president',
        };
        const response = await authService.register(backendPayload);
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', response.token);
        return { success: true };
      } catch (error: any) {
        console.error('Registration failed:', error);
        this.logout();
        return { 
          success: false, 
          message: error.response?.data?.message || 'Registration failed. Please try again.'
        };
      }
    },
    async logout() {
      try {
        // Call the backend logout endpoint
        await authService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always clear local state even if the backend call fails
        this.isAuthenticated = false;
        this.user = null;
        this.token = null;
        localStorage.removeItem('authToken');
      }
    },
    async initializeAuth() {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        this.token = storedToken;
        this.isAuthenticated = true;
      }
    },
  },
});
