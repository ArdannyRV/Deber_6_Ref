import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
    role: 'vendedor' | 'cliente',
  ): Promise<User> {
    return this.authRepository.register(name, email, password, role);
  }
}
