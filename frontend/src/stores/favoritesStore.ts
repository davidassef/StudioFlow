import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Studio {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  rating: number;
  images: string[];
  equipment: string[];
  capacity: number;
  studioType: string;
  availability: boolean;
}

interface FavoritesState {
  favorites: Studio[];
  addToFavorites: (studio: Studio) => void;
  removeFromFavorites: (studioId: string) => void;
  isFavorite: (studioId: string) => boolean;
  clearFavorites: () => void;
  getFavoritesByType: (type: string) => Studio[];
  getFavoritesByLocation: (location: string) => Studio[];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (studio: Studio) => {
        const { favorites } = get();
        if (!favorites.find(fav => fav.id === studio.id)) {
          set({ favorites: [...favorites, studio] });
        }
      },

      removeFromFavorites: (studioId: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav.id !== studioId) });
      },

      isFavorite: (studioId: string) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === studioId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      getFavoritesByType: (type: string) => {
        const { favorites } = get();
        return favorites.filter(fav => fav.studioType === type);
      },

      getFavoritesByLocation: (location: string) => {
        const { favorites } = get();
        return favorites.filter(fav => 
          fav.location.toLowerCase().includes(location.toLowerCase())
        );
      },
    }),
    {
      name: 'studioflow-favorites',
      version: 1,
    }
  )
);