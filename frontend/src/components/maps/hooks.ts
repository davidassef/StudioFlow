import { useState, useEffect, useCallback } from 'react';
import { GeolocationPosition, MapCenter } from './types';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

interface UseGeolocationReturn {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
  watchId: number | null;
}

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutos
    watchPosition = false
  } = options;

  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const handleSuccess = useCallback((pos: globalThis.GeolocationPosition) => {
    const newPosition: GeolocationPosition = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy
    };

    setPosition(newPosition);
    setError(null);
    setLoading(false);
  }, []);

  const handleError = useCallback((err: globalThis.GeolocationPositionError) => {
    let errorMessage = '';

    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Permissão de localização negada pelo usuário.';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Localização indisponível.';
        break;
      case err.TIMEOUT:
        errorMessage = 'Timeout ao obter localização.';
        break;
      default:
        errorMessage = 'Erro desconhecido ao obter localização.';
        break;
    }

    setError(errorMessage);
    setLoading(false);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setLoading(true);
    setError(null);

    const geoOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge
    };

    if (watchPosition) {
      const id = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
      setWatchId(id);
    } else {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
    }
  }, [enableHighAccuracy, timeout, maximumAge, watchPosition, handleSuccess, handleError]);

  // Cleanup do watch position
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    position,
    error,
    loading,
    requestLocation,
    watchId
  };
}

// Hook para calcular distância entre dois pontos
export function useDistance() {
  const calculateDistance = useCallback((
    point1: MapCenter,
    point2: MapCenter
  ): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = toRadians(point2.lat - point1.lat);
    const dLon = toRadians(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }, []);

  return { calculateDistance };
}

// Função auxiliar para converter graus para radianos
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Hook para gerenciar filtros de mapa
export function useMapFilters() {
  const [filters, setFilters] = useState({
    radius: 10, // km
    priceRange: { min: 0, max: 500 },
    capacity: 1,
    availableOnly: true
  });

  const updateFilter = useCallback(<K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      radius: 10,
      priceRange: { min: 0, max: 500 },
      capacity: 1,
      availableOnly: true
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters
  };
}