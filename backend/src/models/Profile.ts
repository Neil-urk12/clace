import pool from '../config/db_config';
import { User, UserModel } from './User';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
}

export class ProfileModel {
  static async getUserProfile(userId: string): Promise<UserProfile> {
    // Get the user from the database
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    const users = rows as User[];
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    
    // Format the join date
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    
    // Determine role based on is_class_president flag
    const role = user.is_class_president ? 'Class President' : 'Student';
    
    // Use default avatar
    const avatar = '/api/placeholder/150/150';
    
    return {
      name: user.full_name,
      email: user.email,
      avatar,
      role,
      joinDate
    };
  }
  
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    // Start a transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Update the user's name if provided
      if (updates.name) {
        await connection.execute(
          'UPDATE users SET full_name = ?, updated_at = NOW() WHERE user_id = ?',
          [updates.name, userId]
        );
      }
      
      // Note: Avatar functionality removed as per requirements
      
      await connection.commit();
      
      // Return the updated profile
      return await this.getUserProfile(userId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  

  
  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    // Get the user from the database
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    const users = rows as User[];
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const user = users[0];
    
    // Validate the current password
    const isPasswordValid = await UserModel.validatePassword(user, currentPassword);
    
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash the new password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    await pool.execute(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?',
      [hashedPassword, userId]
    );
    
    return true;
  }
}
