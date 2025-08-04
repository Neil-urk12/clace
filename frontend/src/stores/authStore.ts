import { defineStore } from 'pinia';
import authService from '@/services/authService'

import type { User, LoginCredentials, RegisterPayload } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  hasJoinedClass?: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
    token: null,
    hasJoinedClass: false,
  }),
  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const response = await authService.login(credentials);
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
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
        localStorage.setItem('userData', JSON.stringify(response.user));
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
        localStorage.removeItem('userData');
      }
    },
    async initializeAuth() {
      const storedToken = localStorage.getItem('authToken');
      const hasJoinedClass = localStorage.getItem('hasJoinedClass') === 'true';
      const storedUserData = localStorage.getItem('userData');
      
      if (storedToken) {
        this.token = storedToken;
        this.isAuthenticated = true;
        this.hasJoinedClass = hasJoinedClass;
        
        if (storedUserData) {
          try {
            this.user = JSON.parse(storedUserData);
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
            // If parsing fails, try to fetch user data from backend
            await this.fetchCurrentUser();
          }
        } else {
          // If no stored user data but token exists, fetch user data
          await this.fetchCurrentUser();
        }
      }
    },
    
    async fetchCurrentUser() {
      try {
        // Only attempt to fetch if we have a token and are authenticated
        if (this.token && this.isAuthenticated) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            this.user = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch current user:', error);
        // If fetching fails, we might need to log the user out
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },
    
    setHasJoinedClass(joined: boolean) {
      this.hasJoinedClass = joined;
      localStorage.setItem('hasJoinedClass', joined.toString());
    },
  },
});
