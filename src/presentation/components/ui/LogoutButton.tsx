import { TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '@/presentation/theme/theme';

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export function LogoutButton({ onPress, loading }: Props) {
  return (
    <ButtonContainer onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} size="small" />
      ) : (
        <ButtonContent>
          <Icon>{'✕'}</Icon>
          <Label>Salir</Label>
        </ButtonContent>
      )}
    </ButtonContainer>
  );
}

const ButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: ${theme.colors.surface};
  border-width: 1px;
  border-color: ${theme.colors.primary};
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const Icon = styled.Text`
  font-size: 12px;
  color: ${theme.colors.primary};
  font-weight: 700;
`;

const Label = styled.Text`
  font-size: 13px;
  color: ${theme.colors.primary};
  font-weight: 600;
`;
