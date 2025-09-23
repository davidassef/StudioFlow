import React from 'react'
import { render, screen } from '@testing-library/react'
import FeedPage from '../page'
import { useLocationService } from '@/components/location/LocationService'

// Mock do LocationService
jest.mock('@/components/location/LocationService', () => ({
  __esModule: true,
  useLocationService: jest.fn(),
  LocationService: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock do StudioCard
jest.mock('@/components/studios/StudioCard', () => {
  return function MockStudioCard({ studio }: any) {
    return <div data-testid={`studio-card-${studio.id}`}>{studio.name}</div>
  }
})

// Mock do router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

// Mock dos ícones
jest.mock('lucide-react', () => ({
  Clock: () => <div />,
  MapPin: () => <div />,
  Star: () => <div />,
  Calendar: () => <div />,
  TrendingUp: () => <div />,
  Users: () => <div />,
  ArrowRight: () => <div />,
  Heart: () => <div />,
  Music: () => <div />,
  Headphones: () => <div />,
  Mic: () => <div />,
  Radio: () => <div />,
  RefreshCw: () => <div />
}))

// Mock dos componentes de UI
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className}>{children}</h3>
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({ children }: any) => <button>{children}</button>
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>
}))

// Mock do useAuth
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false
  })
}))

// Mock do Layout
jest.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
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

describe('FeedPage Simple Test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLocationService as jest.Mock).mockReturnValue(mockLocationService)
  })

  it('should render without crashing', () => {
    const { container } = render(<FeedPage />)
    expect(container).toBeInTheDocument()
  })

  it('should display Feed heading', () => {
    render(<FeedPage />)
    expect(screen.getByText('Feed')).toBeInTheDocument()
  })
})