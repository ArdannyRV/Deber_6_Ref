import { useState, useEffect } from 'react';
// import { ChatRepositoryImpl } from '@/data/repositories/ChatRepositoryImpl';        // ← Supabase
import { AppwriteChatRepositoryImpl } from '@/data/repositories/AppwriteChatRepositoryImpl'; // ← Appwrite (activo)
import { Message } from '@/domain/entities/Message';

// const chatRepo = new ChatRepositoryImpl();        // ← Supabase
const chatRepo = new AppwriteChatRepositoryImpl();   // ← Appwrite (activo)

interface UseChatProps {
  currentUserId: string;
  receiverId: string;
}

export function useChat({ currentUserId, receiverId }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!currentUserId || !receiverId) return;

    chatRepo.getMessagesBetween(currentUserId, receiverId).then(setMessages);

    const unsubscribe = chatRepo.listenMessagesBetween(
      currentUserId,
      receiverId,
      (newMessage) => {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === newMessage.id);
          return exists ? prev : [...prev, newMessage];
        });
      },
    );

    return () => unsubscribe();
  }, [currentUserId, receiverId]);

  const sendMessage = async (content: string) => {
    await chatRepo.sendMessage(currentUserId, receiverId, content);
  };

  return { messages, sendMessage };
}
