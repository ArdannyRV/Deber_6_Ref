import { IChatRepository } from '../repositories/IChatRepository';
import { User } from '../entities/User';

export class GetAvailableUsersUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(role: 'vendedor' | 'cliente', excludeUserId?: string): Promise<User[]> {
    return this.chatRepository.getUsersByRole(role, excludeUserId);
  }
}
