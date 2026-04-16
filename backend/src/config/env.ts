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

  port: parseInt(optional('PORT', optional('API_PORT', '4001')), 10),
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
    url: optional('REDIS_URL', ''),
  },

  minio: {
    endpoint: optional('MINIO_ENDPOINT', 'localhost'),
    port: parseInt(optional('MINIO_PORT', '9000'), 10),
    useSsl: process.env.MINIO_USE_SSL === 'true',
    accessKey: optional('MINIO_ROOT_USER', ''),
    secretKey: optional('MINIO_ROOT_PASSWORD', ''),
    bucketProperties: optional('MINIO_BUCKET_PROPERTIES', 'properties'),
    bucketAvatars: optional('MINIO_BUCKET_AVATARS', 'avatars'),
    publicUrl: optional('NEXT_PUBLIC_STORAGE_URL', ''),
  },

  bcrypt: {
    rounds: 10,
  },

  captcha: {
    secretKey: process.env.CAPTCHA_SECRET_KEY ?? '',
  },

  emailVerify: {
    secret: process.env.EMAIL_VERIFY_SECRET ?? process.env.JWT_SECRET ?? 'dev-email-verify-secret',
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
