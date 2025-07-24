'use client';

import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StudioCard } from '@/components/studios/StudioCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Heart,
  Search,
  Filter,
  MapPin,
  Music,
  Trash2,
  Grid,
  List,
} from 'lucide-react';
import { useFavoritesStore, Studio } from '@/stores/favoritesStore';

// Mock user data
const mockUser = {
  name: 'João Silva',
  email: 'joao@studioflow.com',
};

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoritesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtrar favoritos
  const filteredFavorites = useMemo(() => {
    return favorites.filter(studio => {
      const matchesSearch = studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           studio.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || studio.studioType === selectedType;
      const matchesLocation = !selectedLocation || 
                             studio.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [favorites, searchQuery, selectedType, selectedLocation]);

  // Obter tipos únicos dos favoritos
  const uniqueTypes = useMemo(() => {
    const types = favorites.map(studio => studio.studioType);
    return Array.from(new Set(types));
  }, [favorites]);

  // Obter localizações únicas dos favoritos
  const uniqueLocations = useMemo(() => {
    const locations = favorites.map(studio => {
      // Extrair cidade da localização
      const parts = studio.location.split(',');
      return parts[parts.length - 1].trim();
    });
    return Array.from(new Set(locations));
  }, [favorites]);

  const handleViewDetails = (studio: Studio) => {
    // Implementar navegação para detalhes do estúdio
    console.log('Ver detalhes:', studio);
  };

  const handleBook = (studio: Studio) => {
    // Implementar navegação para agendamento
    console.log('Agendar:', studio);
  };

  const handleClearAll = () => {
    if (confirm('Tem certeza que deseja remover todos os favoritos?')) {
      clearFavorites();
    }
  };

  return (
    <Layout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Heart className="h-8 w-8 mr-3 text-red-500" />
              Meus Favoritos
            </h1>
            <p className="text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? 'estúdio salvo' : 'estúdios salvos'}
            </p>
          </div>
          
          {favorites.length > 0 && (
            <div className="flex items-center space-x-2">
              {/* Toggle de visualização */}
              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos
              </Button>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          /* Estado Vazio */
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum favorito ainda
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Explore nossos estúdios e adicione seus favoritos clicando no ícone de coração.
                Assim você pode acessá-los rapidamente quando precisar.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                <Search className="h-4 w-4 mr-2" />
                Explorar Estúdios
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filtros */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span>Filtrar Favoritos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Busca */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Buscar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Nome ou descrição..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background"
                      />
                    </div>
                  </div>

                  {/* Tipo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center">
                      <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                      Tipo de Estúdio
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="">Todos os tipos</option>
                      {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Localização */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      Localização
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="">Todas as localizações</option>
                      {uniqueLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultados */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {filteredFavorites.length} de {favorites.length} favoritos
                  {searchQuery || selectedType || selectedLocation ? ' (filtrados)' : ''}
                </p>
              </div>

              {filteredFavorites.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Tente ajustar os filtros para encontrar seus estúdios favoritos.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredFavorites.map((studio) => (
                    <StudioCard
                      key={studio.id}
                      studio={studio}
                      onViewDetails={handleViewDetails}
                      onBook={handleBook}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}