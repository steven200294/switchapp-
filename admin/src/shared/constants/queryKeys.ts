export const QUERY_KEYS = {
  ADMIN_STATS: ['admin', 'stats'] as const,
  ADMIN_USERS: ['admin', 'users'] as const,
  ADMIN_USER: (id: string) => ['admin', 'users', id] as const,
  ADMIN_PROPERTIES: ['admin', 'properties'] as const,
  ADMIN_MATCHES: ['admin', 'matches'] as const,
  ADMIN_SWIPES: ['admin', 'swipes'] as const,
  ADMIN_SWIPE_STATS: ['admin', 'swipes', 'stats'] as const,
  ADMIN_CONVERSATIONS: ['admin', 'conversations'] as const,
  ADMIN_CONVERSATION_MESSAGES: (id: string) => ['admin', 'conversations', id, 'messages'] as const,
  ADMIN_METRICS_SUMMARY: ['admin', 'metrics', 'summary'] as const,
} as const;
