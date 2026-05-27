import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { theme } from '@/presentation/theme/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function CustomButton({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: Props) {
  return (
    <ButtonTouchable
      onPress={onPress}
      disabled={loading || disabled}
      $variant={variant}
    >
      {variant === 'primary' ? (
        <GradientBG>
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <ButtonText>{title}</ButtonText>
          )}
        </GradientBG>
      ) : (
        <SecondaryContent>
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <SecondaryText>{title}</SecondaryText>
          )}
        </SecondaryContent>
      )}
    </ButtonTouchable>
  );
}

const ButtonTouchable = styled(TouchableOpacity)<{ $variant: 'primary' | 'secondary' }>`
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const GradientBG = styled(LinearGradient).attrs({
  colors: [theme.colors.primary, theme.colors.primaryDark],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  border-radius: ${theme.borderRadius.md}px;
  padding: 16px 24px;
  align-items: center;
  justify-content: center;
  elevation: 4;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 8px;
`;

const SecondaryContent = styled.View`
  border-radius: ${theme.borderRadius.md}px;
  padding: 16px 24px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${theme.colors.primary};
  background-color: transparent;
`;

const ButtonText = styled.Text`
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  color: ${theme.colors.white};
`;

const SecondaryText = styled.Text`
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  color: ${theme.colors.primary};
`;
