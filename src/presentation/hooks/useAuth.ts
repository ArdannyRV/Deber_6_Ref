import { useState, useEffect } from 'react';
import { User } from '@/domain/entities/User';

// import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';         // ← Supabase
import { AppwriteAuthRepositoryImpl } from '@/data/repositories/AppwriteAuthRepositoryImpl'; // ← Appwrite (activo)

// const authRepo = new AuthRepositoryImpl();         // ← Supabase
const authRepo = new AppwriteAuthRepositoryImpl();    // ← Appwrite (activo)

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    authRepo.getCurrentUser().then((u) => {
      setUser(u);
      setInitialLoading(false);
    });
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'vendedor' | 'cliente',
  ) => {
    setLoading(true);
    try {
      const newUser = await authRepo.register(name, email, password, role);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedUser = await authRepo.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authRepo.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, initialLoading, register, login, logout };
}
