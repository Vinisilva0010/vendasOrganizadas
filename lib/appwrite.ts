import { Client, Account, Databases } from 'appwrite';

// Inicializa o client do Appwrite
export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Exporta os serviços que serão utilizados
export const account = new Account(client);
export const databases = new Databases(client);

