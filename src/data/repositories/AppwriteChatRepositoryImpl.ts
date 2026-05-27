import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { Message } from '../../domain/entities/Message';
import { User } from '../../domain/entities/User';
import { databases, appwriteConfig, client, ID } from '../sources/appwriteClient';
import { Query } from 'react-native-appwrite';

export class AppwriteChatRepositoryImpl implements IChatRepository {
  async getAvailableUsers(roleToFind: 'cliente' | 'vendedor'): Promise<User[]> {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('role', roleToFind)]
    );

    return response.documents.map(doc => ({
      id: doc.$id,
      email: doc.email,
      name: doc.name,
      role: doc.role,
    }));
  }

  async getMessagesBetween(userId1: string, userId2: string): Promise<Message[]> {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      [
        Query.orderAsc('createdAt'),
        Query.limit(100)
      ]
    );

    // Filtrar localmente por simplificar (Appwrite requiere índices compuestos para OR complejos)
    const filtered = response.documents.filter(doc => 
      (doc.senderId === userId1 && doc.receiverId === userId2) ||
      (doc.senderId === userId2 && doc.receiverId === userId1)
    );

    return filtered.map(doc => ({
      id: doc.$id,
      senderId: doc.senderId,
      receiverId: doc.receiverId,
      content: doc.content,
      createdAt: new Date(doc.createdAt),
    }));
  }

  async sendMessage(message: Omit<Message, 'id' | 'createdAt'>): Promise<void> {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        createdAt: new Date().toISOString(),
      }
    );
  }

  listenMessagesBetween(userId1: string, userId2: string, callback: (message: Message) => void): () => void {
    const channel = `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`;
    
    // Suscripción Realtime en Appwrite
    const unsubscribe = client.subscribe(channel, response => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        const doc = response.payload as any;
        
        if (
          (doc.senderId === userId1 && doc.receiverId === userId2) ||
          (doc.senderId === userId2 && doc.receiverId === userId1)
        ) {
          callback({
            id: doc.$id,
            senderId: doc.senderId,
            receiverId: doc.receiverId,
            content: doc.content,
            createdAt: new Date(doc.createdAt),
          });
        }
      }
    });

    return unsubscribe;
  }
}