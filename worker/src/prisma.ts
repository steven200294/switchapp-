import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_MODE === 'mock'
  ? process.env.DATABASE_URL_MOCK
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL (or DATABASE_URL_MOCK in mock mode) is required');
}

const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

export default prisma;
