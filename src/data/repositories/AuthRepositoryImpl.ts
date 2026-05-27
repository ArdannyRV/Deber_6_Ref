import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import { User } from '@/domain/entities/User';
import { supabase } from '@/data/sources/supabaseClient';

export class AuthRepositoryImpl implements IAuthRepository {
  async register(
    name: string,
    email: string,
    password: string,
    role: 'vendedor' | 'cliente',
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: { data: { name, role } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No se pudo crear el usuario');

    return { id: data.user.id, name, email, role };
  }

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Usuario no encontrado');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) throw new Error('Perfil no encontrado');

    return {
      id: data.user.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    return {
      id: user.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };
  }
}
