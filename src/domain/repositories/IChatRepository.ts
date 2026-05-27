import { Message } from '../entities/Message';
import { User } from '../entities/User';

export interface IChatRepository {
  sendMessage(senderId: string, receiverId: string, content: string): Promise<void>;
  getMessagesBetween(userId1: string, userId2: string): Promise<Message[]>;
  listenMessagesBetween(
    userId1: string,
    userId2: string,
    onMessage: (message: Message) => void,
  ): () => void;
  getUsersByRole(role: 'vendedor' | 'cliente', excludeUserId?: string): Promise<User[]>;
}
