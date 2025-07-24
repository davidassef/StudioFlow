import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EstudiosPage from '../page'
import { useLocationService } from '@/components/location/LocationService'

// Mock do LocationService
jest.mock('@/components/location/LocationService', () => ({
  useLocationService: jest.fn(),
  LocationService: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock do StudioCard
jest.mock('@/components/studios/StudioCard', () => {
  return function MockStudioCard({ studio, distance }: any) {
    return (
      <div data-testid={`studio-card-${studio.id}`}>
        <h3>{studio.name}</h3>
        <p>{studio.location}</p>
        <p>R$ {studio.price}/hora</p>
        <p>{studio.type}</p>
        <p>{studio.availability}</p>
        {distance && <p>Distância: {distance.toFixed(1)}km</p>}
        <div data-testid="equipment">
          {studio.equipment.map((eq: string, index: number) => (
            <span key={index}>{eq}</span>
          ))}
        </div>
      </div>
    )
  }
})

// Mock do AdvancedSearch
jest.mock('@/components/search/AdvancedSearch', () => {
  return function MockAdvancedSearch({ onFiltersChange }: any) {
    return (
      <div data-testid="advanced-search">
        <button 
          onClick={() => onFiltersChange({ 
            priceRange: [50, 150],
            rating: 4,
            capacity: 5,
            studioType: 'Gravação',
            equipment: ['Microfone']
          })}
        >
          Aplicar Filtros
        </button>
        <button onClick={() => onFiltersChange({})}>
          Limpar Filtros
        </button>
      </div>
    )
  }
})

const mockLocationService = {
  location: null,
  loading: false,
  error: null,
  permission: 'prompt' as const,
  getCurrentLocation: jest.fn(),
  clearLocation: jest.fn(),
  calculateDistance: jest.fn(),
  formatCoordinates: jest.fn(),
  isSupported: jest.fn(() => true)
}

describe('EstudiosPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLocationService as jest.Mock).mockReturnValue(mockLocationService)
  })

  it('deve renderizar a página corretamente', () => {
    render(<EstudiosPage />)
    
    expect(screen.getByText('Encontre o Studio Perfeito')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/buscar por nome ou localização/i)).toBeInTheDocument()
    expect(screen.getByText(/ordenar por/i)).toBeInTheDocument()
    expect(screen.getByTestId('advanced-search')).toBeInTheDocument()
  })

  it('deve exibir todos os studios inicialmente', () => {
    render(<EstudiosPage />)
    
    // Verifica se os studios mockados estão sendo exibidos
    expect(screen.getByTestId('studio-card-1')).toBeInTheDocument()
    expect(screen.getByTestId('studio-card-2')).toBeInTheDocument()
    expect(screen.getByTestId('studio-card-3')).toBeInTheDocument()
    expect(screen.getByTestId('studio-card-4')).toBeInTheDocument()
    expect(screen.getByTestId('studio-card-5')).toBeInTheDocument()
    expect(screen.getByTestId('studio-card-6')).toBeInTheDocument()
  })

  it('deve filtrar studios por busca de texto', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou localização/i)
    await user.type(searchInput, 'Harmony')
    
    await waitFor(() => {
      expect(screen.getByTestId('studio-card-1')).toBeInTheDocument() // Harmony Studios
      expect(screen.queryByTestId('studio-card-2')).not.toBeInTheDocument() // Beat Factory
    })
  })

  it('deve filtrar studios por localização', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou localização/i)
    await user.type(searchInput, 'Vila Madalena')
    
    await waitFor(() => {
      expect(screen.getByTestId('studio-card-1')).toBeInTheDocument() // Harmony Studios - Vila Madalena
      expect(screen.queryByTestId('studio-card-2')).not.toBeInTheDocument() // Beat Factory - Pinheiros
    })
  })

  it('deve ordenar studios por preço crescente', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const sortSelect = screen.getByDisplayValue('Relevância')
    await user.selectOptions(sortSelect, 'Menor Preço')
    
    await waitFor(() => {
      const studioCards = screen.getAllByTestId(/studio-card-/)
      // Verifica se o primeiro card é o de menor preço (R$ 80)
      expect(studioCards[0]).toHaveTextContent('R$ 80/hora')
    })
  })

  it('deve ordenar studios por preço decrescente', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const sortSelect = screen.getByDisplayValue('Relevância')
    await user.selectOptions(sortSelect, 'Maior Preço')
    
    await waitFor(() => {
      const studioCards = screen.getAllByTestId(/studio-card-/)
      // Verifica se o primeiro card é o de maior preço (R$ 200)
      expect(studioCards[0]).toHaveTextContent('R$ 200/hora')
    })
  })

  it('deve ordenar studios por avaliação', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const sortSelect = screen.getByDisplayValue('Relevância')
    await user.selectOptions(sortSelect, 'Melhor Avaliação')
    
    await waitFor(() => {
      const studioCards = screen.getAllByTestId(/studio-card-/)
      // Verifica se studios com melhor avaliação aparecem primeiro
      expect(studioCards[0]).toHaveTextContent('Harmony Studios') // 4.8 rating
    })
  })

  it('deve exibir opção de ordenação por distância quando localização estiver disponível', () => {
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 }
    })
    
    render(<EstudiosPage />)
    
    const sortSelect = screen.getByDisplayValue('Relevância')
    expect(sortSelect).toHaveTextContent('Distância')
  })

  it('deve calcular e exibir distâncias quando localização estiver disponível', () => {
    const mockCalculateDistance = jest.fn()
      .mockReturnValueOnce(2.5)
      .mockReturnValueOnce(3.2)
      .mockReturnValueOnce(1.8)
      .mockReturnValueOnce(4.1)
      .mockReturnValueOnce(2.9)
      .mockReturnValueOnce(3.7)
    
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 },
      calculateDistance: mockCalculateDistance
    })
    
    render(<EstudiosPage />)
    
    // Verifica se as distâncias são calculadas para cada studio
    expect(mockCalculateDistance).toHaveBeenCalledTimes(6)
    
    // Verifica se as distâncias são exibidas
    expect(screen.getByText('Distância: 2.5km')).toBeInTheDocument()
    expect(screen.getByText('Distância: 3.2km')).toBeInTheDocument()
  })

  it('deve aplicar filtros avançados', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const applyFiltersButton = screen.getByText('Aplicar Filtros')
    await user.click(applyFiltersButton)
    
    await waitFor(() => {
      // Verifica se apenas studios que atendem aos filtros são exibidos
      // Filtros: preço 50-150, rating 4+, capacidade 5+, tipo Gravação, equipamento Microfone
      const visibleCards = screen.getAllByTestId(/studio-card-/)
      expect(visibleCards.length).toBeLessThan(6) // Menos studios que o total
    })
  })

  it('deve limpar filtros avançados', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    // Aplica filtros primeiro
    const applyFiltersButton = screen.getByText('Aplicar Filtros')
    await user.click(applyFiltersButton)
    
    // Limpa filtros
    const clearFiltersButton = screen.getByText('Limpar Filtros')
    await user.click(clearFiltersButton)
    
    await waitFor(() => {
      // Verifica se todos os studios são exibidos novamente
      expect(screen.getAllByTestId(/studio-card-/)).toHaveLength(6)
    })
  })

  it('deve exibir mensagem quando nenhum studio for encontrado', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou localização/i)
    await user.type(searchInput, 'Studio Inexistente')
    
    await waitFor(() => {
      expect(screen.getByText(/nenhum studio encontrado/i)).toBeInTheDocument()
      expect(screen.getByText(/tente ajustar os filtros/i)).toBeInTheDocument()
    })
  })

  it('deve exibir contador de resultados', () => {
    render(<EstudiosPage />)
    
    expect(screen.getByText('6 studios encontrados')).toBeInTheDocument()
  })

  it('deve atualizar contador após filtrar', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou localização/i)
    await user.type(searchInput, 'Harmony')
    
    await waitFor(() => {
      expect(screen.getByText('1 studio encontrado')).toBeInTheDocument()
    })
  })

  it('deve filtrar por tipo de studio', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    // Simula filtro por tipo através do AdvancedSearch
    const applyFiltersButton = screen.getByText('Aplicar Filtros')
    await user.click(applyFiltersButton)
    
    await waitFor(() => {
      // Verifica se apenas studios do tipo 'Gravação' são exibidos
      const visibleCards = screen.getAllByTestId(/studio-card-/)
      visibleCards.forEach(card => {
        expect(card).toHaveTextContent('Gravação')
      })
    })
  })

  it('deve filtrar por faixa de preço', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const applyFiltersButton = screen.getByText('Aplicar Filtros')
    await user.click(applyFiltersButton)
    
    await waitFor(() => {
      // Verifica se apenas studios na faixa de preço 50-150 são exibidos
      const visibleCards = screen.getAllByTestId(/studio-card-/)
      visibleCards.forEach(card => {
        const priceText = card.textContent?.match(/R\$ (\d+)\/hora/)
        if (priceText) {
          const price = parseInt(priceText[1])
          expect(price).toBeGreaterThanOrEqual(50)
          expect(price).toBeLessThanOrEqual(150)
        }
      })
    })
  })

  it('deve filtrar por equipamentos', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    const applyFiltersButton = screen.getByText('Aplicar Filtros')
    await user.click(applyFiltersButton)
    
    await waitFor(() => {
      // Verifica se apenas studios com 'Microfone' são exibidos
      const visibleCards = screen.getAllByTestId(/studio-card-/)
      visibleCards.forEach(card => {
        const equipmentDiv = card.querySelector('[data-testid="equipment"]')
        expect(equipmentDiv).toHaveTextContent('Microfone')
      })
    })
  })

  it('deve manter estado de busca ao aplicar filtros', async () => {
    const user = userEvent.setup()
    render(<EstudiosPage />)
    
    // Faz uma busca primeiro
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou localização/i)
    await user.type(searchInput, 'Studio')
    
    // Aplica filtros
    const applyFiltersButton = screen.getByText('Aplicar Filtros')
    await user.click(applyFiltersButton)
    
    // Verifica se o texto de busca ainda está presente
    expect(searchInput).toHaveValue('Studio')
  })

  it('deve ordenar por distância quando localização estiver disponível', async () => {
    const user = userEvent.setup()
    
    const mockCalculateDistance = jest.fn()
      .mockReturnValueOnce(2.5)
      .mockReturnValueOnce(1.2) // Menor distância
      .mockReturnValueOnce(3.8)
      .mockReturnValueOnce(4.1)
      .mockReturnValueOnce(2.9)
      .mockReturnValueOnce(3.7)
    
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 },
      calculateDistance: mockCalculateDistance
    })
    
    render(<EstudiosPage />)
    
    const sortSelect = screen.getByDisplayValue('Relevância')
    await user.selectOptions(sortSelect, 'Distância')
    
    await waitFor(() => {
      const studioCards = screen.getAllByTestId(/studio-card-/)
      // O primeiro card deve ser o de menor distância (1.2km)
      expect(studioCards[0]).toHaveTextContent('Distância: 1.2km')
    })
  })
})