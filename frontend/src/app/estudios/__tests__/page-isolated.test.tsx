import React from 'react'
import { render, screen } from '@testing-library/react'
import EstudiosPage from '../page'

// Mock completo de todos os componentes e hooks
jest.mock('@/components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>
  }
})

jest.mock('@/components/location/LocationService', () => ({
  useLocationService: () => ({
    location: null,
    loading: false,
    error: null,
    permission: 'prompt',
    getCurrentLocation: jest.fn(),
    clearLocation: jest.fn(),
    calculateDistance: jest.fn(() => 2.5),
    formatCoordinates: jest.fn(),
    isSupported: jest.fn(() => true)
  }),
  LocationService: ({ children, onLocationUpdate, onLocationError, autoRequest, showUI }: any) => (
    <div data-testid="location-service">
      <button onClick={() => onLocationUpdate && onLocationUpdate({ latitude: -23.5505, longitude: -46.6333 })}>
        Simular Localização
      </button>
      {children}
    </div>
  )
}))

jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    checkAuth: jest.fn(),
    refreshToken: jest.fn()
  })
}))

jest.mock('@/components/search/AdvancedSearch', () => {
  return function MockAdvancedSearch({ onFiltersChange }: any) {
    return (
      <div data-testid="advanced-search">
        <button onClick={() => onFiltersChange({})}>Limpar</button>
      </div>
    )
  }
})

jest.mock('@/components/studios/StudioCard', () => {
  return function MockStudioCard({ studio, distance }: any) {
    return (
      <div data-testid={`studio-card-${studio.id}`}>
        <h3>{studio.name}</h3>
        <p>R$ {studio.pricePerHour}/hora</p>
        {distance && <p>Distância: {distance}km</p>}
      </div>
    )
  }
})

jest.mock('@/components/ui/LoadingStates', () => ({
  LoadingOverlay: () => <div data-testid="loading-overlay">Loading...</div>,
  StudioCardSkeleton: () => <div data-testid="studio-skeleton">Loading Studio...</div>,
  EmptyState: ({ message }: { message: string }) => <div data-testid="empty-state">{message}</div>
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  )
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div data-testid="select">{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-testid={`select-item-${value}`}>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <div data-testid="select-value">{children}</div>
}))

describe('EstudiosPage - Teste Isolado', () => {
  it('deve renderizar a página sem erros', () => {
    render(<EstudiosPage />)
    
    // Verificar se o título está presente
    expect(screen.getByText('Encontre o Studio Perfeito')).toBeInTheDocument()
  })

  it('deve renderizar o layout mockado', () => {
    render(<EstudiosPage />)
    
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('deve renderizar o search input', () => {
    render(<EstudiosPage />)
    
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument()
  })
})