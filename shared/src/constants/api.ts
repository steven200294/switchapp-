export const API_PREFIX = "/api/v1";

export const ROUTES = {
  HEALTH: `${API_PREFIX}/health`,
  AUTH: {
    BASE: `${API_PREFIX}/auth`,
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    ME: `${API_PREFIX}/auth/me`,
  },
  USERS: {
    BASE: `${API_PREFIX}/users`,
    ME: `${API_PREFIX}/users/me/profile`,
    PUBLIC: `${API_PREFIX}/users/:id/public`,
  },
  PROPERTIES: {
    BASE: `${API_PREFIX}/properties`,
    SEARCH: `${API_PREFIX}/properties/search`,
    BY_ID: `${API_PREFIX}/properties/:id`,
    compatibility: (id: string) => `${API_PREFIX}/properties/${id}/compatibility`,
  },
  SWIPES: {
    BASE: `${API_PREFIX}/swipes`,
    UNDO: `${API_PREFIX}/swipes/undo`,
    DECK: `${API_PREFIX}/swipes/deck`,
  },
  MATCHES: {
    BASE: `${API_PREFIX}/matches`,
    BY_ID: `${API_PREFIX}/matches/:id`,
  },
  MESSAGES: {
    CONVERSATIONS: `${API_PREFIX}/messages/conversations`,
    CONVERSATION_BY_ID: `${API_PREFIX}/messages/conversations/:id`,
    CONVERSATION_MESSAGES: `${API_PREFIX}/messages/conversations/:id/messages`,
  },
  FAVORITES: {
    BASE: `${API_PREFIX}/favorites`,
    BY_PROPERTY: `${API_PREFIX}/favorites/:propertyId`,
  },
  ADMIN: {
    BASE: `${API_PREFIX}/admin`,
    DASHBOARD: `${API_PREFIX}/admin/dashboard`,
    USERS: `${API_PREFIX}/admin/users`,
    PROPERTIES: `${API_PREFIX}/admin/properties`,
  },
} as const;
