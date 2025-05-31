import { ProfileModel } from '../models/Profile';
import type { UserProfile } from '../models/Profile';

export class ProfileController {
  static async getUserProfile(userId: string): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
    try {
      const profile = await ProfileModel.getUserProfile(userId);
      
      return {
        success: true,
        profile
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to fetch profile'
      };
    }
  }
  
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; profile?: UserProfile; message?: string }> {
    try {
      const profile = await ProfileModel.updateUserProfile(userId, updates);
      
      return {
        success: true,
        profile
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  }
  

  
  static async updatePassword(userId: string, body: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const result = await ProfileModel.updatePassword(userId, body.currentPassword, body.newPassword);
      
      return {
        success: result,
        message: result ? 'Password updated successfully' : 'Failed to update password'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update password'
      };
    }
  }
}
