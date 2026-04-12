export const API_PREFIX = "/api/v1";

export const ROUTES = {
  HEALTH: `${API_PREFIX}/health`,
  AUTH: {
    BASE: `${API_PREFIX}/auth`,
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    ME: `${API_PREFIX}/auth/me`,
  },
  USERS: {
    ME: `${API_PREFIX}/users/me/profile`,
    PUBLIC: `${API_PREFIX}/users/:id/public`,
  },
  PROPERTIES: {
    BASE: `${API_PREFIX}/properties`,
    FEED: `${API_PREFIX}/properties/feed`,
    BY_ID: `${API_PREFIX}/properties/:id`,
    ME: `${API_PREFIX}/properties/me`,
    DRAFT: `${API_PREFIX}/properties/draft`,
    COMPATIBILITY: (id: string) => `${API_PREFIX}/properties/${id}/compatibility`,
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
    CONVERSATION_MESSAGES: `${API_PREFIX}/messages/conversations/:id/messages`,
  },
  FAVORITES: {
    BASE: `${API_PREFIX}/favorites`,
    BY_PROPERTY: `${API_PREFIX}/favorites/:propertyId`,
  },
  UPLOADS: {
    PHOTOS: `${API_PREFIX}/uploads/photos`,
  },
  ADMIN: {
    BASE: `${API_PREFIX}/admin`,
    DASHBOARD: `${API_PREFIX}/admin/dashboard`,
    USERS: `${API_PREFIX}/admin/users`,
    USER_BY_ID: `${API_PREFIX}/admin/users/:id`,
    PROPERTIES: `${API_PREFIX}/admin/properties`,
    MATCHES: `${API_PREFIX}/admin/matches`,
    SWIPES: `${API_PREFIX}/admin/swipes`,
    SWIPE_STATS: `${API_PREFIX}/admin/swipes/stats`,
    CONVERSATIONS: `${API_PREFIX}/admin/conversations`,
    CONVERSATION_BY_ID: `${API_PREFIX}/admin/conversations/:id`,
    METRICS_SUMMARY: `${API_PREFIX}/admin/metrics/summary`,
    METRICS_PROMETHEUS: `${API_PREFIX}/admin/metrics/prometheus`,
  },
} as const;
