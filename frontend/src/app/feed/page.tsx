'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { StudioCard } from '@/components/studios/StudioCard';
import { LocationService, useLocationService, LocationData } from '@/components/location/LocationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Music,
  Headphones,
  Mic,
  Radio,
  RefreshCw,
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'client' as const,
  avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20avatar%20portrait&image_size=square',
};

// Mock studios data com coordenadas
const mockStudios = [
  {
    id: '1',
    name: 'Estúdio Premium A',
    description: 'Estúdio profissional com equipamentos de última geração para gravação musical.',
    location: 'São Paulo, SP',
    latitude: -23.5505,
    longitude: -46.6333,
    pricePerHour: 150,
    rating: 4.8,
    images: ['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20recording%20studio%20with%20professional%20equipment%20dark%20ambient%20lighting&image_size=landscape_4_3'],
    equipment: ['Microfone Neumann', 'Mesa SSL', 'Monitores Genelec'],
    capacity: 8,
    studioType: 'recording',
    availability: true,
    featured: true,
    trending: true,
  },
  {
    id: '2',
    name: 'Estúdio Criativo B',
    description: 'Espaço ideal para ensaios de bandas e apresentações ao vivo.',
    location: 'Rio de Janeiro, RJ',
    latitude: -22.9068,
    longitude: -43.1729,
    pricePerHour: 120,
    rating: 4.6,
    images: ['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=creative%20rehearsal%20studio%20with%20instruments%20and%20amplifiers%20colorful%20lighting&image_size=landscape_4_3'],
    equipment: ['Bateria Pearl', 'Amplificadores Marshall', 'Microfones Shure'],
    capacity: 6,
    studioType: 'rehearsal',
    availability: true,
    featured: false,
    trending: true,
  },
  {
    id: '3',
    name: 'Estúdio Podcast C',
    description: 'Estúdio especializado em gravação de podcasts e conteúdo digital.',
    location: 'Belo Horizonte, MG',
    latitude: -19.9167,
    longitude: -43.9345,
    pricePerHour: 80,
    rating: 4.9,
    images: ['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20podcast%20studio%20with%20microphones%20and%20acoustic%20panels%20warm%20lighting&image_size=landscape_4_3'],
    equipment: ['Microfones Rode', 'Interface Focusrite', 'Fones Audio-Technica'],
    capacity: 4,
    studioType: 'podcast',
    availability: true,
    featured: true,
    trending: false,
  },
  {
    id: '4',
    name: 'Estúdio Live D',
    description: 'Estúdio para apresentações ao vivo e transmissões online.',
    location: 'Porto Alegre, RS',
    latitude: -30.0346,
    longitude: -51.2177,
    pricePerHour: 200,
    rating: 4.7,
    images: ['https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=live%20performance%20studio%20with%20stage%20lighting%20and%20sound%20equipment&image_size=landscape_4_3'],
    equipment: ['Mesa Yamaha', 'Monitores QSC', 'Microfones sem fio'],
    capacity: 12,
    studioType: 'live',
    availability: true,
    featured: false,
    trending: false,
  },
];

// Mock de novidades/notícias
const mockNews = [
  {
    id: '1',
    title: 'Novo Estúdio Premium inaugurado em São Paulo',
    description: 'Equipamentos de última geração agora disponíveis para reserva.',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20music%20studio%20opening%20celebration&image_size=landscape_4_3',
    date: '2024-01-15',
    category: 'Novidades',
  },
  {
    id: '2',
    title: 'Promoção: 20% de desconto em estúdios de podcast',
    description: 'Válido até o final do mês para novos clientes.',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=podcast%20studio%20promotion%20banner&image_size=landscape_4_3',
    date: '2024-01-12',
    category: 'Promoção',
  },
  {
    id: '3',
    title: 'Dicas para uma gravação perfeita',
    description: 'Confira nossas dicas profissionais para otimizar sua sessão.',
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20recording%20tips%20illustration&image_size=landscape_4_3',
    date: '2024-01-10',
    category: 'Dicas',
  },
];

const studioTypeIcons = {
  recording: Music,
  rehearsal: Headphones,
  podcast: Mic,
  live: Radio,
};

export default function FeedPage() {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [nearbyStudios, setNearbyStudios] = useState(mockStudios);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { calculateDistance } = useLocationService();

  // Atualizar estúdios próximos quando a localização mudar
  useEffect(() => {
    if (userLocation) {
      const studiosWithDistance = mockStudios.map(studio => {
        const distance = calculateDistance(studio.latitude, studio.longitude);
        return {
          ...studio,
          distance: distance ? Math.round(distance * 10) / 10 : null,
        };
      });
      
      // Ordenar por distância e pegar os 3 mais próximos
      const nearby = studiosWithDistance
        .filter(studio => studio.distance !== null)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 3);
      
      setNearbyStudios(nearby.length > 0 ? nearby : mockStudios.slice(0, 3));
    }
  }, [userLocation, calculateDistance]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular atualização do feed
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleViewDetails = (studio: typeof mockStudios[0]) => {
    console.log('Ver detalhes:', studio);
  };

  const handleBook = (studio: typeof mockStudios[0]) => {
    console.log('Agendar estúdio:', studio);
  };

  const featuredStudios = mockStudios.filter(studio => studio.featured);
  const trendingStudios = mockStudios.filter(studio => studio.trending);

  return (
    <Layout user={mockUser}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Feed</h1>
            <p className="text-muted-foreground mt-1">
              Descubra estúdios incríveis e fique por dentro das novidades
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Localização */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sua Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LocationService
              onLocationUpdate={setUserLocation}
              onLocationError={(error) => console.error('Erro de localização:', error)}
              autoRequest={false}
              showUI={true}
            />
          </CardContent>
        </Card>

        {/* Estúdios Próximos */}
        {userLocation && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Estúdios Próximos</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {nearbyStudios.map((studio) => (
                <StudioCard
                  key={studio.id}
                  studio={studio}
                  onViewDetails={handleViewDetails}
                  onBook={handleBook}
                />
              ))}
            </div>
          </section>
        )}

        {/* Estúdios em Destaque */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-semibold">Estúdios em Destaque</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredStudios.map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio}
                onViewDetails={handleViewDetails}
                onBook={handleBook}
              />
            ))}
          </div>
        </section>

        {/* Estúdios em Alta */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h2 className="text-2xl font-semibold">Em Alta</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingStudios.map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio}
                onViewDetails={handleViewDetails}
                onBook={handleBook}
              />
            ))}
          </div>
        </section>

        {/* Novidades e Notícias */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-semibold">Novidades</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockNews.map((news) => (
              <Card key={news.id} className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                    {news.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{news.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{news.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(news.date).toLocaleDateString('pt-BR')}
                    </span>
                    <Button variant="ghost" size="sm">
                      Ler mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categorias de Estúdios */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Explore por Categoria</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(studioTypeIcons).map(([type, Icon]) => {
              const typeLabels = {
                recording: 'Gravação',
                rehearsal: 'Ensaio',
                podcast: 'Podcast',
                live: 'Ao Vivo',
              };
              
              const studiosCount = mockStudios.filter(s => s.studioType === type).length;
              
              return (
                <Card key={type} className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold text-lg mb-1">{typeLabels[type as keyof typeof typeLabels]}</h3>
                    <p className="text-muted-foreground text-sm">
                      {studiosCount} estúdio{studiosCount !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}