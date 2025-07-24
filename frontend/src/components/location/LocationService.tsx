'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { MapPin, Loader2, AlertCircle, Navigation, RefreshCw } from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationServiceProps {
  onLocationUpdate: (location: LocationData) => void;
  onLocationError?: (error: string) => void;
  autoRequest?: boolean;
  showUI?: boolean;
}

interface LocationState {
  status: 'idle' | 'requesting' | 'success' | 'error' | 'denied';
  location: LocationData | null;
  error: string | null;
  isSupported: boolean;
}

export function LocationService({ 
  onLocationUpdate, 
  onLocationError, 
  autoRequest = false, 
  showUI = true 
}: LocationServiceProps) {
  const [state, setState] = useState<LocationState>({
    status: 'idle',
    location: null,
    error: null,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  });

  const requestLocation = useCallback(() => {
    if (!state.isSupported) {
      const error = 'Geolocalização não é suportada neste navegador';
      setState(prev => ({ ...prev, status: 'error', error }));
      onLocationError?.(error);
      return;
    }

    setState(prev => ({ ...prev, status: 'requesting', error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutos
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setState(prev => ({ 
          ...prev, 
          status: 'success', 
          location: locationData, 
          error: null 
        }));
        
        onLocationUpdate(locationData);
        
        // Salvar no localStorage para uso futuro
        localStorage.setItem('lastKnownLocation', JSON.stringify(locationData));
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';
        let status: LocationState['status'] = 'error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada pelo usuário';
            status = 'denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização não disponíveis';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite para obter localização excedido';
            break;
          default:
            errorMessage = 'Erro desconhecido ao obter localização';
            break;
        }
        
        setState(prev => ({ ...prev, status, error: errorMessage }));
        onLocationError?.(errorMessage);
      },
      options
    );
  }, [state.isSupported, onLocationUpdate, onLocationError]);

  // Tentar carregar localização salva
  useEffect(() => {
    const savedLocation = localStorage.getItem('lastKnownLocation');
    if (savedLocation) {
      try {
        const locationData: LocationData = JSON.parse(savedLocation);
        // Verificar se a localização não é muito antiga (mais de 1 hora)
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        if (locationData.timestamp > oneHourAgo) {
          setState(prev => ({ ...prev, location: locationData, status: 'success' }));
          onLocationUpdate(locationData);
        }
      } catch (error) {
        console.error('Erro ao carregar localização salva:', error);
      }
    }
  }, [onLocationUpdate]);

  // Auto-request se habilitado
  useEffect(() => {
    if (autoRequest && state.status === 'idle' && state.isSupported) {
      requestLocation();
    }
  }, [autoRequest, requestLocation, state.status, state.isSupported]);

  // Função para formatar coordenadas
  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Função para calcular distância entre dois pontos
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (!showUI) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização
        </CardTitle>
        <CardDescription>
          {state.status === 'success' && state.location
            ? 'Localização obtida com sucesso'
            : 'Permita o acesso à localização para encontrar estúdios próximos'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!state.isSupported && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              Geolocalização não é suportada neste navegador
            </p>
          </div>
        )}

        {state.status === 'denied' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Permissão de localização negada. Para encontrar estúdios próximos:
              </p>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Chrome/Edge:</strong> Clique no ícone de localização na barra de endereços</p>
              <p><strong>Firefox:</strong> Clique em "Permitir" quando solicitado</p>
              <p><strong>Safari:</strong> Vá em Configurações → Privacidade → Serviços de Localização</p>
            </div>
          </div>
        )}

        {state.status === 'error' && state.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        {state.status === 'success' && state.location && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Navigation className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Localização obtida
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {formatCoordinates(state.location.latitude, state.location.longitude)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Precisão: ~{Math.round(state.location.accuracy)}m
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={requestLocation}
            disabled={!state.isSupported || state.status === 'requesting'}
            className="flex-1"
          >
            {state.status === 'requesting' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Obtendo localização...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                {state.status === 'success' ? 'Atualizar Localização' : 'Obter Localização'}
              </>
            )}
          </Button>
          
          {state.status === 'success' && (
            <Button
              variant="outline"
              onClick={requestLocation}
              disabled={state.status === 'requesting'}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {state.status === 'success' && (
          <div className="text-xs text-muted-foreground">
            <p>
              💡 <strong>Dica:</strong> Sua localização é usada apenas para encontrar estúdios próximos.
              Não compartilhamos seus dados de localização com terceiros.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook personalizado para usar o serviço de localização
export function useLocationService() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const getCurrentLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      const errorMsg = 'Geolocalização não é suportada';
      setError(errorMsg);
      setPermission('denied');
      return Promise.reject(new Error(errorMsg));
    }

    setLoading(true);
    setError(null);

    return new Promise<LocationData>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(data);
          setLoading(false);
          setPermission('granted');
          setError(null);
          resolve(data);
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada';
              setPermission('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo esgotado';
              break;
            default:
              errorMessage = 'Erro desconhecido ao obter localização';
              break;
          }
          
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }, []);

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const formatCoordinates = useCallback((lat: number, lng: number, precision?: number): string => {
    if (precision !== undefined) {
      return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
    }
    return `${lat}, ${lng}`;
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    setLoading(false);
  }, []);

  const isSupported = useCallback((): boolean => {
    return typeof navigator !== 'undefined' && 'geolocation' in navigator;
  }, []);

  return {
    location,
    error,
    loading,
    permission,
    getCurrentLocation,
    calculateDistance,
    formatCoordinates,
    clearLocation,
    isSupported,
  };
}

export type { LocationData };