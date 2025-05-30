import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface UserProfile {
  name: string
  email: string
  avatar: string
  role: string
  joinDate: string
}

export interface UserPreferences {
  notifications: boolean
  darkMode: boolean
  language: string
}

export const useProfileStore = defineStore('profile', () => {
  // State
  const user = ref<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/api/placeholder/150/150',
    role: 'Student',
    joinDate: 'January 2024'
  })

  const preferences = ref<UserPreferences>({
    notifications: true,
    darkMode: false,
    language: 'English'
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const fullName = computed(() => user.value.name)
  const isDarkMode = computed(() => preferences.value.darkMode)

  // Actions
  const updateUserProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update user profile
      user.value = { ...user.value, ...updatedProfile }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update profile'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateUserPreferences = async (updatedPreferences: Partial<UserPreferences>) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update preferences
      preferences.value = { ...preferences.value, ...updatedPreferences }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update preferences'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const toggleNotifications = async () => {
    return await updateUserPreferences({ 
      notifications: !preferences.value.notifications 
    })
  }

  const toggleDarkMode = async () => {
    return await updateUserPreferences({ 
      darkMode: !preferences.value.darkMode 
    })
  }

  const changeLanguage = async (language: string) => {
    return await updateUserPreferences({ language })
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Password validation would happen on the server
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update password'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signOut = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app, this would clear authentication tokens, etc.
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to sign out'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    preferences,
    isLoading,
    error,
    
    // Getters
    fullName,
    isDarkMode,
    
    // Actions
    updateUserProfile,
    updateUserPreferences,
    toggleNotifications,
    toggleDarkMode,
    changeLanguage,
    updatePassword,
    signOut
  }
})
