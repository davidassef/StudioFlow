import { apiService } from './api';
import type {
  Studio,
  Room,
  StudioSearchParams,
  StudiosResponse,
  StudioFilters,
} from '../types';

export const studiosService = {
  /**
   * Lista todos os estúdios com filtros e paginação
   */
  getStudios: async (params?: StudioSearchParams): Promise<StudiosResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    
    // Filtros
    if (params?.filters) {
      const { filters } = params;
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.min_price) queryParams.append('min_price', filters.min_price.toString());
      if (filters.max_price) queryParams.append('max_price', filters.max_price.toString());
      if (filters.capacity) queryParams.append('capacity', filters.capacity.toString());
      if (filters.rating) queryParams.append('rating', filters.rating.toString());
      if (filters.availability_date) queryParams.append('availability_date', filters.availability_date);
      if (filters.equipment?.length) {
        filters.equipment.forEach(eq => queryParams.append('equipment', eq));
      }
    }
    
    const url = `/studios/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiService.get<StudiosResponse>(url);
  },

  /**
   * Obtém detalhes de um estúdio específico
   */
  getStudio: async (id: number): Promise<Studio> => {
    return await apiService.get<Studio>(`/studios/${id}/`);
  },

  /**
   * Cria um novo estúdio (apenas para prestadores)
   */
  createStudio: async (data: Omit<Studio, 'id' | 'created_at' | 'updated_at' | 'rooms' | 'images'>): Promise<Studio> => {
    return await apiService.post<Studio>('/studios/', data);
  },

  /**
   * Atualiza um estúdio existente
   */
  updateStudio: async (id: number, data: Partial<Studio>): Promise<Studio> => {
    return await apiService.patch<Studio>(`/studios/${id}/`, data);
  },

  /**
   * Deleta um estúdio
   */
  deleteStudio: async (id: number): Promise<void> => {
    await apiService.delete(`/studios/${id}/`);
  },

  /**
   * Obtém salas de um estúdio
   */
  getStudioRooms: async (studioId: number): Promise<Room[]> => {
    return await apiService.get<Room[]>(`/studios/${studioId}/rooms/`);
  },

  /**
   * Obtém detalhes de uma sala específica
   */
  getRoom: async (roomId: number): Promise<Room> => {
    return await apiService.get<Room>(`/rooms/${roomId}/`);
  },

  /**
   * Cria uma nova sala
   */
  createRoom: async (data: Omit<Room, 'id' | 'created_at' | 'updated_at' | 'images'>): Promise<Room> => {
    return await apiService.post<Room>('/rooms/', data);
  },

  /**
   * Atualiza uma sala existente
   */
  updateRoom: async (id: number, data: Partial<Room>): Promise<Room> => {
    return await apiService.patch<Room>(`/rooms/${id}/`, data);
  },

  /**
   * Deleta uma sala
   */
  deleteRoom: async (id: number): Promise<void> => {
    await apiService.delete(`/rooms/${id}/`);
  },

  /**
   * Upload de imagem para estúdio
   */
  uploadStudioImage: async (studioId: number, file: File, isPrimary = false): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('is_primary', isPrimary.toString());
    
    return await apiService.post(`/studios/${studioId}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Upload de imagem para sala
   */
  uploadRoomImage: async (roomId: number, file: File, isPrimary = false): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('is_primary', isPrimary.toString());
    
    return await apiService.post(`/rooms/${roomId}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Remove imagem do estúdio
   */
  deleteStudioImage: async (studioId: number, imageId: number): Promise<void> => {
    await apiService.delete(`/studios/${studioId}/images/${imageId}/`);
  },

  /**
   * Remove imagem da sala
   */
  deleteRoomImage: async (roomId: number, imageId: number): Promise<void> => {
    await apiService.delete(`/rooms/${roomId}/images/${imageId}/`);
  },

  /**
   * Busca estúdios por localização
   */
  searchByLocation: async (lat: number, lng: number, radius = 10): Promise<Studio[]> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
    });
    
    return await apiService.get<Studio[]>(`/studios/nearby/?${params.toString()}`);
  },

  /**
   * Obtém estúdios favoritos do usuário
   */
  getFavoriteStudios: async (): Promise<Studio[]> => {
    return await apiService.get<Studio[]>('/studios/favorites/');
  },

  /**
   * Adiciona estúdio aos favoritos
   */
  addToFavorites: async (studioId: number): Promise<void> => {
    await apiService.post(`/studios/${studioId}/favorite/`);
  },

  /**
   * Remove estúdio dos favoritos
   */
  removeFromFavorites: async (studioId: number): Promise<void> => {
    await apiService.delete(`/studios/${studioId}/favorite/`);
  },
};

export default studiosService;