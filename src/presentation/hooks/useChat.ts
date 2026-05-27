import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { Message } from '../../domain/entities/Message';
import { User } from '../../domain/entities/User';
import { databases, appwriteConfig, client, ID } from '../../data/sources/appwriteClient';
import { Query } from 'react-native-appwrite';

export class AppwriteChatRepositoryImpl implements IChatRepository {
  
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<void> {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        created_at: new Date().toISOString(),
      }
    );
  }

  async getMessagesBetween(userId1: string, userId2: string): Promise<Message[]> {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [Query.orderAsc('created_at'), Query.limit(100)]
    );

    const filtered = response.documents.filter(doc => 
      (doc.sender_id === userId1 && doc.receiver_id === userId2) ||
      (doc.sender_id === userId2 && doc.receiver_id === userId1)
    );

    // CORRECCIÓN 1: Aseguramos que todo se envíe como string
    return filtered.map(doc => ({
      id: doc.$id,
      senderId: doc.sender_id as string,
      receiverId: doc.receiver_id as string,
      content: doc.content as string,
      createdAt: doc.created_at as string, 
    }));
  }

  listenMessagesBetween(userId1: string, userId2: string, onMessage: (message: Message) => void): () => void {
    const channel = `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`;
    
    const unsubscribe = client.subscribe(channel, response => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        const msg = response.payload as any;
        if (
          (msg.sender_id === userId1 && msg.receiver_id === userId2) ||
          (msg.sender_id === userId2 && msg.receiver_id === userId1)
        ) {
          // CORRECCIÓN 2: Aseguramos que todo se envíe como string
          onMessage({
            id: msg.$id,
            senderId: msg.sender_id as string,
            receiverId: msg.receiver_id as string,
            content: msg.content as string,
            createdAt: msg.created_at as string,
          });
        }
      }
    });

    return unsubscribe;
  }

  async getUsersByRole(role: 'vendedor' | 'cliente', excludeUserId?: string): Promise<User[]> {
    let queries = [Query.equal('role', role)];
    
    if (excludeUserId) {
        queries.push(Query.notEqual('id', excludeUserId));
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      queries
    );

    return response.documents.map(doc => ({
      id: doc.$id,
      email: doc.email as string,
      name: doc.name as string,
      role: doc.role as 'vendedor' | 'cliente',
    }));
  }
}