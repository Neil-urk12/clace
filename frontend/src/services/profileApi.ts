import { apiClient } from '@/api/client';
import type { UserProfile } from '@/types/profile';

/**
 * Profile-related endpoints. Sign-out lives in `authService.logout` — there
 * should be one logout implementation, not two. (See git history: this
 * module previously reimplemented the logout call.)
 */
export const profileApi = {
  async getUserProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/profile');
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/profile', updates);
  },

  async updatePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>('/profile/password', {
      currentPassword,
      newPassword,
    });
  },
};

export default profileApi;