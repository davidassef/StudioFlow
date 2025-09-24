'use client';

import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Configuração do mapa
const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

// Centro padrão (São Paulo)
const DEFAULT_CENTER = {
  lat: -23.5505,
  lng: -46.6333
};

const LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

interface Studio {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  endereco: string;
  preco_hora: number;
  capacidade: number;
}

interface StudioMapProps {
  studios?: Studio[];
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  onStudioClick?: (studio: Studio) => void;
  className?: string;
}

export function StudioMap({
  studios = [],
  center = DEFAULT_CENTER,
  zoom = 12,
  onStudioClick,
  className = ''
}: StudioMapProps) {
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Carregar Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });

  // Callback quando o mapa carrega
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Callback quando o mapa desmonta
  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Obter localização do usuário
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);

        // Centralizar mapa na localização do usuário
        if (map) {
          map.panTo(location);
          map.setZoom(15);
        }
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Erro ao obter sua localização. Verifique as permissões do navegador.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  }, [map]);

  // Renderizar erro de carregamento
  if (loadError) {
    return (
      <div className={`flex items-center justify-center ${MAP_CONTAINER_STYLE} bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Erro ao carregar o mapa</p>
          <p className="text-sm text-gray-500 mt-2">
            Verifique sua conexão com a internet e tente novamente
          </p>
        </div>
      </div>
    );
  }

  // Renderizar loading
  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center ${MAP_CONTAINER_STYLE} bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controles do mapa */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          onClick={getUserLocation}
          size="sm"
          variant="secondary"
          className="bg-white shadow-md hover:bg-gray-50"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Minha Localização
        </Button>
      </div>

      {/* Mapa */}
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={zoom}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: 'greedy',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {/* Marker da localização do usuário */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12)
            }}
            title="Sua localização"
          />
        )}

        {/* Markers dos estúdios */}
        {studios.map((studio) => (
          <Marker
            key={studio.id}
            position={{ lat: studio.latitude, lng: studio.longitude }}
            onClick={() => {
              setSelectedStudio(studio);
              onStudioClick?.(studio);
            }}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C11.6 2 8 5.6 8 10c0 8 8 18 8 18s8-10 8-18c0-4.4-3.6-8-8-8z" fill="#DC2626"/>
                  <circle cx="16" cy="10" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 32)
            }}
            title={studio.nome}
          />
        ))}

        {/* InfoWindow do estúdio selecionado */}
        {selectedStudio && (
          <InfoWindow
            position={{
              lat: selectedStudio.latitude,
              lng: selectedStudio.longitude
            }}
            onCloseClick={() => setSelectedStudio(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedStudio.nome}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedStudio.endereco}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Capacidade: {selectedStudio.capacidade} pessoas
                </span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold text-green-600">
                  R$ {selectedStudio.preco_hora}/hora
                </span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Legenda */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Sua localização</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded-full"></div>
          <span>Estúdios</span>
        </div>
      </div>
    </div>
  );
}

export default StudioMap;