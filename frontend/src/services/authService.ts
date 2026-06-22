import { apiClient } from '@/api/client';
import { UnauthorizedError } from '@/api/errors';
import type { LoginCredentials, RegisterPayloadBackend, User } from '@/types/auth';

interface AuthResponse {
  token: string;
  user: User;
}

const getToken = (): string | null => localStorage.getItem('authToken');

export const authService = {
  /** Authenticate and return {token, user}. Throws UnauthorizedError on bad credentials. */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /** Register a new user and return {token, user}. */
  async register(userData: RegisterPayloadBackend): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },

  /**
   * Invalidate the server-side session. Returns `{success: true}` even when
   * there's no token locally — logout is a local-state operation first,
   * server-side cleanup is best-effort.
   */
  async logout(): Promise<{ success: boolean }> {
    const token = getToken();
    if (!token) return { success: true };
    return apiClient.post<{ success: boolean }>('/auth/logout', { token });
  },

  /**
   * Fetch the current user. Returns null when there's no token (avoids a
   * 401 round-trip on app boot) or when the server says the token is invalid
   * (typed catch — "no user" is a valid domain result for this endpoint).
   */
  async getCurrentUser(): Promise<User | null> {
    if (!getToken()) return null;
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (err) {
      if (err instanceof UnauthorizedError) return null;
      throw err;
    }
  },
};

export default authService;