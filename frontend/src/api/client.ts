import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { DomainError, errorFromStatus } from './errors';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://clace-sp45.onrender.com';

export interface ApiClientConfig {
  /**
   * Returns the bearer token for the current request, or null if absent.
   * Defaults to reading from `localStorage.authToken`. Override in tests
   * to control auth without touching localStorage.
   */
  getToken?: () => string | null;
}

export interface ApiClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  /** Raw axios instance for tests that need direct access (e.g. mock adapters). */
  instance: AxiosInstance;
}

/**
 * Create an apiClient — a thin axios wrapper that:
 * - injects the Bearer header from the configured token source,
 * - unwraps `{success: true, data}` envelopes and returns the data,
 * - throws a typed DomainError on `{success: false, message}` or any 4xx/5xx,
 * - propagates network errors unchanged (different recovery path).
 *
 * Domain services receive plain data, never envelopes.
 */
export const createApiClient = (config: ApiClientConfig = {}): ApiClient => {
  const getToken = config.getToken ?? (() => localStorage.getItem('authToken'));

  const instance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      req.headers.set('Authorization', `Bearer ${token}`);
    }
    return req;
  });

  instance.interceptors.response.use(
    (response) => {
      const body = response.data;
      if (body && typeof body === 'object' && 'success' in body) {
        if (body.success === true) {
          response.data = body.data;
          return response;
        }
        if (body.success === false) {
          throw errorFromStatus(response.status, body.message ?? 'Request failed');
        }
      }
      return response;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        const message = data?.message ?? data?.error ?? error.message ?? 'Request failed';
        throw errorFromStatus(status, message);
      }
      throw error;
    },
  );

  const unwrap = <T>(promise: Promise<{ data: T }>): Promise<T> =>
    promise.then((r) => r.data);

  return {
    get: (url, config) => unwrap(instance.get(url, config)),
    post: (url, data, config) => unwrap(instance.post(url, data, config)),
    put: (url, data, config) => unwrap(instance.put(url, data, config)),
    patch: (url, data, config) => unwrap(instance.patch(url, data, config)),
    delete: (url, config) => unwrap(instance.delete(url, config)),
    instance,
  };
};

/** Singleton apiClient for app use. Reads the token from `localStorage`. */
export const apiClient = createApiClient();

export { DomainError };