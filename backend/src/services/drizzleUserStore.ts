import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { users } from '../config/schema';
import type { AppDb } from '../core/db';
import type { UserStore, UnifiedUser, CreateUserData, UpdateUserData } from '../models/UserModel';
import { NotFoundError, ConflictError } from '../lib/errors';

export class DrizzleUserStore implements UserStore {
  constructor(private db: AppDb) {}

  private mapRowToUser(row: typeof users.$inferSelect): UnifiedUser {
    return {
      id: row.id,
      email: row.email,
      fullName: row.fullName,
      avatarUrl: '/api/placeholder/150/150',
      role: row.isClassPresident ? 'Class President' : 'Student',
      createdAt: row.createdAt ?? new Date(),
      updatedAt: row.updatedAt ?? new Date(),
      joinDateFormatted: (row.createdAt ?? new Date()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      }),
      isClassPresident: row.isClassPresident ?? false,
    };
  }

  async findById(id: string): Promise<UnifiedUser> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id));
    if (!row) {
      throw new NotFoundError('User not found');
    }
    return this.mapRowToUser(row);
  }

  async findByEmail(email: string): Promise<UnifiedUser | null> {
    const [row] = await this.db.select().from(users).where(eq(users.email, email));
    if (!row) {
      return null;
    }
    return this.mapRowToUser(row);
  }

  async create(data: CreateUserData): Promise<UnifiedUser> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);
    const [created] = await this.db
      .insert(users)
      .values({
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        isClassPresident: data.isClassPresident ?? false,
      })
      .returning();

    return this.mapRowToUser(created);
  }

  async update(id: string, updates: UpdateUserData): Promise<UnifiedUser> {
    const updateFields: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (updates.fullName !== undefined) {
      updateFields.fullName = updates.fullName;
    }
    if (updates.email !== undefined) {
      const existing = await this.findByEmail(updates.email);
      if (existing && existing.id !== id) {
        throw new ConflictError('Email already in use');
      }
      updateFields.email = updates.email;
    }

    const [updated] = await this.db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError('User not found');
    }

    return this.mapRowToUser(updated);
  }

  async verifyCredential(userId: string, passwordPlain: string): Promise<boolean> {
    const [row] = await this.db.select().from(users).where(eq(users.id, userId));
    if (!row) {
      return false;
    }
    return bcrypt.compare(passwordPlain, row.passwordHash);
  }

  async updatePassword(userId: string, passwordPlain: string): Promise<void> {
    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const [updated] = await this.db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundError('User not found');
    }
  }
}
