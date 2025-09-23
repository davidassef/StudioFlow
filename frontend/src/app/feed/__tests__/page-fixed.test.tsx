import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock minimal dependencies to prevent createFiberFromTypeAndProps error
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/feed',
}));

// Mock icons with simple components
jest.mock('lucide-react', () => ({
  Heart: () => <span>♥</span>,
  TrendingUp: () => <span>📈</span>,
  MapPin: () => <span>📍</span>,
  Clock: () => <span>🕐</span>,
  Star: () => <span>⭐</span>,
  Music: () => <span>🎵</span>,
  Headphones: () => <span>🎧</span>,
  Mic: () => <span>🎤</span>,
  Radio: () => <span>📻</span>,
  RefreshCw: () => <span>🔄</span>,
}));

// Mock Layout with proper structure
jest.mock('@/components/layout/Layout', () => {
  return function Layout({ children, user }: { children: React.ReactNode; user: any }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock StudioCard
jest.mock('@/components/studios/StudioCard', () => {
  return function StudioCard({ studio }: { studio: any }) {
    return <div data-testid={`studio-${studio.id}`}>{studio.name}</div>;
  };
});

// Mock LocationService
jest.mock('@/components/location/LocationService', () => {
  return {
    LocationService: function LocationService({ onLocationUpdate }: any) {
      React.useEffect(() => {
        onLocationUpdate?.({
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 10,
        });
      }, [onLocationUpdate]);
      return <div data-testid="location-service" />;
    },
    useLocationService: () => ({
      calculateDistance: jest.fn().mockReturnValue(5.2),
      requestLocation: jest.fn(),
      getCurrentLocation: jest.fn(),
    }),
  };
});

// Mock UI components with forwardRef
jest.mock('@/components/ui/card', () => {
  const React = require('react');
  return {
    Card: React.forwardRef(({ children, className }: any, ref: any) => (
      <div ref={ref} className={className} data-testid="card">{children}</div>
    )),
    CardHeader: React.forwardRef(({ children, className }: any, ref: any) => (
      <div ref={ref} className={className} data-testid="card-header">{children}</div>
    )),
    CardTitle: React.forwardRef(({ children, className }: any, ref: any) => (
      <h3 ref={ref} className={className} data-testid="card-title">{children}</h3>
    )),
    CardContent: React.forwardRef(({ children, className }: any, ref: any) => (
      <div ref={ref} className={className} data-testid="card-content">{children}</div>
    )),
    CardDescription: React.forwardRef(({ children, className }: any, ref: any) => (
      <p ref={ref} className={className} data-testid="card-description">{children}</p>
    )),
  };
});

jest.mock('@/components/ui/button', () => {
  const React = require('react');
  return {
    Button: React.forwardRef(({ children, onClick, disabled, className }: any, ref: any) => (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-testid="button"
      >
        {children}
      </button>
    )),
  };
});

jest.mock('@/components/ui/badge', () => {
  const React = require('react');
  return {
    Badge: React.forwardRef(({ children, className }: any, ref: any) => (
      <span ref={ref} className={className} data-testid="badge">{children}</span>
    )),
  };
});

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
    isAuthenticated: true,
  }),
}));

// Import the component
import FeedPage from '../page';

describe('FeedPage - Testes Estabilizados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar sem erros', () => {
    const { container } = render(<FeedPage />);
    expect(container).toBeInTheDocument();
  });

  it('deve conter o título Feed', () => {
    render(<FeedPage />);
    expect(screen.getByText('Feed')).toBeInTheDocument();
  });

  it('deve conter a descrição da página', () => {
    render(<FeedPage />);
    expect(screen.getByText(/Descubra estúdios incríveis/i)).toBeInTheDocument();
  });

  it('deve renderizar o serviço de localização', () => {
    render(<FeedPage />);
    expect(screen.getByTestId('location-service')).toBeInTheDocument();
  });
});