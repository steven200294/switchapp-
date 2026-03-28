# 🗄️ Configuration de la Base de Données SwitchAppart

## Architecture

SwitchAppart utilise une architecture three-tier avec Supabase :
- **Frontend** (React) → **Server** (Hono) → **Database** (Supabase KV Store)

## Structure des Données

### 1. Utilisateurs (`user_profile:{user_id}`)

```typescript
{
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  profession?: string;
  bio?: string;
  avatar_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}
```

### 2. Propriétés (`property:{property_id}`)

```typescript
{
  id: string;
  owner_id: string;
  title: string;
  description: string;
  property_type: 'apartment' | 'house' | 'studio' | 'loft' | 'duplex';
  address: string;
  city: string;
  postal_code: string;
  country: string;
  surface_area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  monthly_rent: number;
  photos: string[];
  furnished: boolean;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  status: 'draft' | 'published' | 'unavailable' | 'exchanged';
  created_at: string;
  updated_at: string;
}
```

### 3. Matches (`match:{match_id}`)

```typescript
{
  id: string;
  user1_id: string;
  user2_id: string;
  property1_id: string;
  property2_id: string;
  compatibility_score: number;
  match_factors: string[];
  status: 'potential' | 'interested' | 'negotiating' | 'agreed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
```

### 4. Conversations (`conversation:{conversation_id}`)

```typescript
{
  id: string;
  user1_id: string;
  user2_id: string;
  match_id?: string;
  property_title: string;
  created_at: string;
  updated_at: string;
}
```

### 5. Messages (`conversation_messages:{conversation_id}:{message_id}`)

```typescript
{
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  created_at: string;
}
```

### 6. Favoris (`user_favorites:{user_id}:{property_id}`)

```typescript
{
  property_id: string;
  added_at: string;
}
```

### 7. SwitchPass (`switchpass:{user_id}`)

```typescript
{
  balance: number;
  transactions: Array<{
    id: string;
    type: 'purchase' | 'use' | 'earn';
    amount: number;
    price?: number;
    property_id?: string;
    created_at: string;
  }>;
}
```

### 8. Historique de recherche (`search_history:{user_id}`)

```typescript
string[] // Array de requêtes de recherche
```

## API Endpoints

### Authentification

- `POST /make-server-515d6ac6/signup` - Créer un compte
- `POST /make-server-515d6ac6/signin` - Se connecter

### Profil

- `GET /make-server-515d6ac6/profile` - Obtenir le profil
- `PUT /make-server-515d6ac6/profile` - Mettre à jour le profil

### Propriétés

- `POST /make-server-515d6ac6/properties` - Créer une propriété
- `GET /make-server-515d6ac6/properties/search` - Rechercher des propriétés

### Matches

- `POST /make-server-515d6ac6/matches` - Créer un match
- `GET /make-server-515d6ac6/matches` - Obtenir les matches

### Favoris

- `POST /make-server-515d6ac6/favorites` - Ajouter un favori
- `DELETE /make-server-515d6ac6/favorites/:property_id` - Supprimer un favori
- `GET /make-server-515d6ac6/favorites` - Obtenir les favoris

### Conversations

- `POST /make-server-515d6ac6/conversations` - Créer une conversation
- `GET /make-server-515d6ac6/conversations` - Obtenir les conversations

### Messages

- `POST /make-server-515d6ac6/messages` - Envoyer un message
- `GET /make-server-515d6ac6/messages/:conversation_id` - Obtenir les messages

### SwitchPass

- `GET /make-server-515d6ac6/switchpass` - Obtenir le solde
- `POST /make-server-515d6ac6/switchpass/purchase` - Acheter des SwitchPass
- `POST /make-server-515d6ac6/switchpass/use` - Utiliser un SwitchPass

### Historique de recherche

- `POST /make-server-515d6ac6/search-history` - Ajouter une recherche
- `GET /make-server-515d6ac6/search-history` - Obtenir l'historique

### Upload

- `POST /make-server-515d6ac6/upload` - Upload de fichiers (avatar, photos, documents)

## Stockage de Fichiers

Trois buckets Supabase Storage sont créés automatiquement :

1. `make-515d6ac6-user-avatars` - Avatars utilisateurs
2. `make-515d6ac6-property-photos` - Photos de propriétés
3. `make-515d6ac6-documents` - Documents (pièces d'identité, baux, etc.)

Tous les buckets sont privés et les fichiers sont accessibles via des URLs signées.

## Utilisation dans le Frontend

```typescript
import { authApi, profileApi, propertyApi, /* ... */ } from './utils/api';

// Inscription
const response = await authApi.signup({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe'
});

// Connexion
const { user, access_token } = await authApi.signin({
  email: 'user@example.com',
  password: 'password123'
});

// Mise à jour du profil
await profileApi.update(access_token, {
  full_name: 'Jane Doe',
  bio: 'Nouvelle bio'
});

// Ajouter un favori
await favoritesApi.add(access_token, 'property-123');
```

## Sécurité

- Toutes les routes protégées requièrent un JWT valide dans le header `Authorization: Bearer <token>`
- Les tokens sont générés par Supabase Auth lors de l'inscription/connexion
- Les buckets de stockage sont privés avec URLs signées valables 1 an
- La SUPABASE_SERVICE_ROLE_KEY reste côté serveur et n'est jamais exposée au frontend

## Notes

- Le KV Store Supabase est utilisé comme base de données flexible pour le prototypage
- Les échanges sont désormais permanents (plus de durée temporaire)
- Le système SwitchPass permet d'acheter l'accès à la plateforme pour 99€ par pass
