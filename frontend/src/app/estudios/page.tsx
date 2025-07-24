'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { StudioCard } from '@/components/studios/StudioCard';
import { LoadingOverlay, StudioCardSkeleton, EmptyState } from '@/components/ui/LoadingStates';
import { LocationService, useLocationService, LocationData } from '@/components/location/LocationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Navigation,
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: 'admin' as const,
  avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20man%20avatar%20portrait&image_size=square',
};

// Mock studios data
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
    availability: false,
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
  },
];

type SortOption = 'name' | 'price' | 'rating' | 'capacity';
type ViewMode = 'grid' | 'list';

export default function StudiosPage() {
  const [studios] = useState(mockStudios);
  const [filteredStudios, setFilteredStudios] = useState(mockStudios);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const { calculateDistance } = useLocationService();

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Atualizar distâncias quando a localização do usuário mudar
  useEffect(() => {
    if (userLocation) {
      const studiosWithDistance = mockStudios.map(studio => {
        const distance = calculateDistance(studio.latitude, studio.longitude);
        return {
          ...studio,
          distance: distance ? Math.round(distance * 10) / 10 : null, // Arredondar para 1 casa decimal
        };
      });
      setFilteredStudios(studiosWithDistance);
    }
  }, [userLocation, calculateDistance]);

  // Aplicar filtros e ordenação
  useEffect(() => {
    let filtered = [...studios];

    // Aplicar filtros de busca
    if (searchFilters) {
      // Implementar lógica de filtros aqui
      // Por enquanto, mantemos todos os estúdios
    }

    // Filtrar por aba ativa
    if (activeTab === 'available') {
      filtered = filtered.filter(studio => studio.availability);
    } else if (activeTab === 'unavailable') {
      filtered = filtered.filter(studio => !studio.availability);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      // Mapear sortBy para as propriedades corretas do Studio
      if (sortBy === 'price') {
        aValue = a.pricePerHour;
        bValue = b.pricePerHour;
      } else if (sortBy === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortBy === 'rating') {
        aValue = a.rating;
        bValue = b.rating;
      } else if (sortBy === 'distance') {
        aValue = a.distance || 999999;
        bValue = b.distance || 999999;
      } else {
        // Fallback para capacity
        aValue = a.capacity;
        bValue = b.capacity;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredStudios(filtered);
  }, [studios, searchFilters, sortBy, sortOrder, activeTab]);

  const handleSearch = (filters: { query: string; location: string; priceRange: [number, number]; rating: number; availability: string; capacity: number; equipment: string[]; studioType: string }) => {
    setSearchFilters(filters);
  };

  const handleClearSearch = () => {
    setSearchFilters({});
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleViewDetails = (studio: typeof mockStudios[0]) => {
    // Implementar navegação para detalhes do estúdio
    console.log('Ver detalhes:', studio);
  };

  const handleBook = (studio: typeof mockStudios[0]) => {
    // Implementar navegação para agendamento
    console.log('Agendar estúdio:', studio);
  };

  if (isLoading) {
    return (
      <Layout user={mockUser}>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Estúdios</h1>
            <p className="text-muted-foreground">
              Encontre o estúdio perfeito para suas necessidades
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Localização e Busca Avançada */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Localização */}
            <LocationService
              onLocationUpdate={setUserLocation}
              onLocationError={(error) => console.error('Erro de localização:', error)}
              autoRequest={false}
              showUI={true}
            />
            
            {/* Filtros de Busca */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <AdvancedSearch onSearch={handleSearch} onClear={handleClearSearch} />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">

        {/* Controles de Ordenação */}
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                Todos ({studios.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Disponíveis ({studios.filter(s => s.availability).length})
              </TabsTrigger>
              <TabsTrigger value="unavailable">
                Indisponíveis ({studios.filter(s => !s.availability).length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="pricePerHour">Preço</SelectItem>
                <SelectItem value="rating">Avaliação</SelectItem>
                <SelectItem value="capacity">Capacidade</SelectItem>
                {userLocation && <SelectItem value="distance">Distância</SelectItem>}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

            {/* Lista de Estúdios */}
            <LoadingOverlay isLoading={false}>
              {filteredStudios.length === 0 ? (
                <EmptyState
                  icon={Building}
                  title="Nenhum estúdio encontrado"
                  description="Tente ajustar os filtros de busca ou explore outras opções."
                  action={
                    <Button onClick={() => setSearchFilters({})}>
                      Limpar Filtros
                    </Button>
                  }
                />
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'md:grid-cols-2 lg:grid-cols-2' 
                    : 'grid-cols-1'
                }`}>
                  {filteredStudios.map((studio) => (
                    <StudioCard 
                      key={studio.id} 
                      studio={studio}
                      onViewDetails={handleViewDetails}
                      onBook={handleBook}
                    />
                  ))}
                </div>
              )}
            </LoadingOverlay>
          </div>
        </div>

        {/* Paginação (placeholder) */}
        {filteredStudios.length > 0 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Página 1 de 1
              </span>
              <Button variant="outline" size="sm" disabled>
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}