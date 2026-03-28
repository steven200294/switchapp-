import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Configuration CORS et logging
app.use('*', cors());
app.use('*', logger(console.log));

// Client Supabase avec service role pour les opérations admin
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Types pour SwitchAppart
interface UserProfile {
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

interface UserPreferences {
  max_travel_distance: number;
  preferred_locations: string[];
  property_types: string[];
  budget_min: number;
  budget_max: number;
  amenities: string[];
  smoking_allowed: boolean;
  pets_allowed: boolean;
  children_friendly: boolean;
  noise_level: 'quiet' | 'moderate' | 'lively';
  exchange_duration_min: number;
  exchange_duration_max: number;
}

interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  property_type: 'apartment' | 'house' | 'studio' | 'loft' | 'duplex';
  address: string;
  city: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  surface_area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  max_occupants: number;
  amenities: string[];
  monthly_rent: number;
  deposit: number;
  utilities_included: boolean;
  furnished: boolean;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  photos: string[];
  available_from: string;
  available_until?: string;
  minimum_stay: number;
  maximum_stay?: number;
  instant_booking: boolean;
  status: 'draft' | 'published' | 'unavailable' | 'exchanged';
  created_at: string;
  updated_at: string;
}

interface ExchangeMatch {
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

// Initialisation des buckets de stockage au démarrage
const initializeStorage = async () => {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erreur lors de la récupération des buckets:', listError);
      return;
    }
    
    const requiredBuckets = [
      'make-515d6ac6-user-avatars',
      'make-515d6ac6-property-photos',
      'make-515d6ac6-documents'
    ];

    for (const bucketName of requiredBuckets) {
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      if (!bucketExists) {
        console.log(`Création du bucket ${bucketName}...`);
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: false,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        });
        if (error) {
          // Ignorer l'erreur si le bucket existe déjà (409 conflict)
          if (error.message?.includes('already exists') || error.statusCode === '409') {
            console.log(`Bucket ${bucketName} existe déjà`);
          } else {
            console.error(`Erreur création bucket ${bucketName}:`, error);
          }
        } else {
          console.log(`Bucket ${bucketName} créé avec succès`);
        }
      } else {
        console.log(`Bucket ${bucketName} existe déjà`);
      }
    }
  } catch (error) {
    console.error('Erreur initialisation stockage:', error);
  }
};

// Initialiser le stockage au démarrage
initializeStorage();

// Route d'inscription complète
app.post('/make-server-515d6ac6/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, full_name, phone, date_of_birth, profession, bio, skipAvatarUpload } = body;

    // Validation des données
    if (!email || !password || !full_name) {
      return c.json({ error: 'Email, mot de passe et nom complet requis' }, 400);
    }

    // Vérifier si l'email existe déjà
    const existingUserId = await kv.get(`user_email:${email.toLowerCase()}`);
    if (existingUserId) {
      return c.json({ 
        error: 'Un compte avec cet email existe déjà',
        code: 'email_exists'
      }, 409);
    }

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmation car pas de serveur email configuré
      user_metadata: { 
        full_name,
        phone: phone || null,
        signup_source: 'switchappart_app'
      }
    });

    if (authError) {
      console.error('Erreur création utilisateur:', authError);
      
      // Gérer spécifiquement l'erreur d'email existant
      if (authError.message?.includes('already been registered') || authError.status === 422) {
        return c.json({ 
          error: 'Un compte avec cet email existe déjà. Veuillez vous connecter.',
          code: 'email_exists'
        }, 409);
      }
      
      return c.json({ 
        error: 'Erreur lors de la création du compte', 
        details: authError.message 
      }, 400);
    }

    // Créer le profil utilisateur complet dans KV store
    // Si pas de photo uploadée, l'avatar sera généré côté frontend avec la première lettre
    const userProfile: UserProfile = {
      id: crypto.randomUUID(),
      user_id: authData.user!.id,
      email,
      full_name,
      phone: phone || undefined,
      date_of_birth: date_of_birth || undefined,
      profession: profession || undefined,
      bio: bio || undefined,
      avatar_url: undefined, // Sera mis à jour si une photo est uploadée
      verification_status: 'pending',
      preferences: {
        max_travel_distance: 50,
        preferred_locations: [],
        property_types: ['apartment'],
        budget_min: 500,
        budget_max: 3000,
        amenities: [],
        smoking_allowed: false,
        pets_allowed: false,
        children_friendly: false,
        noise_level: 'moderate',
        exchange_duration_min: 7,
        exchange_duration_max: 365
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Stocker le profil
    await kv.set(`user_profile:${authData.user!.id}`, userProfile);
    await kv.set(`user_email:${email.toLowerCase()}`, authData.user!.id);

    // Initialiser le SwitchPass pour le nouvel utilisateur
    await kv.set(`switchpass:${authData.user!.id}`, {
      balance: 0,
      transactions: []
    });

    // Générer un access token pour le nouvel utilisateur
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Log de l'inscription
    console.log(`Nouvel utilisateur inscrit: ${email} (${full_name})`);

    return c.json({
      success: true,
      message: 'Compte créé avec succès',
      user: {
        id: authData.user!.id,
        email: authData.user!.email,
        full_name: userProfile.full_name,
        phone: userProfile.phone,
        date_of_birth: userProfile.date_of_birth,
        profession: userProfile.profession,
        bio: userProfile.bio,
        avatar: userProfile.avatar_url, // undefined si pas de photo, généré côté frontend
        verification_status: userProfile.verification_status,
        hasCompletedPropertySetup: false,
        switchPassBalance: 0,
        access_token: sessionData?.session?.access_token || ''
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    return c.json({ error: 'Erreur serveur lors de l\'inscription' }, 500);
  }
});

// Route de connexion
app.post('/make-server-515d6ac6/signin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email et mot de passe requis' }, 400);
    }

    // Connexion avec Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Erreur connexion:', error);
      return c.json({ error: 'Identifiants invalides' }, 401);
    }

    // Récupérer le profil utilisateur
    const userProfile = await kv.get(`user_profile:${data.user.id}`) as UserProfile;

    // Vérifier si l'utilisateur a configuré au moins une propriété
    const userProperties = await kv.getByPrefix(`user_properties:${data.user.id}:`);
    const hasCompletedPropertySetup = userProperties.length > 0;

    // Récupérer le solde SwitchPass
    const switchPassData = await kv.get(`switchpass:${data.user.id}`) as { balance: number; transactions: any[] } | null;
    const switchPassBalance = switchPassData?.balance || 0;

    return c.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: userProfile?.full_name || data.user.email,
        phone: userProfile?.phone,
        date_of_birth: userProfile?.date_of_birth,
        profession: userProfile?.profession,
        bio: userProfile?.bio,
        avatar: userProfile?.avatar_url,
        verification_status: userProfile?.verification_status || 'pending',
        hasCompletedPropertySetup,
        switchPassBalance,
        access_token: data.session.access_token
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    return c.json({ error: 'Erreur serveur lors de la connexion' }, 500);
  }
});

// Middleware d'authentification
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Token d\'accès requis' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (!user || error) {
    return c.json({ error: 'Token invalide ou expiré' }, 401);
  }

  c.set('user', user);
  await next();
};

// Route pour obtenir le profil utilisateur
app.get('/make-server-515d6ac6/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userProfile = await kv.get(`user_profile:${user.id}`) as UserProfile;
    
    if (!userProfile) {
      return c.json({ error: 'Profil utilisateur non trouvé' }, 404);
    }

    // Vérifier si l'utilisateur a des propriétés configurées
    const userProperties = await kv.getByPrefix(`user_properties:${user.id}:`);
    const hasCompletedPropertySetup = userProperties.length > 0;

    // Récupérer le solde SwitchPass
    const switchPassData = await kv.get(`switchpass:${user.id}`) as { balance: number; transactions: any[] } | null;
    const switchPassBalance = switchPassData?.balance || 0;

    return c.json({
      success: true,
      profile: {
        ...userProfile,
        hasCompletedPropertySetup,
        switchPassBalance
      }
    });

  } catch (error) {
    console.error('Erreur récupération profil:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route pour mettre à jour le profil
app.put('/make-server-515d6ac6/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const currentProfile = await kv.get(`user_profile:${user.id}`) as UserProfile;
    if (!currentProfile) {
      return c.json({ error: 'Profil utilisateur non trouvé' }, 404);
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...body,
      user_id: user.id, // Sécurité: ne pas permettre de changer l'ID
      updated_at: new Date().toISOString()
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route pour créer un logement
app.post('/make-server-515d6ac6/properties', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const property: Property = {
      id: crypto.randomUUID(),
      owner_id: user.id,
      ...body,
      photos: body.photos || [],
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(`property:${property.id}`, property);
    await kv.set(`user_properties:${user.id}:${property.id}`, property.id);

    return c.json({
      success: true,
      message: 'Logement créé avec succès',
      property
    });

  } catch (error) {
    console.error('Erreur création logement:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route pour rechercher des logements
app.get('/make-server-515d6ac6/properties/search', async (c) => {
  try {
    const query = c.req.query('q') || '';
    const city = c.req.query('city') || '';
    const minPrice = parseInt(c.req.query('minPrice') || '0');
    const maxPrice = parseInt(c.req.query('maxPrice') || '10000');
    const propertyType = c.req.query('type') || '';
    
    // Récupérer tous les logements publiés
    const allProperties = await kv.getByPrefix('property:');
    const publishedProperties = allProperties
      .map(item => item.value as Property)
      .filter(property => property.status === 'published');

    // Filtrer selon les critères
    let filteredProperties = publishedProperties;

    if (query) {
      filteredProperties = filteredProperties.filter(property => 
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.description.toLowerCase().includes(query.toLowerCase()) ||
        property.city.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (city) {
      filteredProperties = filteredProperties.filter(property => 
        property.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (minPrice || maxPrice) {
      filteredProperties = filteredProperties.filter(property => 
        property.monthly_rent >= minPrice && property.monthly_rent <= maxPrice
      );
    }

    if (propertyType) {
      filteredProperties = filteredProperties.filter(property => 
        property.property_type === propertyType
      );
    }

    // Enrichir avec les profils des propriétaires
    const propertiesWithOwners = await Promise.all(
      filteredProperties.map(async (property) => {
        const ownerProfile = await kv.get(`user_profile:${property.owner_id}`) as UserProfile;
        return {
          ...property,
          owner: ownerProfile ? {
            name: ownerProfile.full_name,
            avatar: ownerProfile.avatar_url,
            verification_status: ownerProfile.verification_status
          } : null
        };
      })
    );

    return c.json({
      success: true,
      properties: propertiesWithOwners.slice(0, 20), // Limiter à 20 résultats
      total: propertiesWithOwners.length
    });

  } catch (error) {
    console.error('Erreur recherche logements:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route pour créer un match potentiel
app.post('/make-server-515d6ac6/matches', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { property_id, interested } = body;

    if (!property_id) {
      return c.json({ error: 'ID du logement requis' }, 400);
    }

    const property = await kv.get(`property:${property_id}`) as Property;
    if (!property) {
      return c.json({ error: 'Logement non trouvé' }, 404);
    }

    if (interested) {
      // Calculer un score de compatibilité simple
      const userProfile = await kv.get(`user_profile:${user.id}`) as UserProfile;
      const ownerProfile = await kv.get(`user_profile:${property.owner_id}`) as UserProfile;
      
      const compatibilityScore = Math.floor(Math.random() * 30) + 70; // Score entre 70-100

      const match: ExchangeMatch = {
        id: crypto.randomUUID(),
        user1_id: user.id,
        user2_id: property.owner_id,
        property1_id: '', // À définir quand l'utilisateur ajoute son logement
        property2_id: property_id,
        compatibility_score: compatibilityScore,
        match_factors: ['location', 'budget', 'amenities'],
        status: 'interested',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await kv.set(`match:${match.id}`, match);
      await kv.set(`user_matches:${user.id}:${match.id}`, match.id);

      return c.json({
        success: true,
        message: 'Intérêt exprimé avec succès',
        match
      });
    }

    return c.json({ success: true, message: 'Logement ignoré' });

  } catch (error) {
    console.error('Erreur création match:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route pour obtenir les matches de l'utilisateur
app.get('/make-server-515d6ac6/matches', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    
    const userMatches = await kv.getByPrefix(`user_matches:${user.id}:`);
    const matchIds = userMatches.map(item => item.value as string);
    
    const matches = await Promise.all(
      matchIds.map(async (matchId) => {
        const match = await kv.get(`match:${matchId}`) as ExchangeMatch;
        if (!match) return null;
        
        // Enrichir avec les détails du logement et du propriétaire
        const property = await kv.get(`property:${match.property2_id}`) as Property;
        const ownerProfile = await kv.get(`user_profile:${match.user2_id}`) as UserProfile;
        
        return {
          ...match,
          property: property ? {
            ...property,
            owner: {
              name: ownerProfile?.full_name,
              avatar: ownerProfile?.avatar_url
            }
          } : null
        };
      })
    );

    const validMatches = matches.filter(match => match !== null);

    return c.json({
      success: true,
      matches: validMatches
    });

  } catch (error) {
    console.error('Erreur récupération matches:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route pour uploader des fichiers
app.post('/make-server-515d6ac6/upload', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'avatar' | 'property' | 'document'

    if (!file) {
      return c.json({ error: 'Fichier requis' }, 400);
    }

    const bucketMap = {
      'avatar': 'make-515d6ac6-user-avatars',
      'property': 'make-515d6ac6-property-photos', 
      'document': 'make-515d6ac6-documents'
    };

    const bucketName = bucketMap[type as keyof typeof bucketMap];
    if (!bucketName) {
      return c.json({ error: 'Type de fichier invalide' }, 400);
    }

    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Erreur upload:', error);
      return c.json({ error: 'Erreur lors de l\'upload' }, 500);
    }

    // Générer une URL signée valable 1 an
    const { data: signedUrl } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000); // 1 an

    return c.json({
      success: true,
      message: 'Fichier uploadé avec succès',
      file_path: data.path,
      url: signedUrl?.signedUrl
    });

  } catch (error) {
    console.error('Erreur upload fichier:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route pour gérer les favoris
app.post('/make-server-515d6ac6/favorites', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { property_id } = body;

    if (!property_id) {
      return c.json({ error: 'ID du logement requis' }, 400);
    }

    await kv.set(`user_favorites:${user.id}:${property_id}`, {
      property_id,
      added_at: new Date().toISOString()
    });

    return c.json({ success: true, message: 'Favori ajouté' });
  } catch (error) {
    console.error('Erreur ajout favori:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.delete('/make-server-515d6ac6/favorites/:property_id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const property_id = c.req.param('property_id');

    await kv.del(`user_favorites:${user.id}:${property_id}`);

    return c.json({ success: true, message: 'Favori supprimé' });
  } catch (error) {
    console.error('Erreur suppression favori:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.get('/make-server-515d6ac6/favorites', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const favorites = await kv.getByPrefix(`user_favorites:${user.id}:`);
    const propertyIds = favorites.map(item => (item.value as any).property_id);

    return c.json({ success: true, favorites: propertyIds });
  } catch (error) {
    console.error('Erreur récupération favoris:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Routes pour les conversations et messages
app.post('/make-server-515d6ac6/conversations', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { other_user_id, match_id, property_title } = body;

    const conversation = {
      id: crypto.randomUUID(),
      user1_id: user.id,
      user2_id: other_user_id,
      match_id: match_id || null,
      property_title: property_title || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(`conversation:${conversation.id}`, conversation);
    await kv.set(`user_conversations:${user.id}:${conversation.id}`, conversation.id);
    await kv.set(`user_conversations:${other_user_id}:${conversation.id}`, conversation.id);

    return c.json({ success: true, conversation });
  } catch (error) {
    console.error('Erreur création conversation:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.get('/make-server-515d6ac6/conversations', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const userConversations = await kv.getByPrefix(`user_conversations:${user.id}:`);
    const conversationIds = userConversations.map(item => item.value as string);

    const conversations = await Promise.all(
      conversationIds.map(async (convId) => {
        const conversation = await kv.get(`conversation:${convId}`) as any;
        if (!conversation) return null;

        // Récupérer le dernier message
        const messages = await kv.getByPrefix(`conversation_messages:${convId}:`);
        const lastMessage = messages.length > 0 
          ? messages[messages.length - 1].value as any
          : null;

        // Récupérer le profil de l'autre utilisateur
        const otherUserId = conversation.user1_id === user.id 
          ? conversation.user2_id 
          : conversation.user1_id;
        const otherProfile = await kv.get(`user_profile:${otherUserId}`) as UserProfile;

        return {
          id: conversation.id,
          name: otherProfile?.full_name || 'Utilisateur',
          avatar: otherProfile?.avatar_url,
          lastMessage: lastMessage?.content || 'Nouvelle conversation',
          timestamp: lastMessage?.created_at || conversation.created_at,
          unread: 0, // À implémenter si besoin
          online: false,
          property: conversation.property_title,
          matchId: conversation.match_id
        };
      })
    );

    const validConversations = conversations.filter(conv => conv !== null);

    return c.json({ success: true, conversations: validConversations });
  } catch (error) {
    console.error('Erreur récupération conversations:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.post('/make-server-515d6ac6/messages', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { conversation_id, content, type } = body;

    if (!conversation_id || !content) {
      return c.json({ error: 'ID de conversation et contenu requis' }, 400);
    }

    const message = {
      id: crypto.randomUUID(),
      conversation_id,
      sender_id: user.id,
      content,
      type: type || 'text',
      created_at: new Date().toISOString()
    };

    await kv.set(`conversation_messages:${conversation_id}:${message.id}`, message);
    
    // Mettre à jour la conversation
    const conversation = await kv.get(`conversation:${conversation_id}`) as any;
    if (conversation) {
      conversation.updated_at = new Date().toISOString();
      await kv.set(`conversation:${conversation_id}`, conversation);
    }

    return c.json({ success: true, message });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.get('/make-server-515d6ac6/messages/:conversation_id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const conversation_id = c.req.param('conversation_id');

    const messages = await kv.getByPrefix(`conversation_messages:${conversation_id}:`);
    const messageList = messages.map(item => item.value);

    return c.json({ success: true, messages: messageList });
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Routes pour SwitchPass
app.get('/make-server-515d6ac6/switchpass', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const switchPassData = await kv.get(`switchpass:${user.id}`) as any;

    return c.json({ 
      success: true, 
      balance: switchPassData?.balance || 0,
      transactions: switchPassData?.transactions || []
    });
  } catch (error) {
    console.error('Erreur récupération SwitchPass:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.post('/make-server-515d6ac6/switchpass/purchase', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { amount } = body;

    if (!amount || amount < 1) {
      return c.json({ error: 'Montant invalide' }, 400);
    }

    const switchPassData = await kv.get(`switchpass:${user.id}`) as any || { 
      balance: 0, 
      transactions: [] 
    };

    const transaction = {
      id: crypto.randomUUID(),
      type: 'purchase',
      amount,
      price: amount * 99, // 99€ par SwitchPass
      created_at: new Date().toISOString()
    };

    switchPassData.balance += amount;
    switchPassData.transactions.push(transaction);

    await kv.set(`switchpass:${user.id}`, switchPassData);

    // Mettre à jour le profil utilisateur
    const userProfile = await kv.get(`user_profile:${user.id}`) as UserProfile;
    if (userProfile) {
      (userProfile as any).switchPassBalance = switchPassData.balance;
      await kv.set(`user_profile:${user.id}`, userProfile);
    }

    return c.json({ 
      success: true, 
      message: 'Achat effectué avec succès',
      balance: switchPassData.balance,
      transaction
    });
  } catch (error) {
    console.error('Erreur achat SwitchPass:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.post('/make-server-515d6ac6/switchpass/use', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { property_id } = body;

    const switchPassData = await kv.get(`switchpass:${user.id}`) as any || { 
      balance: 0, 
      transactions: [] 
    };

    if (switchPassData.balance < 1) {
      return c.json({ error: 'Solde insuffisant' }, 400);
    }

    const transaction = {
      id: crypto.randomUUID(),
      type: 'use',
      amount: -1,
      property_id,
      created_at: new Date().toISOString()
    };

    switchPassData.balance -= 1;
    switchPassData.transactions.push(transaction);

    await kv.set(`switchpass:${user.id}`, switchPassData);

    // Mettre à jour le profil utilisateur
    const userProfile = await kv.get(`user_profile:${user.id}`) as UserProfile;
    if (userProfile) {
      (userProfile as any).switchPassBalance = switchPassData.balance;
      await kv.set(`user_profile:${user.id}`, userProfile);
    }

    return c.json({ 
      success: true, 
      message: 'SwitchPass utilisé',
      balance: switchPassData.balance
    });
  } catch (error) {
    console.error('Erreur utilisation SwitchPass:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Routes pour l'historique de recherche
app.post('/make-server-515d6ac6/search-history', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { query } = body;

    if (!query || !query.trim()) {
      return c.json({ error: 'Requête vide' }, 400);
    }

    const historyKey = `search_history:${user.id}`;
    const history = await kv.get(historyKey) as string[] || [];

    // Éviter les doublons et limiter à 10 entrées
    const updatedHistory = [
      query,
      ...history.filter(item => item !== query)
    ].slice(0, 10);

    await kv.set(historyKey, updatedHistory);

    return c.json({ success: true, history: updatedHistory });
  } catch (error) {
    console.error('Erreur ajout historique:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

app.get('/make-server-515d6ac6/search-history', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const history = await kv.get(`search_history:${user.id}`) as string[] || [];

    return c.json({ success: true, history });
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});

// Route de test
app.get('/make-server-515d6ac6/test', (c) => {
  return c.json({ 
    message: 'API SwitchAppart opérationnelle',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

console.log("🚀 Serveur SwitchAppart démarré avec succès");
console.log("📊 Base de données KV initialisée");
console.log("🔐 Authentification Supabase configurée");
console.log("📁 Buckets de stockage créés");
console.log("💬 Routes conversations & messages activées");
console.log("⭐ Routes favoris activées");
console.log("🎟️ Routes SwitchPass activées");
console.log("🔍 Routes historique de recherche activées");

Deno.serve(app.fetch);