export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager';
  avatarUrl?: string;
}
export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}
export interface LoginPayload {
  email: string;
  password: string;
}