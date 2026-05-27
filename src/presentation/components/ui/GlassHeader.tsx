import { BlurView } from 'expo-blur';
import styled from 'styled-components/native';
import { theme } from '@/presentation/theme/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export function GlassHeader({ title, subtitle, onBackPress, rightElement }: Props) {
  return (
    <HeaderWrapper>
      <StyledBlur intensity={80} tint="light">
        <Content>
          <Side>{onBackPress ? <BackButton onPress={onBackPress}><Arrow>{'‹'}</Arrow></BackButton> : null}</Side>
          <Center>
            <Title numberOfLines={1}>{title}</Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
          </Center>
          <Side>{rightElement ?? null}</Side>
        </Content>
      </StyledBlur>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const StyledBlur = styled(BlurView)`
  padding-top: 50px;
  padding-bottom: 12px;
  padding-horizontal: 16px;
`;

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 44px;
`;

const Side = styled.View`
  min-width: 40px;
  align-items: flex-start;
`;

const Center = styled.View`
  flex: 1;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: rgba(0, 0, 0, 0.06);
  align-items: center;
  justify-content: center;
`;

const Arrow = styled.Text`
  font-size: 24px;
  color: ${theme.colors.textMain};
  line-height: 26px;
`;

const Title = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: ${theme.colors.textMain};
  letter-spacing: 0.3px;
`;

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  margin-top: 1px;
`;
