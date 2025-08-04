import pool from '../config/db_config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  is_class_president: boolean;
  created_at: Date;
  updated_at: Date;
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
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  static async create(userData: CreateUserData): Promise<UserResponse> {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    await pool.execute(
      'INSERT INTO users (user_id, full_name, email, password_hash, is_class_president) VALUES (?, ?, ?, ?, ?)',
      [userId, userData.full_name, userData.email, hashedPassword, userData.is_class_president]
    );

    return {
      user_id: userId,
      full_name: userData.full_name,
      email: userData.email,
      is_class_president: userData.is_class_president
    };
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  static toResponse(user: User): UserResponse {
    return {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      is_class_president: user.is_class_president
    };
  }
}
