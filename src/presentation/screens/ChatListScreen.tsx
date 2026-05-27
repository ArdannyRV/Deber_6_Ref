import { useState, useEffect, useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/presentation/hooks/useAuth';
import { ChatRepositoryImpl } from '@/data/repositories/ChatRepositoryImpl';
import { GetAvailableUsersUseCase } from '@/domain/usecases/GetAvailableUsersUseCase';
import { User } from '@/domain/entities/User';
import { GlassHeader } from '@/presentation/components/ui/GlassHeader';
import { LogoutButton } from '@/presentation/components/ui/LogoutButton';
import { LoaderLottie } from '@/presentation/components/ui/LoaderLottie';
import { theme } from '@/presentation/theme/theme';

const chatRepo = new ChatRepositoryImpl();
const getAvailableUsers = new GetAvailableUsersUseCase(chatRepo);

export function ChatListScreen() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const oppositeRole =
    user?.role === 'vendedor' ? 'cliente' : 'vendedor';

  useEffect(() => {
    if (!user) return;
    setUsersLoading(true);
    getAvailableUsers
      .execute(oppositeRole as 'vendedor' | 'cliente', user.id)
      .then(setUsers)
      .finally(() => setUsersLoading(false));
  }, [user?.id, user?.role]);

  const filteredUsers = useMemo(
    () => users.filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    [users, searchQuery],
  );

  const handleUserPress = useCallback(
    (receiver: User) => {
      if (!user) return;
      router.push({
        pathname: '/(chat)/room/[id]',
        params: {
          id: receiver.id,
          receiverName: receiver.name,
          receiverRole: receiver.role,
        },
      });
    },
    [router, user],
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const renderUser = ({ item }: { item: User }) => (
    <UserCard onPress={() => handleUserPress(item)}>
      <Avatar>
        <AvatarText>{item.name.charAt(0).toUpperCase()}</AvatarText>
      </Avatar>
      <UserInfo>
        <UserName>{item.name}</UserName>
        <UserRoleBadge $role={item.role}>
          <UserRoleText $role={item.role}>
            {item.role === 'vendedor' ? 'Vendedor' : 'Cliente'}
          </UserRoleText>
        </UserRoleBadge>
      </UserInfo>
      <Chevron>{'›'}</Chevron>
    </UserCard>
  );

  if (!user) {
    return (
      <ChatBackground source={require('../../../assets/images/fondo_chats.png')}>
        <LoaderWrapper>
          <LoaderLottie size={80} />
        </LoaderWrapper>
      </ChatBackground>
    );
  }

  return (
    <ChatBackground source={require('../../../assets/images/fondo_chats.png')}>
      <GlassHeader
        title="Mis Chats"
        subtitle={`${oppositeRole === 'vendedor' ? 'Vendedores' : 'Clientes'} disponibles`}
        rightElement={<LogoutButton onPress={handleLogout} loading={authLoading} />}
      />

      {usersLoading ? (
        <LoaderWrapper>
          <LoaderLottie size={80} />
        </LoaderWrapper>
      ) : (
        <ContentWrapper>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder={
                oppositeRole === 'vendedor'
                  ? 'Buscar vendedor...'
                  : 'Buscar contacto...'
              }
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </SearchContainer>
          <UserList
            data={filteredUsers}
            keyExtractor={(item: User) => item.id}
            renderItem={renderUser}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
            ListEmptyComponent={
              <EmptyState>
                {searchQuery ? (
                  <LottieView
                    source={require('../../../assets/animations/no_results.json')}
                    autoPlay
                    loop
                    style={{ width: 150, height: 150 }}
                  />
                ) : null}
                <EmptyText>
                  {searchQuery
                    ? 'Sin resultados'
                    : 'No hay usuarios disponibles'}
                </EmptyText>
                <EmptySubtext>
                  {searchQuery
                    ? 'Prueba con otro nombre'
                    : 'Espera a que alguien se conecte'}
                </EmptySubtext>
              </EmptyState>
            }
          />
        </ContentWrapper>
      )}
    </ChatBackground>
  );
}

const ChatBackground = styled(ImageBackground)`
  flex: 1;
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding-top: 110px;
`;

const UserList = styled(FlatList)`
  flex: 1;
` as unknown as typeof FlatList;

const UserCard = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: ${theme.borderRadius.lg}px;
  padding: 16px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.3);
`;

const Avatar = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(209, 250, 229, 0.8);
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  border-width: 1.5px;
  border-color: ${theme.colors.primary};
`;

const AvatarText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 18px;
  font-weight: 700;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textMain};
  margin-bottom: 4px;
`;

const UserRoleBadge = styled.View<{ $role: string }>`
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: ${theme.borderRadius.sm}px;
  background-color: ${({ $role }) =>
    $role === 'vendedor' ? 'rgba(209, 250, 229, 0.7)' : 'rgba(254, 243, 199, 0.7)'};
`;

const UserRoleText = styled.Text<{ $role: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $role }) =>
    $role === 'vendedor' ? '#065F46' : '#92400E'};
`;

const Chevron = styled.Text`
  font-size: 24px;
  color: ${theme.colors.textMuted};
  margin-left: 8px;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 12px 16px 8px;
  padding: 10px 16px;
  border-radius: ${theme.borderRadius.md}px;
  background-color: rgba(255, 255, 255, 0.85);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.3);
`;

const SearchIcon = styled.Text`
  font-size: 16px;
  margin-right: 10px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: ${theme.colors.textMain};
  padding: 0;
`;

const LoaderWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 80px;
`;

const EmptyText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textMain};
`;

const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;
