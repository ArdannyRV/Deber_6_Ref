import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Message } from '@/domain/entities/Message';
import { theme } from '@/presentation/theme/theme';

interface Props {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: Props) {
  return (
    <Row $isOwn={isOwn}>
      <BubbleGradient
        colors={
          isOwn
            ? ['#10B981', '#065F46']
            : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.95)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        $isOwn={isOwn}
      >
        <MessageText $isOwn={isOwn}>{message.content}</MessageText>
        <Timestamp $isOwn={isOwn}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Timestamp>
      </BubbleGradient>
    </Row>
  );
}

const Row = styled.View<{ $isOwn: boolean }>`
  flex-direction: row;
  justify-content: ${({ $isOwn }) => ($isOwn ? 'flex-end' : 'flex-start')};
  margin-vertical: 4px;
  padding-horizontal: 12px;
`;

const BubbleGradient = styled(LinearGradient)<{ $isOwn: boolean }>`
  max-width: 80%;
  border-radius: ${theme.borderRadius.lg}px;
  padding: 12px 16px;
  border-bottom-right-radius: ${({ $isOwn }) =>
    $isOwn ? '4px' : `${theme.borderRadius.lg}px`};
  border-bottom-left-radius: ${({ $isOwn }) =>
    $isOwn ? `${theme.borderRadius.lg}px` : '4px'};
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

const MessageText = styled.Text<{ $isOwn: boolean }>`
  font-size: 16px;
  line-height: 22px;
  color: ${({ $isOwn }) =>
    $isOwn ? '#FFFFFF' : '#0F172A'};
`;

const Timestamp = styled.Text<{ $isOwn: boolean }>`
  font-size: 11px;
  margin-top: 4px;
  color: ${({ $isOwn }) =>
    $isOwn ? 'rgba(255, 255, 255, 0.6)' : 'rgba(15, 23, 42, 0.5)'};
  text-align: right;
`;
