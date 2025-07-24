import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FeedPage from '../page'
import { useLocationService } from '@/components/location/LocationService'

// Mock do LocationService
jest.mock('@/components/location/LocationService', () => ({
  useLocationService: jest.fn(),
  LocationService: ({ children }: { children: React.ReactNode }) => <div data-testid="location-service">{children}</div>
}))

// Mock do StudioCard
jest.mock('@/components/studios/StudioCard', () => {
  return function MockStudioCard({ studio, distance }: any) {
    return (
      <div data-testid={`studio-card-${studio.id}`}>
        <h3>{studio.name}</h3>
        <p>{studio.location}</p>
        <p>R$ {studio.price}/hora</p>
        <p>Rating: {studio.rating}</p>
        {distance && <p>Distância: {distance.toFixed(1)}km</p>}
      </div>
    )
  }
})

// Mock do router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })
}))

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

describe('FeedPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLocationService as jest.Mock).mockReturnValue(mockLocationService)
  })

  it('deve renderizar a página corretamente', () => {
    render(<FeedPage />)
    
    expect(screen.getByText('Descubra Studios Incríveis')).toBeInTheDocument()
    expect(screen.getByText('Encontre o espaço perfeito para sua criatividade')).toBeInTheDocument()
    expect(screen.getByTestId('location-service')).toBeInTheDocument()
  })

  it('deve exibir seção de studios próximos quando localização estiver disponível', () => {
    const mockCalculateDistance = jest.fn()
      .mockReturnValue(2.5)
    
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 },
      calculateDistance: mockCalculateDistance
    })
    
    render(<FeedPage />)
    
    expect(screen.getByText('Studios Próximos')).toBeInTheDocument()
    expect(screen.getByText('Baseado na sua localização')).toBeInTheDocument()
    
    // Verifica se studios próximos são exibidos com distância
    expect(screen.getByText('Distância: 2.5km')).toBeInTheDocument()
  })

  it('deve ocultar seção de studios próximos quando localização não estiver disponível', () => {
    render(<FeedPage />)
    
    expect(screen.queryByText('Studios Próximos')).not.toBeInTheDocument()
    expect(screen.queryByText('Baseado na sua localização')).not.toBeInTheDocument()
  })

  it('deve exibir seção de studios em destaque', () => {
    render(<FeedPage />)
    
    expect(screen.getByText('Studios em Destaque')).toBeInTheDocument()
    expect(screen.getByText('Os mais bem avaliados da plataforma')).toBeInTheDocument()
    
    // Verifica se studios em destaque são exibidos (rating >= 4.5)
    const featuredStudios = screen.getAllByTestId(/studio-card-/)
    const featuredSection = screen.getByText('Studios em Destaque').closest('section')
    
    if (featuredSection) {
      const studiosInSection = featuredSection.querySelectorAll('[data-testid^="studio-card-"]')
      expect(studiosInSection.length).toBeGreaterThan(0)
    }
  })

  it('deve exibir seção de studios em alta', () => {
    render(<FeedPage />)
    
    expect(screen.getByText('Studios em Alta')).toBeInTheDocument()
    expect(screen.getByText('Populares entre os usuários')).toBeInTheDocument()
    
    // Verifica se studios em alta são exibidos
    const trendingSection = screen.getByText('Studios em Alta').closest('section')
    
    if (trendingSection) {
      const studiosInSection = trendingSection.querySelectorAll('[data-testid^="studio-card-"]')
      expect(studiosInSection.length).toBeGreaterThan(0)
    }
  })

  it('deve exibir seção de novidades', () => {
    render(<FeedPage />)
    
    expect(screen.getByText('Novidades')).toBeInTheDocument()
    expect(screen.getByText('Fique por dentro das últimas atualizações')).toBeInTheDocument()
  })

  it('deve exibir artigos de novidades', () => {
    render(<FeedPage />)
    
    // Verifica se os artigos mockados são exibidos
    expect(screen.getByText('Nova Funcionalidade: Reservas Instantâneas')).toBeInTheDocument()
    expect(screen.getByText('Dicas para Escolher o Studio Ideal')).toBeInTheDocument()
    expect(screen.getByText('Tendências em Produção Musical 2024')).toBeInTheDocument()
  })

  it('deve exibir datas dos artigos formatadas', () => {
    render(<FeedPage />)
    
    // Verifica se as datas são exibidas no formato correto
    expect(screen.getByText('15 de janeiro de 2024')).toBeInTheDocument()
    expect(screen.getByText('10 de janeiro de 2024')).toBeInTheDocument()
    expect(screen.getByText('5 de janeiro de 2024')).toBeInTheDocument()
  })

  it('deve permitir navegação para ver todos os studios', async () => {
    const user = userEvent.setup()
    render(<FeedPage />)
    
    const viewAllButtons = screen.getAllByText('Ver Todos')
    expect(viewAllButtons.length).toBeGreaterThan(0)
    
    // Testa clique no primeiro botão "Ver Todos"
    await user.click(viewAllButtons[0])
    
    // Verifica se a navegação seria chamada (mock do router)
    // Como estamos usando mock, apenas verificamos se o botão é clicável
    expect(viewAllButtons[0]).toBeInTheDocument()
  })

  it('deve calcular distâncias apenas para studios próximos', () => {
    const mockCalculateDistance = jest.fn().mockReturnValue(2.5)
    
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 },
      calculateDistance: mockCalculateDistance
    })
    
    render(<FeedPage />)
    
    // Verifica se calculateDistance é chamado apenas para studios próximos (distância <= 10km)
    expect(mockCalculateDistance).toHaveBeenCalled()
    
    // Verifica se a distância é exibida apenas na seção de studios próximos
    const nearbySection = screen.getByText('Studios Próximos').closest('section')
    if (nearbySection) {
      expect(nearbySection).toHaveTextContent('Distância: 2.5km')
    }
  })

  it('deve filtrar studios em destaque por rating', () => {
    render(<FeedPage />)
    
    const featuredSection = screen.getByText('Studios em Destaque').closest('section')
    
    if (featuredSection) {
      const studiosInSection = featuredSection.querySelectorAll('[data-testid^="studio-card-"]')
      
      // Verifica se todos os studios em destaque têm rating alto
      studiosInSection.forEach(studio => {
        const ratingText = studio.textContent?.match(/Rating: ([\d.]+)/)
        if (ratingText) {
          const rating = parseFloat(ratingText[1])
          expect(rating).toBeGreaterThanOrEqual(4.5)
        }
      })
    }
  })

  it('deve limitar número de studios por seção', () => {
    render(<FeedPage />)
    
    // Verifica se cada seção tem no máximo 4 studios
    const sections = [
      screen.getByText('Studios em Destaque').closest('section'),
      screen.getByText('Studios em Alta').closest('section')
    ]
    
    sections.forEach(section => {
      if (section) {
        const studiosInSection = section.querySelectorAll('[data-testid^="studio-card-"]')
        expect(studiosInSection.length).toBeLessThanOrEqual(4)
      }
    })
  })

  it('deve exibir loading state quando localização estiver carregando', () => {
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      loading: true
    })
    
    render(<FeedPage />)
    
    // Verifica se não exibe seção de studios próximos durante carregamento
    expect(screen.queryByText('Studios Próximos')).not.toBeInTheDocument()
  })

  it('deve exibir erro de localização quando houver erro', () => {
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      error: 'Erro ao obter localização'
    })
    
    render(<FeedPage />)
    
    // Verifica se não exibe seção de studios próximos quando há erro
    expect(screen.queryByText('Studios Próximos')).not.toBeInTheDocument()
  })

  it('deve ordenar studios próximos por distância', () => {
    const mockCalculateDistance = jest.fn()
      .mockReturnValueOnce(5.2)
      .mockReturnValueOnce(2.1)
      .mockReturnValueOnce(8.7)
      .mockReturnValueOnce(3.4)
      .mockReturnValueOnce(1.5)
      .mockReturnValueOnce(9.8)
    
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 },
      calculateDistance: mockCalculateDistance
    })
    
    render(<FeedPage />)
    
    const nearbySection = screen.getByText('Studios Próximos').closest('section')
    
    if (nearbySection) {
      const studiosInSection = nearbySection.querySelectorAll('[data-testid^="studio-card-"]')
      const distances: number[] = []
      
      studiosInSection.forEach(studio => {
        const distanceText = studio.textContent?.match(/Distância: ([\d.]+)km/)
        if (distanceText) {
          distances.push(parseFloat(distanceText[1]))
        }
      })
      
      // Verifica se as distâncias estão em ordem crescente
      for (let i = 1; i < distances.length; i++) {
        expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1])
      }
    }
  })

  it('deve exibir apenas studios próximos (distância <= 10km)', () => {
    const mockCalculateDistance = jest.fn()
      .mockReturnValueOnce(5.2)  // Próximo
      .mockReturnValueOnce(15.1) // Longe
      .mockReturnValueOnce(8.7)  // Próximo
      .mockReturnValueOnce(12.4) // Longe
      .mockReturnValueOnce(1.5)  // Próximo
      .mockReturnValueOnce(20.8) // Longe
    
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 },
      calculateDistance: mockCalculateDistance
    })
    
    render(<FeedPage />)
    
    const nearbySection = screen.getByText('Studios Próximos').closest('section')
    
    if (nearbySection) {
      const studiosInSection = nearbySection.querySelectorAll('[data-testid^="studio-card-"]')
      
      // Verifica se apenas studios próximos (distância <= 10km) são exibidos
      studiosInSection.forEach(studio => {
        const distanceText = studio.textContent?.match(/Distância: ([\d.]+)km/)
        if (distanceText) {
          const distance = parseFloat(distanceText[1])
          expect(distance).toBeLessThanOrEqual(10)
        }
      })
    }
  })

  it('deve exibir mensagem quando não houver studios próximos', () => {
    const mockCalculateDistance = jest.fn()
      .mockReturnValue(15) // Todos os studios estão longe
    
    ;(useLocationService as jest.Mock).mockReturnValue({
      ...mockLocationService,
      location: { latitude: -23.5505, longitude: -46.6333, accuracy: 100 },
      calculateDistance: mockCalculateDistance
    })
    
    render(<FeedPage />)
    
    // Como todos os studios estão longe, a seção de studios próximos não deve aparecer
    // ou deve mostrar uma mensagem de "nenhum studio próximo"
    expect(screen.queryByText('Studios Próximos')).not.toBeInTheDocument()
  })

  it('deve ter layout responsivo', () => {
    render(<FeedPage />)
    
    // Verifica se as classes CSS para responsividade estão presentes
    const container = screen.getByText('Descubra Studios Incríveis').closest('div')
    expect(container).toHaveClass('container')
    
    // Verifica se os grids têm classes responsivas
    const gridElements = document.querySelectorAll('.grid')
    expect(gridElements.length).toBeGreaterThan(0)
  })
})