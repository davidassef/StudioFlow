'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StudioCard } from '@/components/studios/StudioCard';
import { LoadingOverlay, StudioCardSkeleton } from '@/components/ui/LoadingStates';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

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
];

type ViewMode = 'grid' | 'list';

export default function EstudiosPage() {
  const [studios] = useState(mockStudios);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (studio: typeof mockStudios[0]) => {
    console.log('Ver detalhes:', studio);
  };

  const handleBook = (studio: typeof mockStudios[0]) => {
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

        {/* Lista de Estúdios */}
        <LoadingOverlay isLoading={false}>
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'md:grid-cols-2 lg:grid-cols-2'
              : 'grid-cols-1'
          }`}>
            {studios.map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio as any}
                onViewDetails={handleViewDetails}
                onBook={handleBook}
              />
            ))}
          </div>
        </LoadingOverlay>
      </div>
    </Layout>
  );
}