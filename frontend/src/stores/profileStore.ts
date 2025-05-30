import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { profileApi } from '@/services/profileApi'

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
    name: '',
    email: '',
    avatar: '',
    role: 'Student',
    joinDate: ''
  })

  const preferences = ref<UserPreferences>({
    notifications: false,
    darkMode: false,
    language: 'English'
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const fullName = computed(() => user.value.name)
  const isDarkMode = computed(() => preferences.value.darkMode)

  // Actions
  const fetchUserProfile = async () => {
    try {
      isLoading.value = true
      error.value = null
      const profile = await profileApi.getUserProfile()
      user.value = { ...profile }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch profile'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserPreferences = async () => {
    try {
      isLoading.value = true
      error.value = null
      const prefs = await profileApi.getUserPreferences()
      preferences.value = { ...prefs }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch preferences'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Initialize store
  const initialize = async () => {
    await Promise.all([
      fetchUserProfile(),
      fetchUserPreferences()
    ])
  }

  // Call initialize when store is created
  onMounted(initialize)

  const updateUserProfile = async (updatedProfile: Partial<UserProfile>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const updatedUser = await profileApi.updateUserProfile(updatedProfile)
      user.value = { ...updatedUser }
      
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
      
      const updatedPrefs = await profileApi.updateUserPreferences(updatedPreferences)
      preferences.value = { ...updatedPrefs }
      
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
      
      const result = await profileApi.updatePassword(currentPassword, newPassword)
      return result
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
      
      return await profileApi.signOut()
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
    fetchUserProfile,
    fetchUserPreferences,
    initialize,
    updateUserProfile,
    updateUserPreferences,
    toggleNotifications,
    toggleDarkMode,
    changeLanguage,
    updatePassword,
    signOut
  }
})
