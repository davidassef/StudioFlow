// Tipos para componentes de mapas
export interface StudioLocation {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  endereco: string;
  preco_hora: number;
  capacidade: number;
  descricao?: string;
  telefone?: string;
  website?: string;
  is_disponivel?: boolean;
}

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface MapFilters {
  radius: number; // em km
  priceRange: {
    min: number;
    max: number;
  };
  capacity: number;
  availableOnly: boolean;
}

export interface MapViewport {
  center: MapCenter;
  zoom: number;
  bounds?: MapBounds;
}

// Configurações padrão do mapa
export const MAP_DEFAULTS = {
  center: {
    lat: -23.5505, // São Paulo
    lng: -46.6333
  },
  zoom: {
    initial: 12,
    min: 8,
    max: 20,
    userLocation: 15
  },
  bounds: {
    padding: 50 // pixels
  }
};

// Constantes para o Brasil
export const BRAZIL_BOUNDS = {
  north: 5.274,
  south: -33.751,
  east: -34.793,
  west: -73.982
};

// Cidades principais do Brasil para geocoding
export const MAJOR_CITIES = {
  'São Paulo': { lat: -23.5505, lng: -46.6333 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Belo Horizonte': { lat: -19.9191, lng: -43.9386 },
  'Salvador': { lat: -12.9714, lng: -38.5014 },
  'Brasília': { lat: -15.7942, lng: -47.8822 },
  'Curitiba': { lat: -25.4284, lng: -49.2733 },
  'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
  'Recife': { lat: -8.0476, lng: -34.8770 },
  'Fortaleza': { lat: -3.7319, lng: -38.5267 },
  'Manaus': { lat: -3.1190, lng: -60.0217 }
};