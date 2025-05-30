import type { UserProfile, UserPreferences } from '@/stores/profileStore'

// Simulated database
let userProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/api/placeholder/150/150',
  role: 'Student',
  joinDate: 'January 2024'
}

let userPreferences: UserPreferences = {
  notifications: true,
  darkMode: false,
  language: 'English'
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const profileApi = {
  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    await delay(300)
    return { ...userProfile }
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    await delay(500)
    userProfile = { ...userProfile, ...updates }
    return { ...userProfile }
  },

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences> {
    await delay(300)
    return { ...userPreferences }
  },

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    await delay(500)
    userPreferences = { ...userPreferences, ...updates }
    return { ...userPreferences }
  },

  // Authentication
  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    await delay(800)
    // In a real app, we would validate the current password here
    return true
  },

  async signOut(): Promise<boolean> {
    await delay(300)
    // In a real app, we would clear the auth token here
    return true
  }
}

export default profileApi