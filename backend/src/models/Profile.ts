import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../config/drizzle';
import { users } from '../config/schema';
import { NotFoundError, ValidationError } from '../lib/errors';
import { UserModel, User } from './User';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
}

export class ProfileModel {
  static async getUserProfile(userId: string): Promise<UserProfile> {
    const result = await db.select().from(users).where(eq(users.id, userId));

    if (result.length === 0) {
      throw new NotFoundError('User not found');
    }

    const user = result[0] as User;

    const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    const role = user.isClassPresident ? 'Class President' : 'Student';
    const avatar = '/api/placeholder/150/150';

    return {
      name: user.fullName,
      email: user.email,
      avatar,
      role,
      joinDate,
    };
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await db.transaction(async (tx) => {
      if (updates.name) {
        await tx
          .update(users)
          .set({
            fullName: updates.name,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      }
    });

    return await this.getUserProfile(userId);
  }

  static async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const result = await db.select().from(users).where(eq(users.id, userId));
    const userRows = result as User[];

    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    const user = userRows[0];

    const isPasswordValid = await UserModel.validatePassword(user, currentPassword);

    if (!isPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  }
}
