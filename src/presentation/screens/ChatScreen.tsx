import { useState, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  Alert,
  ImageBackground,
} from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useChat } from '@/presentation/hooks/useChat';
import { GlassHeader } from '@/presentation/components/ui/GlassHeader';
import { MessageBubble } from '@/presentation/components/chat/MessageBubble';
import { Message } from '@/domain/entities/Message';
import { theme } from '@/presentation/theme/theme';

export function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id: receiverId, receiverName, receiverRole } =
    useLocalSearchParams<{
      id: string;
      receiverName: string;
      receiverRole: string;
    }>();

  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const currentUserId = user?.id ?? '';

  const { messages, sendMessage } = useChat({
    currentUserId,
    receiverId: receiverId ?? '',
  });

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    Keyboard.dismiss();
    try {
      await sendMessage(text);
      setInputText('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      Alert.alert('Error', 'No se pudo enviar el mensaje');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} isOwn={item.senderId === currentUserId} />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatBackground source={require('../../../assets/images/fondo_chats.png')}>
        <GlassHeader
          title={receiverName ?? 'Chat'}
          subtitle={receiverRole === 'vendedor' ? 'Vendedor' : 'Cliente'}
          onBackPress={() => router.back()}
        />
        <MessageList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item: Message) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingTop: 110, paddingBottom: 8 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
        <InputBar $isFocused={isInputFocused}>
          <InputRow>
            <ChatInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="rgba(75, 85, 99, 0.7)"
              onSubmitEditing={handleSend}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <SendButton onPress={handleSend} disabled={!inputText.trim()}>
              <SendIcon>{'➤'}</SendIcon>
            </SendButton>
          </InputRow>
        </InputBar>
      </ChatBackground>
    </KeyboardAvoidingView>
  );
}

const ChatBackground = styled(ImageBackground)`
  flex: 1;
`;

const MessageList = styled(FlatList)`
  flex: 1;
  padding-horizontal: 4px;
` as unknown as typeof FlatList;

const InputBar = styled.View<{ $isFocused: boolean }>`
  margin: 8px 16px 36px;
  border-radius: 28px;
  background-color: rgba(255, 255, 255, 0.9);
  border-width: 2px;
  border-color: ${({ $isFocused }) =>
    $isFocused ? theme.colors.borderFocus : 'rgba(255, 255, 255, 0.4)'};
  padding: 6px 6px 6px 18px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 6px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ChatInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${theme.colors.textMain};
  padding: 8px 0;
`;

const SendButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  width: 44px;
  height: 44px;
  background-color: ${theme.colors.primary};
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

const SendIcon = styled.Text`
  color: ${theme.colors.white};
  font-size: 24px;
  line-height: 26px;
`;
