import type { UserStore, UnifiedUser, CreateUserData, UpdateUserData } from '../models/UserModel';
import { NotFoundError, ConflictError } from '../lib/errors';
import bcrypt from 'bcryptjs';

export class InMemoryUserStore implements UserStore {
  private users = new Map<string, UnifiedUser & { passwordHash: string }>();

  async findById(id: string): Promise<UnifiedUser> {
    const user = this.users.get(id);
    if (!user) throw new NotFoundError('User not found');
    const { passwordHash, ...domainUser } = user;
    return domainUser;
  }

  async findByEmail(email: string): Promise<UnifiedUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        const { passwordHash, ...domainUser } = user;
        return domainUser;
      }
    }
    return null;
  }

  async create(data: CreateUserData): Promise<UnifiedUser> {
    const existing = await this.findByEmail(data.email);
    if (existing) throw new ConflictError(`Email already registered`);

    const id = crypto.randomUUID();
    const now = new Date();
    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);
    const newUser = {
      id,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: '/api/placeholder/150/150',
      role: (data.isClassPresident ? 'Class President' : 'Student') as 'Class President' | 'Student',
      createdAt: now,
      updatedAt: now,
      joinDateFormatted: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      isClassPresident: !!data.isClassPresident,
      passwordHash,
    };
    this.users.set(id, newUser);
    const { passwordHash: _, ...domainUser } = newUser;
    return domainUser;
  }

  async update(id: string, updates: UpdateUserData): Promise<UnifiedUser> {
    const user = this.users.get(id);
    if (!user) throw new NotFoundError(`User not found`);

    if (updates.email && updates.email !== user.email) {
      const existing = await this.findByEmail(updates.email);
      if (existing) throw new ConflictError(`Email already in use`);
      user.email = updates.email;
    }
    if (updates.fullName !== undefined) {
      user.fullName = updates.fullName;
    }
    user.updatedAt = new Date();
    this.users.set(id, user);

    const { passwordHash, ...domainUser } = user;
    return domainUser;
  }

  async verifyCredential(userId: string, passwordPlain: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    return await bcrypt.compare(passwordPlain, user.passwordHash);
  }

  async updatePassword(userId: string, passwordPlain: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) throw new NotFoundError(`User not found`);
    user.passwordHash = await bcrypt.hash(passwordPlain, 10);
    user.updatedAt = new Date();
    this.users.set(userId, user);
  }
}

