export interface FavoriteProperty {
  id: string;
  title: string;
  city: string | null;
  district: string | null;
  surface_area: number | null;
  rooms: number | null;
  monthly_rent: number | null;
  cover_image: string | null;
  photos: string[];
  owner: {
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    user_id: string;
  };
}

export interface FavoriteItem {
  id: string;
  property_id: string;
  created_at: string | null;
  property: FavoriteProperty;
}
