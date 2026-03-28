export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'] as const,
  ADMIN_STATS: ['admin', 'stats'] as const,
  ADMIN_USERS: ['admin', 'users'] as const,
  ADMIN_USER: (id: string) => ['admin', 'users', id] as const,
  ADMIN_PROPERTIES: ['admin', 'properties'] as const,
  ADMIN_USER_PROPERTIES: (userId: string) => ['admin', 'users', userId, 'properties'] as const,
} as const;
