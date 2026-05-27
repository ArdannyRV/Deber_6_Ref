import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { account, databases, appwriteConfig, ID } from '../sources/appwriteClient';
import { Query } from 'react-native-appwrite';

export class AppwriteAuthRepositoryImpl implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
  try {
    await account.deleteSession('current');
  } catch (_) {}

  // Crea la sesión
  const session = await account.createEmailPasswordSession(email, password);
  
  // Busca el documento del usuario por email (sin usar account.get())
  const userDocs = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', email)]
  );

  if (userDocs.documents.length === 0) throw new Error('Usuario no encontrado');
  
  const userData = userDocs.documents[0];
  return {
    id: userData.$id,
    email: userData.email,
    name: userData.name,
    role: userData.role as 'vendedor' | 'cliente',
  };
}

  // CORRIGE EL ORDEN DE LOS PARÁMETROS AQUÍ:
  async register(name: string, email: string, password: string, role: 'vendedor' | 'cliente'): Promise<User> {
    
    // Pero mantén este orden aquí adentro, porque así lo exige Appwrite:
    const newAccount = await account.create(ID.unique(), email, password, name);
    
    const newUserDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      newAccount.$id,
      { email, name, role }
    );

    return {
      id: newUserDoc.$id,
      email: newUserDoc.email,
      name: newUserDoc.name,
      role: newUserDoc.role as 'vendedor' | 'cliente',
    };
  }

  async logout(): Promise<void> {
    await account.deleteSession('current');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await account.get();
      const userDocs = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email', session.email)]
      );
      
      if (userDocs.documents.length === 0) return null;
      const userData = userDocs.documents[0];
      
      return {
        id: userData.$id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      };
    } catch {
      return null;
    }
  }
}