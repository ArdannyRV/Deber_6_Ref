import { Client, Databases, Account, ID } from 'react-native-appwrite';

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