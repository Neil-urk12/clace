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
