import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { profileApi } from '@/services/profileApi'
import authService from '@/services/authService'

export interface UserProfile {
  name: string
  email: string
  avatar: string
  role: string
  joinDate: string
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

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const fullName = computed(() => user.value.name)

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



  // Initialize store
  const initialize = async () => {
    await fetchUserProfile()
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



  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await profileApi.updatePassword(currentPassword, newPassword)
      return result.success
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update password'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Single logout implementation lives in authService — never duplicate it here.
  const signOut = async () => {
    try {
      const result = await authService.logout()
      return result.success
    } catch (err) {
      console.error('Sign out failed:', err)
      return false
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    fullName,
    
    // Actions
    fetchUserProfile,
    initialize,
    updateUserProfile,
    updatePassword,
    signOut
  }
})
