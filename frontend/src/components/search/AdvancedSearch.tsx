'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Users,
  Music,
  X,
} from 'lucide-react';

interface SearchFilters {
  query: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  availability: string;
  capacity: number;
  equipment: string[];
  studioType: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

const equipmentOptions = [
  'Microfones Profissionais',
  'Mesa de Som Digital',
  'Monitores de Estúdio',
  'Instrumentos',
  'Cabine Isolada',
  'Piano Acústico',
  'Bateria Completa',
  'Amplificadores',
];

const studioTypes = [
  'Gravação',
  'Ensaio',
  'Mixagem',
  'Masterização',
  'Podcast',
  'Live Session',
];

export function AdvancedSearch({ onSearch, onClear }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    priceRange: [0, 500],
    rating: 0,
    availability: '',
    capacity: 0,
    equipment: [],
    studioType: '',
  });

  const handleFilterChange = (key: keyof SearchFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFilters(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment],
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      location: '',
      priceRange: [0, 500],
      rating: 0,
      availability: '',
      capacity: 0,
      equipment: [],
      studioType: '',
    });
    onClear();
  };

  const hasActiveFilters = 
    filters.query ||
    filters.location ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500 ||
    filters.rating > 0 ||
    filters.availability ||
    filters.capacity > 0 ||
    filters.equipment.length > 0 ||
    filters.studioType;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>Buscar Estúdios</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca Principal */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome, descrição ou características..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="bg-background"
            />
          </div>
          <Button onClick={handleSearch} className="px-6">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>

        {/* Filtros Avançados */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Localização e Preço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  Localização
                </label>
                <Input
                  placeholder="Cidade, bairro ou região"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  Faixa de Preço (por hora)
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                    className="bg-background"
                  />
                  <span className="text-muted-foreground">até</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Avaliação e Capacidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                  Avaliação Mínima
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant={filters.rating >= star ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('rating', star)}
                    >
                      <Star className={`h-4 w-4 ${filters.rating >= star ? 'fill-current' : ''}`} />
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  Capacidade Mínima
                </label>
                <Input
                  type="number"
                  placeholder="Número de pessoas"
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', Number(e.target.value))}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Tipo de Estúdio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center">
                <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                Tipo de Estúdio
              </label>
              <div className="flex flex-wrap gap-2">
                {studioTypes.map((type) => (
                  <Button
                    key={type}
                    variant={filters.studioType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('studioType', filters.studioType === type ? '' : type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Equipamentos */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Equipamentos Disponíveis</label>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map((equipment) => (
                  <Button
                    key={equipment}
                    variant={filters.equipment.includes(equipment) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEquipmentToggle(equipment)}
                  >
                    {equipment}
                  </Button>
                ))}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Disponibilidade
              </label>
              <div className="flex space-x-2">
                <Input
                  type="datetime-local"
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Ações */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Filtros Ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filters.query && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                &quot;{filters.query}&quot;
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange('query', '')} />
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                📍 {filters.location}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange('location', '')} />
              </span>
            )}
            {filters.studioType && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                🎵 {filters.studioType}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange('studioType', '')} />
              </span>
            )}
            {filters.equipment.map((eq) => (
              <span key={eq} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                🎛️ {eq}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleEquipmentToggle(eq)} />
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}