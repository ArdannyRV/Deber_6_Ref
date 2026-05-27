import { IChatRepository } from '@/domain/repositories/IChatRepository';
import { Message } from '@/domain/entities/Message';
import { User } from '@/domain/entities/User';
import { supabase } from '@/data/sources/supabaseClient';

export class ChatRepositoryImpl implements IChatRepository {
  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
  ): Promise<void> {
    const { error } = await supabase.from('messages').insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });
    if (error) throw new Error(error.message);
  }

  async getMessagesBetween(
    userId1: string,
    userId2: string,
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`,
      )
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: Record<string, unknown>) => ({
      id: String(row.id),
      senderId: row.sender_id as string,
      receiverId: row.receiver_id as string,
      content: row.content as string,
      createdAt: row.created_at as string,
    }));
  }

  listenMessagesBetween(
    userId1: string,
    userId2: string,
    onMessage: (message: Message) => void,
  ): () => void {
    const channelId = [userId1, userId2].sort().join('-');

    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const msg = payload.new as Record<string, unknown>;
          if (
            (msg.sender_id === userId1 && msg.receiver_id === userId2) ||
            (msg.sender_id === userId2 && msg.receiver_id === userId1)
          ) {
            onMessage({
              id: String(msg.id),
              senderId: msg.sender_id as string,
              receiverId: msg.receiver_id as string,
              content: msg.content as string,
              createdAt: msg.created_at as string,
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  async getUsersByRole(role: 'vendedor' | 'cliente', excludeUserId?: string): Promise<User[]> {
    let query = supabase.from('profiles').select('*').eq('role', role);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      name: row.name as string,
      email: row.email as string,
      role: row.role as 'vendedor' | 'cliente',
    }));
  }
}
