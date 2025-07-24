'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Star,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Music,
  Eye,
  Navigation,
} from 'lucide-react';
import { Studio, useFavoritesStore } from '@/stores/favoritesStore';

interface StudioCardProps {
  studio: Studio;
  onViewDetails: (studio: Studio) => void;
  onBook: (studio: Studio) => void;
}

export function StudioCard({ studio, onViewDetails, onBook }: StudioCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isStudioFavorite = isFavorite(studio.id);

  const handleFavoriteToggle = () => {
    if (isStudioFavorite) {
      removeFromFavorites(studio.id);
    } else {
      addToFavorites(studio);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getImageSrc = () => {
    if (studio.images && studio.images.length > 0) {
      return studio.images[0];
    }
    // Fallback para imagem gerada
    return `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20music%20studio%20interior%20with%20modern%20equipment%20dark%20theme&image_size=landscape_4_3`;
  };

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="p-0">
        {/* Imagem do Estúdio */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {!imageError ? (
            <Image
              src={getImageSrc()}
              alt={studio.name}
              fill
              className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Music className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay com ações */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          
          {/* Botão de Favorito */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isStudioFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </Button>

          {/* Badge de Disponibilidade */}
          <div className="absolute top-2 left-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                studio.availability
                  ? 'bg-green-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {studio.availability ? 'Disponível' : 'Ocupado'}
            </span>
          </div>

          {/* Badge de Tipo */}
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/90 text-white">
              <Music className="h-3 w-3 mr-1" />
              {studio.studioType}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Nome e Avaliação */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {studio.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {renderStars(studio.rating)}
              <span className="text-sm text-muted-foreground ml-1">
                ({studio.rating}.0)
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              {studio.capacity} pessoas
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{studio.location}</span>
          </div>
          {studio.distance && (
            <div className="flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              <span>{studio.distance} km</span>
            </div>
          )}
        </div>

        {/* Descrição */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {studio.description}
        </p>

        {/* Equipamentos */}
        {studio.equipment && studio.equipment.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Equipamentos:</span>
            <div className="flex flex-wrap gap-1">
              {studio.equipment.slice(0, 3).map((eq, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                >
                  {eq}
                </span>
              ))}
              {studio.equipment.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                  +{studio.equipment.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}

        {/* Preço e Ações */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">
              R$ {studio.pricePerHour}
            </span>
            <span className="text-sm text-muted-foreground">/hora</span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(studio)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalhes
            </Button>
            <Button
              size="sm"
              onClick={() => onBook(studio)}
              disabled={!studio.availability}
            >
              {studio.availability ? 'Agendar' : 'Indisponível'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}