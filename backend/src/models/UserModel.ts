export interface UnifiedUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: 'Class President' | 'Student';
  createdAt: Date;
  updatedAt: Date;
  joinDateFormatted: string;
  isClassPresident: boolean;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  passwordPlain: string;
  isClassPresident?: boolean;
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
}

export interface UserStore {
  findById(id: string): Promise<UnifiedUser>;
  findByEmail(email: string): Promise<UnifiedUser | null>;
  create(data: CreateUserData): Promise<UnifiedUser>;
  update(id: string, updates: UpdateUserData): Promise<UnifiedUser>;
  verifyCredential(userId: string, passwordPlain: string): Promise<boolean>;
  updatePassword(userId: string, passwordPlain: string): Promise<void>;
}
