export const API_PREFIX = "/api/v1";

export const ROUTES = {
  HEALTH: `${API_PREFIX}/health`,
  AUTH: {
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    ME: `${API_PREFIX}/auth/me`,
  },
  USERS: `${API_PREFIX}/users`,
  PROPERTIES: `${API_PREFIX}/properties`,
  SWIPE: `${API_PREFIX}/swipe`,
  MATCHES: `${API_PREFIX}/matches`,
  MESSAGES: `${API_PREFIX}/messages`,
} as const;
