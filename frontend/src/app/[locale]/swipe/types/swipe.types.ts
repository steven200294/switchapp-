export interface PropertyOwner {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  verified: boolean | null;
  city: string | null;
}

export interface DeckProperty {
  id: string;
  title: string;
  description: string | null;
  property_type: string | null;
  city: string | null;
  district: string | null;
  surface_area: number | null;
  rooms: number | null;
  bedrooms: number | null;
  monthly_rent: number | null;
  photos: string[];
  cover_image: string | null;
  amenities: string[];
  furnished: boolean | null;
  pets_allowed: boolean | null;
  owner: PropertyOwner;
}

export interface SwipeResult {
  swipe: { id: string };
  matched: boolean;
  match?: { id: string };
  conversationId?: string;
}
