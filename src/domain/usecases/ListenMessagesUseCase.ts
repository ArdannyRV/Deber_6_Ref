import { IChatRepository } from '../repositories/IChatRepository';
import { Message } from '../entities/Message';

export class ListenMessagesUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  execute(
    userId1: string,
    userId2: string,
    onMessage: (message: Message) => void,
  ): () => void {
    return this.chatRepository.listenMessagesBetween(userId1, userId2, onMessage);
  }
}
