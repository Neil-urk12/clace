export interface User {
  user_id: string;
  full_name: string;
  email: string;
  is_class_president: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: 'student' | 'class-president'; // Frontend role
}

export interface RegisterPayloadBackend {
  full_name: string;
  email: string;
  password: string;
  is_class_president: boolean;
}
