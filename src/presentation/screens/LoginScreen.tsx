import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { CustomButton } from '@/presentation/components/ui/CustomButton';
import { CustomInput } from '@/presentation/components/ui/CustomInput';
import { AnimatedBackground } from '@/presentation/components/ui/AnimatedBackground';
import { theme } from '@/presentation/theme/theme';

export function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) return;
    try {
      const user = await login(email.trim(), password.trim());
      if (user) {
        router.replace('/(chat)/list');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('Correo o contraseña incorrectos');
      } else {
        setError(msg || 'Error al iniciar sesión');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'transparent' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AnimatedBackground>
        <ScrollContainer>
          <GradientTop>
            <LogoSection>
              <LottieContainer>
                <LottieView
                  source={require('../../../assets/animations/animacion_de_inicio.json')}
                  autoPlay
                  loop
                  style={{ width: 120, height: 120 }}
                />
              </LottieContainer>
              <Title>Chat Comercio</Title>
              <Subtitle>Conecta con vendedores y clientes en tiempo real</Subtitle>
            </LogoSection>
          </GradientTop>

          <FormCard>
            <CustomInput
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Spacer />
            <CustomInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry
            />

            {error ? <ErrorMessage>{error}</ErrorMessage> : null}

            <ButtonWrapper>
              <CustomButton
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={loading}
                variant="primary"
              />
            </ButtonWrapper>

            <Footer>
              <FooterText>¿No tienes cuenta? </FooterText>
              <FooterLink onPress={() => router.push('/(auth)/register')}>
                <FooterLinkText>Regístrate aquí</FooterLinkText>
              </FooterLink>
            </Footer>
          </FormCard>
        </ScrollContainer>
      </AnimatedBackground>
    </KeyboardAvoidingView>
  );
}

const ScrollContainer = styled.ScrollView`
  flex: 1;
  background-color: transparent;
`;

const GradientTop = styled(LinearGradient).attrs({
  colors: [theme.colors.primary, theme.colors.primaryDark],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding-top: 40px;
  padding-bottom: 60px;
  align-items: center;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  overflow: hidden;
`;

const LogoSection = styled.View`
  align-items: center;
`;

const LottieContainer = styled.View`
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.white};
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
`;

const FormCard = styled.View`
  margin: -30px 24px 0;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: ${theme.borderRadius.xl}px;
  padding: 32px 24px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.25);
`;

const Spacer = styled.View`
  height: 20px;
`;

const ErrorMessage = styled.Text`
  color: ${theme.colors.error};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const ButtonWrapper = styled.View`
  margin-top: 28px;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 28px;
  margin-bottom: 8px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textMuted};
`;

const FooterLink = styled.TouchableOpacity``;

const FooterLinkText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.primary};
  font-weight: 600;
`;
