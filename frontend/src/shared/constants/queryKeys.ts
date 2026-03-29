export const QUERY_KEYS = {
  AUTH_ME: ['auth', 'me'] as const,
  SWIPE_DECK: ['swipe', 'deck'] as const,
  PROPERTIES: ['properties'] as const,
  PROPERTY: (id: string) => ['properties', id] as const,
  COMPATIBILITY: (id: string) => ['properties', id, 'compatibility'] as const,
  MY_MATCHES: ['matches'] as const,
  MATCH: (id: string) => ['matches', id] as const,
  CONVERSATIONS: ['conversations'] as const,
  MESSAGES: (conversationId: string) => ['messages', conversationId] as const,
  FAVORITES: ['favorites'] as const,
} as const;
