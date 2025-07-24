export interface Studio {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  instagram?: string;
  owner: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  rooms: Room[];
  images: StudioImage[];
  rating?: number;
  total_reviews?: number;
}

export interface Room {
  id: number;
  studio: number;
  name: string;
  description: string;
  capacity: number;
  hourly_rate: string;
  equipment: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
  images: RoomImage[];
}

export interface StudioImage {
  id: number;
  studio: number;
  image: string;
  alt_text?: string;
  is_primary: boolean;
  created_at: string;
}

export interface RoomImage {
  id: number;
  room: number;
  image: string;
  alt_text?: string;
  is_primary: boolean;
  created_at: string;
}

export interface StudioFilters {
  search?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  capacity?: number;
  equipment?: string[];
  rating?: number;
  availability_date?: string;
}

export interface StudioSearchParams {
  page?: number;
  limit?: number;
  filters?: StudioFilters;
  sort_by?: 'name' | 'rating' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface StudiosResponse {
  results: Studio[];
  count: number;
  next: string | null;
  previous: string | null;
}