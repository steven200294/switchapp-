import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-515d6ac6`;

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string;
}

async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Identifier spécifiquement les erreurs JWT
      if (response.status === 401 && data.message === 'Invalid JWT') {
        console.error(`JWT invalide pour ${endpoint} - reconnexion requise`);
        throw new Error('JWT_INVALID');
      }
      console.error(`API Error on ${endpoint}:`, data);
      throw new Error(data.error || data.message || 'Erreur API');
    }

    return data;
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Auth APIs
export const authApi = {
  signup: async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    date_of_birth?: string;
    profession?: string;
    bio?: string;
    avatar?: File;
  }) => {
    // Créer le compte d'abord
    const { avatar, ...userDataWithoutAvatar } = userData;
    const signupResponse = await apiRequest('/signup', { 
      method: 'POST', 
      body: userDataWithoutAvatar
    });
    
    // Si l'inscription réussit et qu'un avatar est fourni, l'uploader
    if (signupResponse.success && signupResponse.user?.access_token && avatar) {
      try {
        // Upload l'avatar avec le token
        const uploadResult = await uploadApi.uploadFile(
          signupResponse.user.access_token,
          avatar,
          'avatar'
        );
        
        if (uploadResult.success && uploadResult.url) {
          // Mettre à jour le profil avec l'URL de l'avatar
          await profileApi.update(signupResponse.user.access_token, {
            avatar_url: uploadResult.url
          });
          signupResponse.user.avatar = uploadResult.url;
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'avatar:', error);
        // L'inscription a réussi, mais pas l'upload - ce n'est pas grave
      }
    }
    
    return signupResponse;
  },

  signin: (credentials: { email: string; password: string }) =>
    apiRequest('/signin', { method: 'POST', body: credentials }),
};

// Profile APIs
export const profileApi = {
  get: (token: string) => apiRequest('/profile', { token }),

  update: (token: string, profileData: any) =>
    apiRequest('/profile', { method: 'PUT', body: profileData, token }),
};

// Property APIs
export const propertyApi = {
  create: (token: string, propertyData: any) =>
    apiRequest('/properties', { method: 'POST', body: propertyData, token }),

  search: (params: {
    q?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const queryString = queryParams.toString();
    return apiRequest(`/properties/search${queryString ? `?${queryString}` : ''}`);
  },
};

// Match APIs
export const matchApi = {
  create: (token: string, data: { property_id: string; interested: boolean }) =>
    apiRequest('/matches', { method: 'POST', body: data, token }),

  getAll: (token: string) => apiRequest('/matches', { token }),
};

// Favorites APIs
export const favoritesApi = {
  add: (token: string, property_id: string) =>
    apiRequest('/favorites', { method: 'POST', body: { property_id }, token }),

  remove: (token: string, property_id: string) =>
    apiRequest(`/favorites/${property_id}`, { method: 'DELETE', token }),

  getAll: (token: string) => apiRequest('/favorites', { token }),
};

// Conversation APIs
export const conversationApi = {
  create: (token: string, data: {
    other_user_id: string;
    match_id?: string;
    property_title?: string;
  }) => apiRequest('/conversations', { method: 'POST', body: data, token }),

  getAll: (token: string) => apiRequest('/conversations', { token }),
};

// Message APIs
export const messageApi = {
  send: (token: string, data: {
    conversation_id: string;
    content: string;
    type?: string;
  }) => apiRequest('/messages', { method: 'POST', body: data, token }),

  get: (token: string, conversation_id: string) =>
    apiRequest(`/messages/${conversation_id}`, { token }),
};

// SwitchPass APIs
export const switchPassApi = {
  get: (token: string) => apiRequest('/switchpass', { token }),

  purchase: (token: string, amount: number) =>
    apiRequest('/switchpass/purchase', { method: 'POST', body: { amount }, token }),

  use: (token: string, property_id: string) =>
    apiRequest('/switchpass/use', { method: 'POST', body: { property_id }, token }),
};

// Search History APIs
export const searchHistoryApi = {
  add: (token: string, query: string) =>
    apiRequest('/search-history', { method: 'POST', body: { query }, token }),

  getAll: (token: string) => apiRequest('/search-history', { token }),
};

// Upload API
export const uploadApi = {
  uploadFile: async (token: string, file: File, type: 'avatar' | 'property' | 'document') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Upload error:', data);
      throw new Error(data.error || 'Erreur lors de l\'upload');
    }

    return data;
  }
};
