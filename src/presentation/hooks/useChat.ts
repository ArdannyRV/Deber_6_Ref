import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/domain/entities/Message';
import { SendMessageUseCase } from '@/domain/usecases/SendMessageUseCase';
import { ListenMessagesUseCase } from '@/domain/usecases/ListenMessagesUseCase';
import { ChatRepositoryImpl } from '@/data/repositories/ChatRepositoryImpl';

const chatRepository = new ChatRepositoryImpl();
const sendMessageUseCase = new SendMessageUseCase(chatRepository);
const listenMessagesUseCase = new ListenMessagesUseCase(chatRepository);

interface Props {
  currentUserId: string;
  receiverId: string;
}

export function useChat({ currentUserId, receiverId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    chatRepository
      .getMessagesBetween(currentUserId, receiverId)
      .then(setMessages)
      .catch(() => {});

    const unsubscribe = listenMessagesUseCase.execute(
      currentUserId,
      receiverId,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      },
    );
    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
    };
  }, [currentUserId, receiverId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      await sendMessageUseCase.execute(currentUserId, receiverId, content.trim());
    },
    [currentUserId, receiverId],
  );

  return { messages, sendMessage };
}
