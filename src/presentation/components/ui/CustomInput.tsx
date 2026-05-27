import { useState } from 'react';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '@/presentation/theme/theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  onSubmitEditing?: () => void;
}

export function CustomInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  onSubmitEditing,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper $isFocused={isFocused}>
      <StyledInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </InputWrapper>
  );
}

const InputWrapper = styled.View<{ $isFocused: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  border-width: 2px;
  border-color: ${({ $isFocused }) =>
    $isFocused ? theme.colors.borderFocus : theme.colors.border};
  padding-horizontal: 16px;
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  padding: 14px 0;
  font-size: 16px;
  color: ${theme.colors.textMain};
  background-color: transparent;
`;
