import axios from 'axios'
import type { UserProfile } from '@/stores/profileStore'

const API_URL = 'http://localhost:3000/api/profile'

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const profileApi = {
  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeader()
      })
      
      if (response.data.success && response.data.profile) {
        return response.data.profile
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile')
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error)
      throw error.response?.data || error.message || error
    }
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await axios.patch(API_URL, updates, {
        headers: getAuthHeader()
      })
      
      if (response.data.success && response.data.profile) {
        return response.data.profile
      } else {
        throw new Error(response.data.message || 'Failed to update profile')
      }
    } catch (error: any) {
      console.error('Error updating user profile:', error)
      throw error.response?.data || error.message || error
    }
  },



  // Authentication
  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_URL}/password`, {
        currentPassword,
        newPassword
      }, {
        headers: getAuthHeader()
      })
      
      return response.data.success === true
    } catch (error: any) {
      console.error('Error updating password:', error)
      throw error.response?.data || error.message || error
    }
  },

  async signOut(): Promise<boolean> {
    try {
      // Use the existing auth service for logout
      const token = localStorage.getItem('authToken')
      if (token) {
        await axios.post('http://localhost:3000/api/auth/logout', { token }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      return true
    } catch (error: any) {
      console.error('Error signing out:', error)
      // Even if the server request fails, we should still return true
      // as the frontend will clear local auth data
      return true
    }
  }
}

export default profileApi