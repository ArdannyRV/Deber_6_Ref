import { User } from '../entities/User';

export interface IAuthRepository {
  register(name: string, email: string, password: string, role: 'vendedor' | 'cliente'): Promise<User>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
