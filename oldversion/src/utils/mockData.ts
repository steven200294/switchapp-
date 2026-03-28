
export const mockUser = {
  id: "user-1",
  email: "demo@switchappart.com",
  full_name: "Alex Martin",
  phone: "06 12 34 56 78",
  avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
  bio: "Passionné de design et d'architecture. Je cherche un échange sur Paris pour 6 mois.",
  profession: "Architecte d'intérieur",
  credits: 150,
  is_premium: true,
  preferences: {
    cities: ["Paris", "Lyon"],
    min_price: 800,
    max_price: 2500,
    min_surface: 30
  }
};

export const mockProperties = [
  {
    id: "paris-1",
    user_id: "user-2",
    title: "Appartement moderne Châtelet",
    description: "Magnifique appartement rénové au coeur de Paris. Vue imprenable sur la Seine.",
    location: "1er arrondissement, Paris",
    price: 2800,
    surface: 65,
    rooms: 3,
    type: "apartment",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "elevator", "balcony"],
    available_from: "2023-12-01",
    lat: 48.8566,
    lng: 2.3477,
    category: "new",
    owner: {
      name: "Sophie D.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  },
  {
    id: "paris-2",
    user_id: "user-3",
    title: "Studio République",
    description: "Studio cosy idéal pour étudiant ou jeune actif. Proche tous commerces.",
    location: "11ème arrondissement, Paris",
    price: 1400,
    surface: 25,
    rooms: 1,
    type: "studio",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771753037-638c2943b419?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi"],
    available_from: "2023-11-15",
    lat: 48.8676,
    lng: 2.3639,
    category: "nearby",
    owner: {
      name: "Thomas L.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  },
  {
    id: "paris-3",
    user_id: "user-4",
    title: "Loft Bastille",
    description: "Grand loft lumineux style industriel. Parfait pour couple.",
    location: "12ème arrondissement, Paris",
    price: 2200,
    surface: 80,
    rooms: 2,
    type: "loft",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "parking", "ac"],
    available_from: "2024-01-01",
    lat: 48.8532,
    lng: 2.3691,
    category: "available-now",
    owner: {
      name: "Marie C.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  }
];

export const mockMatches = [
  {
    id: "match-1",
    property_id: "paris-1",
    user_id: "user-1",
    matched_at: "2023-10-15T10:30:00Z",
    property: mockProperties[0],
    status: "active"
  },
  {
    id: "match-2",
    property_id: "paris-3",
    user_id: "user-1",
    matched_at: "2023-10-18T14:20:00Z",
    property: mockProperties[2],
    status: "pending"
  }
];

export const mockConversations = [
  {
    id: "conv-1",
    match_id: "match-1",
    participants: ["user-1", "user-2"],
    last_message: {
      content: "Bonjour, votre appartement est-il toujours disponible ?",
      sent_at: "2023-10-20T09:15:00Z",
      sender_id: "user-1"
    },
    other_user: {
      id: "user-2",
      name: "Sophie D.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    property_title: "Appartement moderne Châtelet"
  }
];

export const mockMessages = [
  {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "user-1",
    content: "Bonjour, votre appartement est-il toujours disponible ?",
    created_at: "2023-10-20T09:15:00Z",
    is_read: true
  },
  {
    id: "msg-2",
    conversation_id: "conv-1",
    sender_id: "user-2",
    content: "Oui tout à fait ! Quand souhaitez-vous le visiter ?",
    created_at: "2023-10-20T10:30:00Z",
    is_read: false
  }
];
