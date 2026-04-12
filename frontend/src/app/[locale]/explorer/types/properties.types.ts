export interface PropertyOwner {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  verified: boolean | null;
  city: string | null;
  profession: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string | null;
  property_type: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  surface_area: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  monthly_rent: number | null;
  deposit: number | null;
  furnished: boolean | null;
  pets_allowed: boolean | null;
  smoking_allowed: boolean | null;
  utilities_included: boolean | null;
  photos: string[];
  photo_paths: string[];
  cover_image: string | null;
  cover_path: string | null;
  amenities: string[];
  available_from: string | null;
  available_until: string | null;
  created_at: string | null;
  owner: PropertyOwner;
}

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

export interface PropertiesFilters {
  page?: number;
  limit?: number;
  city?: string;
  q?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_surface?: number;
  furnished?: boolean;
}

export interface FeedCategory {
  slug: string;
  title_key: string;
  properties: Property[];
  total: number;
  personalized: boolean;
  city?: string;
}

export interface FeedResponse {
  categories: FeedCategory[];
}

export interface CategoryPageResponse {
  slug: string;
  title_key: string;
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  city?: string;
}
