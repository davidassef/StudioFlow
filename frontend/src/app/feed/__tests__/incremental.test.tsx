import React from 'react'
import { render } from '@testing-library/react'

// Mock apenas o necessário para testar o FeedPage
jest.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}))

jest.mock('@/components/location/LocationService', () => ({
  useLocationService: () => ({
    calculateDistance: jest.fn().mockReturnValue(5)
  }),
  LocationService: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock dos componentes de UI
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className}>{children}</h3>
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>
}))

jest.mock('@/components/studios/StudioCard', () => ({
  StudioCard: ({ studio }: any) => <div data-testid={`studio-${studio.id}`}>{studio.name}</div>
}))

// Mock dos ícones
jest.mock('lucide-react', () => ({
  Heart: () => <div>❤️</div>,
  TrendingUp: () => <div>📈</div>,
  MapPin: () => <div>📍</div>,
  Clock: () => <div>🕐</div>,
  Star: () => <div>⭐</div>,
  Music: () => <div>🎵</div>,
  Headphones: () => <div>🎧</div>,
  Mic: () => <div>🎤</div>,
  Radio: () => <div>📻</div>,
  RefreshCw: () => <div>🔄</div>,
}))

// Mock do useAuth
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false
  })
}))

// Mock do router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

// Importar o FeedPage com mocks já aplicados
import FeedPage from '../page'

describe('FeedPage Incremental Test', () => {
  it('should render FeedPage with all mocks', () => {
    const { container } = render(<FeedPage />)
    expect(container).toBeInTheDocument()
  })
})