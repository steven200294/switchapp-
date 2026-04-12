export interface MyProperty {
  id: string;
  title: string;
  description: string | null;
  property_type: string | null;
  city: string | null;
  address: string | null;
  postal_code: string | null;
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
  status: string | null;
  published: boolean;
  completion: number;
  created_at: string | null;
  updated_at: string | null;
}
