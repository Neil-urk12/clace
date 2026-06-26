import { eq } from 'drizzle-orm';
import { db } from '../config/drizzle';
import { users } from '../config/schema';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  isClassPresident: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  full_name: string;
  email: string;
  password: string;
  is_class_president: boolean;
}

export interface UserResponse {
  user_id: string;
  full_name: string;
  email: string;
  is_class_president: boolean;
}

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? (result[0] as User) : null;
  }

  static async findById(userId: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, userId));
    return result.length > 0 ? (result[0] as User) : null;
  }

  static async create(userData: CreateUserData): Promise<UserResponse> {
    const [created] = await db
      .insert(users)
      .values({
        fullName: userData.full_name,
        email: userData.email,
        passwordHash: await bcrypt.hash(userData.password, 10),
        isClassPresident: userData.is_class_president,
      })
      .returning();

    return {
      user_id: created.id,
      full_name: created.fullName,
      email: created.email,
      is_class_president: created.isClassPresident ?? false,
    };
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  static toResponse(user: User): UserResponse {
    return {
      user_id: user.id,
      full_name: user.fullName,
      email: user.email,
      is_class_president: user.isClassPresident,
    };
  }
}
