'use client'

import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRooms, Room } from '@/stores/studioStore'
import { useNotifications } from '@/stores/notificationStore'
import { useEffect, useState } from 'react'
import {
  Building,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
  Music,
  Search,
  Heart,
  Calendar,
} from 'lucide-react'

// Mock user data
const mockUser = {
  name: 'João Silva',
  email: 'joao@studioflow.com',
};



export default function SalasPage() {
  const { 
    rooms, 
    fetchRooms, 
    searchRooms, 
    setRoomFilters, 
    roomFilters, 
    isLoading 
  } = useRooms()
  
  const { showSuccess } = useNotifications()
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [filters, setFilters] = useState({
    preco_max: '',
    capacidade_min: '',
    disponivel: 'all'
  })

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchRooms(query, roomFilters)
    } else {
      fetchRooms(roomFilters)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Converter filtros para o formato esperado pelo store
    const storeFilters: Record<string, unknown> = {}
    if (newFilters.preco_max) {
      storeFilters.preco_max = parseFloat(newFilters.preco_max)
    }
    if (newFilters.capacidade_min) {
      storeFilters.capacidade_min = parseInt(newFilters.capacidade_min)
    }
    if (newFilters.disponivel !== 'all') {
      storeFilters.disponivel = newFilters.disponivel === 'true'
    }
    
    setRoomFilters(storeFilters)
    fetchRooms(storeFilters)
  }

  const toggleFavorite = (roomId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
      
      showSuccess(
        'Favoritos', 
        prev.includes(roomId) ? 'Sala removida dos favoritos' : 'Sala adicionada aos favoritos'
      )
      
      return newFavorites
    })
  }

  const handleReservar = (room: Room) => {
    // TODO: Implementar navegação para página de reserva
    showSuccess('Reserva', `Redirecionando para reserva da ${room.nome}`)
  }

  const getEquipmentIcon = (equipment: string) => {
    const lower = equipment.toLowerCase()
    if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="h-3 w-3" />
    if (lower.includes('som') || lower.includes('audio')) return <Music className="h-3 w-3" />
    if (lower.includes('café') || lower.includes('coffee')) return <Coffee className="h-3 w-3" />
    if (lower.includes('estacionamento')) return <Car className="h-3 w-3" />
    return <Music className="h-3 w-3" />
  }

  return (
    <Layout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Salas
            </h1>
            <p className="text-muted-foreground mt-1">
              Encontre a sala perfeita para sua necessidade
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar salas por nome, estúdio ou equipamentos..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Preço máximo:</label>
                  <select 
                    className="border rounded-md px-3 py-1 text-sm bg-background"
                    value={filters.preco_max}
                    onChange={(e) => handleFilterChange('preco_max', e.target.value)}
                  >
                    <option value="">Qualquer</option>
                    <option value="100">Até R$ 100</option>
                    <option value="150">Até R$ 150</option>
                    <option value="200">Até R$ 200</option>
                    <option value="300">Até R$ 300</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Capacidade mínima:</label>
                  <select 
                    className="border rounded-md px-3 py-1 text-sm bg-background"
                    value={filters.capacidade_min}
                    onChange={(e) => handleFilterChange('capacidade_min', e.target.value)}
                  >
                    <option value="">Qualquer</option>
                    <option value="2">2+ pessoas</option>
                    <option value="5">5+ pessoas</option>
                    <option value="10">10+ pessoas</option>
                    <option value="15">15+ pessoas</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Disponibilidade:</label>
                  <select 
                    className="border rounded-md px-3 py-1 text-sm bg-background"
                    value={filters.disponivel}
                    onChange={(e) => handleFilterChange('disponivel', e.target.value)}
                  >
                    <option value="all">Todas</option>
                    <option value="true">Disponível</option>
                    <option value="false">Ocupada</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Rooms Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhuma sala encontrada com os filtros aplicados.
              </div>
            ) : (
              rooms.map((room) => (
                <Card key={room.id} className="bg-card border-border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Building className="h-16 w-16 text-white opacity-50" />
                    </div>
                    
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => toggleFavorite(room.id)}
                        className="p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.includes(room.id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-white'
                          }`} 
                        />
                      </button>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.disponivel 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {room.disponivel ? 'Disponível' : 'Ocupada'}
                      </div>
                    </div>
                    
                    <div className="absolute top-2 left-2">
                      <div className="px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                        R$ {room.preco_hora.toFixed(2)}/hora
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{room.nome}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Building className="h-4 w-4" />
                          {room.estudio?.nome || 'Estúdio'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {room.descricao || 'Sala profissional para suas necessidades.'}
                    </p>
                    
                    <div className="space-y-3">
                      {room.estudio?.endereco && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {room.estudio.endereco}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Até {room.capacidade} pessoas
                      </div>
                      
                      {room.equipamentos && room.equipamentos.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {room.equipamentos.slice(0, 3).map((equipment, index) => (
                            <div key={index} className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full text-xs">
                              {getEquipmentIcon(equipment)}
                              {equipment}
                            </div>
                          ))}
                          {room.equipamentos.length > 3 && (
                            <div className="px-2 py-1 bg-muted/50 rounded-full text-xs">
                              +{room.equipamentos.length - 3} mais
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">
                        Ver Detalhes
                      </Button>
                      <Button 
                        className="flex-1 flex items-center gap-2" 
                        disabled={!room.disponivel}
                        onClick={() => handleReservar(room)}
                      >
                        <Calendar className="h-4 w-4" />
                        {room.disponivel ? 'Reservar' : 'Indisponível'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}