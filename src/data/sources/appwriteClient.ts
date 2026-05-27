import { Client, Databases, Account, ID } from 'react-native-appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStorage: Record<string, string> = {};

if (typeof localStorage === 'undefined') {
  (global as any).localStorage = {
    getItem: (key: string): string | null => memoryStorage[key] ?? null,
    setItem: (key: string, value: string): void => { memoryStorage[key] = value; },
    removeItem: (key: string): void => { delete memoryStorage[key]; },
  };
}

export const appwriteConfig = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '6a1704030035859426cf',
  databaseId: '6a1705d8000ffebcb0c0',
  messagesCollectionId: '6a170726002267badb1b',
  usersCollectionId: '6a17067e0026e7c83573',
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId) 

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };