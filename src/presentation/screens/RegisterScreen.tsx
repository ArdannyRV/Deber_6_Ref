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

export function RegisterScreen() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'vendedor' | 'cliente' | null>(null);

  const handleRegister = async () => {
    console.log("1. Botón presionado");
    console.log("2. Valores crudos ->", { name, email, password, role });

    if (!name.trim() || !email.trim() || !password.trim() || !role) {
      console.log("3. Faltan datos, cancelando registro");
      return;
    }

    let finalEmail = email.trim();
    if (!finalEmail.includes('@')) {
      finalEmail = `${finalEmail}@test.com`;
    }

    console.log("4. Correo final que se enviará a Appwrite:", finalEmail);

    try {
      const user = await register(name.trim(), finalEmail, password.trim(), role);
      console.log("5. Usuario registrado con éxito:", user);
      if (user) {
        router.replace('/(chat)/list');
      }
    } catch (error) {
      console.log("6. ERROR DE APPWRITE AL REGISTRAR:", error.message);
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
                  style={{ width: 100, height: 100 }}
                />
              </LottieContainer>
              <Title>Crear Cuenta</Title>
              <Subtitle>Regístrate para empezar a chatear</Subtitle>
            </LogoSection>
          </GradientTop>

          <FormCard>
            <CustomInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre completo"
              autoCapitalize="words"
            />
            <Spacer />
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

            <RoleLabel>Eres...</RoleLabel>
            <RoleGroup>
              <RoleButton
                onPress={() => setRole('vendedor')}
                $active={role === 'vendedor'}
              >
                <LottieView
                  source={require('../../../assets/animations/vendedor.json')}
                  autoPlay
                  loop
                  style={{ width: 40, height: 40 }}
                />
                <RoleButtonText $active={role === 'vendedor'}>
                  Vendedor
                </RoleButtonText>
              </RoleButton>
              <RoleButton
                onPress={() => setRole('cliente')}
                $active={role === 'cliente'}
              >
                <LottieView
                  source={require('../../../assets/animations/cliente.json')}
                  autoPlay
                  loop
                  style={{ width: 40, height: 40 }}
                />
                <RoleButtonText $active={role === 'cliente'}>
                  Cliente
                </RoleButtonText>
              </RoleButton>
            </RoleGroup>

            <CustomButton
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              variant="primary"
            />

            <Footer>
              <FooterText>¿Ya tienes cuenta? </FooterText>
              <FooterLink onPress={() => router.push('/(auth)/login')}>
                <FooterLinkText>Inicia sesión aquí</FooterLinkText>
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
  padding-top: 30px;
  padding-bottom: 50px;
  align-items: center;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  overflow: hidden;
`;

const LogoSection = styled.View`
  align-items: center;
`;

const LottieContainer = styled.View`
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-size: 26px;
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
  padding: 28px 24px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.25);
`;

const Spacer = styled.View`
  height: 16px;
`;

const RoleLabel = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  margin-top: 20px;
  margin-bottom: 12px;
  text-align: center;
`;

const RoleGroup = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 28px;
`;

const RoleButton = styled.TouchableOpacity<{ $active: boolean }>`
  flex: 1;
  align-items: center;
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.md}px;
  border-width: 2px;
  border-color: ${({ $active }) =>
    $active ? theme.colors.primary : 'rgba(255, 255, 255, 0.3)'};
  background-color: ${({ $active }) =>
    $active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
`;

const RoleButtonText = styled.Text<{ $active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  margin-top: 6px;
  color: ${({ $active }) =>
    $active ? theme.colors.primary : theme.colors.textMuted};
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
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
