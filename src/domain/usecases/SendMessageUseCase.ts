import { IChatRepository } from '../repositories/IChatRepository';

export class SendMessageUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(senderId: string, receiverId: string, content: string): Promise<void> {
    return this.chatRepository.sendMessage(senderId, receiverId, content);
  }
}
