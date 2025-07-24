import { create } from 'zustand';
import { studiosService } from '../services';
import type {
  Studio,
  Room,
  StudioFilters,
  StudioSearchParams,
  StudiosResponse,
} from '../types';

interface StudiosState {
  // Data
  studios: Studio[];
  selectedStudio: Studio | null;
  favoriteStudios: Studio[];
  rooms: Room[];
  
  // UI State
  isLoading: boolean;
  isLoadingStudio: boolean;
  isLoadingRooms: boolean;
  error: string | null;
  
  // Filters and pagination
  filters: StudioFilters;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface StudiosActions {
  // Studios
  fetchStudios: (params?: StudioSearchParams) => Promise<void>;
  fetchStudio: (id: number) => Promise<void>;
  createStudio: (data: Omit<Studio, 'id' | 'created_at' | 'updated_at' | 'rooms' | 'images'>) => Promise<Studio>;
  updateStudio: (id: number, data: Partial<Studio>) => Promise<void>;
  deleteStudio: (id: number) => Promise<void>;
  
  // Rooms
  fetchRooms: (studioId: number) => Promise<void>;
  fetchRoom: (roomId: number) => Promise<Room>;
  createRoom: (data: Omit<Room, 'id' | 'created_at' | 'updated_at' | 'images'>) => Promise<Room>;
  updateRoom: (id: number, data: Partial<Room>) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
  
  // Favorites
  fetchFavorites: () => Promise<void>;
  addToFavorites: (studioId: number) => Promise<void>;
  removeFromFavorites: (studioId: number) => Promise<void>;
  isFavorite: (studioId: number) => boolean;
  
  // Filters and search
  setFilters: (filters: Partial<StudioFilters>) => void;
  clearFilters: () => void;
  searchStudios: (searchTerm: string) => Promise<void>;
  
  // UI actions
  setSelectedStudio: (studio: Studio | null) => void;
  clearError: () => void;
  resetState: () => void;
}

type StudiosStore = StudiosState & StudiosActions;

const initialState: StudiosState = {
  studios: [],
  selectedStudio: null,
  favoriteStudios: [],
  rooms: [],
  isLoading: false,
  isLoadingStudio: false,
  isLoadingRooms: false,
  error: null,
  filters: {},
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useStudiosStore = create<StudiosStore>((set, get) => ({
  ...initialState,

  // Studios actions
  fetchStudios: async (params?: StudioSearchParams) => {
    set({ isLoading: true, error: null });
    try {
      const response: StudiosResponse = await studiosService.getStudios(params);
      
      set({
        studios: response.results,
        totalCount: response.count,
        currentPage: params?.page || 1,
        hasNextPage: !!response.next,
        hasPreviousPage: !!response.previous,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar estúdios',
        isLoading: false,
      });
    }
  },

  fetchStudio: async (id: number) => {
    set({ isLoadingStudio: true, error: null });
    try {
      const studio = await studiosService.getStudio(id);
      set({
        selectedStudio: studio,
        isLoadingStudio: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar estúdio',
        isLoadingStudio: false,
      });
    }
  },

  createStudio: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const studio = await studiosService.createStudio(data);
      set((state) => ({
        studios: [studio, ...state.studios],
        isLoading: false,
      }));
      return studio;
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao criar estúdio',
        isLoading: false,
      });
      throw error;
    }
  },

  updateStudio: async (id: number, data: Partial<Studio>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedStudio = await studiosService.updateStudio(id, data);
      set((state) => ({
        studios: state.studios.map(studio => 
          studio.id === id ? updatedStudio : studio
        ),
        selectedStudio: state.selectedStudio?.id === id ? updatedStudio : state.selectedStudio,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao atualizar estúdio',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteStudio: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await studiosService.deleteStudio(id);
      set((state) => ({
        studios: state.studios.filter(studio => studio.id !== id),
        selectedStudio: state.selectedStudio?.id === id ? null : state.selectedStudio,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao deletar estúdio',
        isLoading: false,
      });
      throw error;
    }
  },

  // Rooms actions
  fetchRooms: async (studioId: number) => {
    set({ isLoadingRooms: true, error: null });
    try {
      const rooms = await studiosService.getStudioRooms(studioId);
      set({
        rooms,
        isLoadingRooms: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao carregar salas',
        isLoadingRooms: false,
      });
    }
  },

  fetchRoom: async (roomId: number) => {
    try {
      const room = await studiosService.getRoom(roomId);
      return room;
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar sala' });
      throw error;
    }
  },

  createRoom: async (data) => {
    set({ isLoadingRooms: true, error: null });
    try {
      const room = await studiosService.createRoom(data);
      set((state) => ({
        rooms: [room, ...state.rooms],
        isLoadingRooms: false,
      }));
      return room;
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao criar sala',
        isLoadingRooms: false,
      });
      throw error;
    }
  },

  updateRoom: async (id: number, data: Partial<Room>) => {
    set({ isLoadingRooms: true, error: null });
    try {
      const updatedRoom = await studiosService.updateRoom(id, data);
      set((state) => ({
        rooms: state.rooms.map(room => 
          room.id === id ? updatedRoom : room
        ),
        isLoadingRooms: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao atualizar sala',
        isLoadingRooms: false,
      });
      throw error;
    }
  },

  deleteRoom: async (id: number) => {
    set({ isLoadingRooms: true, error: null });
    try {
      await studiosService.deleteRoom(id);
      set((state) => ({
        rooms: state.rooms.filter(room => room.id !== id),
        isLoadingRooms: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Erro ao deletar sala',
        isLoadingRooms: false,
      });
      throw error;
    }
  },

  // Favorites actions
  fetchFavorites: async () => {
    try {
      const favorites = await studiosService.getFavoriteStudios();
      set({ favoriteStudios: favorites });
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar favoritos' });
    }
  },

  addToFavorites: async (studioId: number) => {
    try {
      await studiosService.addToFavorites(studioId);
      const studio = get().studios.find(s => s.id === studioId);
      if (studio) {
        set((state) => ({
          favoriteStudios: [...state.favoriteStudios, studio],
        }));
      }
    } catch (error: any) {
      set({ error: error.message || 'Erro ao adicionar aos favoritos' });
      throw error;
    }
  },

  removeFromFavorites: async (studioId: number) => {
    try {
      await studiosService.removeFromFavorites(studioId);
      set((state) => ({
        favoriteStudios: state.favoriteStudios.filter(s => s.id !== studioId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Erro ao remover dos favoritos' });
      throw error;
    }
  },

  isFavorite: (studioId: number) => {
    return get().favoriteStudios.some(studio => studio.id === studioId);
  },

  // Filters and search
  setFilters: (newFilters: Partial<StudioFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  searchStudios: async (searchTerm: string) => {
    const { fetchStudios } = get();
    await fetchStudios({
      filters: { search: searchTerm },
      page: 1,
    });
  },

  // UI actions
  setSelectedStudio: (studio: Studio | null) => {
    set({ selectedStudio: studio });
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },
}));

// Selectors
export const useStudios = () => useStudiosStore((state) => state.studios);
export const useSelectedStudio = () => useStudiosStore((state) => state.selectedStudio);
export const useFavoriteStudios = () => useStudiosStore((state) => state.favoriteStudios);
export const useRooms = () => useStudiosStore((state) => state.rooms);
export const useStudiosLoading = () => useStudiosStore((state) => state.isLoading);
export const useStudiosError = () => useStudiosStore((state) => state.error);
export const useStudioFilters = () => useStudiosStore((state) => state.filters);