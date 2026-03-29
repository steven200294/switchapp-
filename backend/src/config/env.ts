import 'dotenv/config';

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function databaseEffectiveUrl(): string {
  const mode = optional('DATABASE_MODE', 'real');
  if (mode === 'mock') {
    return required('DATABASE_URL_MOCK');
  }
  return required('DATABASE_URL');
}

export const env = {
  nodeEnv: optional('NODE_ENV', 'development'),
  isDev: optional('NODE_ENV', 'development') === 'development',

  port: parseInt(required('API_PORT'), 10),
  frontendUrl: optional('FRONTEND_URL', 'http://localhost:3001'),

  database: {
    /** Prisma schema / CLI default */
    url: required('DATABASE_URL'),
    mode: optional('DATABASE_MODE', 'real') as 'real' | 'mock',
    /** Runtime DB (mock or real) */
    effectiveUrl: databaseEffectiveUrl(),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: optional('JWT_EXPIRES_IN', '7d'),
  },

  redis: {
    url: required('REDIS_URL'),
  },

  minio: {
    endpoint: required('MINIO_ENDPOINT'),
    port: parseInt(required('MINIO_PORT'), 10),
    useSsl: process.env.MINIO_USE_SSL === 'true',
    accessKey: required('MINIO_ROOT_USER'),
    secretKey: required('MINIO_ROOT_PASSWORD'),
    bucketProperties: optional('MINIO_BUCKET_PROPERTIES', 'properties'),
    bucketAvatars: optional('MINIO_BUCKET_AVATARS', 'avatars'),
    publicUrl: required('NEXT_PUBLIC_STORAGE_URL'),
  },

  bcrypt: {
    rounds: 10,
  },

  pagination: {
    defaultLimit: 20,
    maxLimit: 50,
    adminDefaultLimit: 100,
  },

  ai: {
    provider: optional('AI_PROVIDER', 'openai'),
    model: optional('AI_MODEL', 'gpt-4o-mini'),
    apiKey: process.env.AI_API_KEY ?? '',
  },
} as const;
