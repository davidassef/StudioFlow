import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock all dependencies with proper implementations
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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: () => <span data-testid="heart-icon">♥</span>,
  TrendingUp: () => <span data-testid="trending-up-icon">📈</span>,
  MapPin: () => <span data-testid="map-pin-icon">📍</span>,
  Clock: () => <span data-testid="clock-icon">🕐</span>,
  Star: () => <span data-testid="star-icon">⭐</span>,
  Music: () => <span data-testid="music-icon">🎵</span>,
  Headphones: () => <span data-testid="headphones-icon">🎧</span>,
  Mic: () => <span data-testid="mic-icon">🎤</span>,
  Radio: () => <span data-testid="radio-icon">📻</span>,
  RefreshCw: () => <span data-testid="refresh-icon">🔄</span>,
}));

// Mock Layout component with forwardRef
jest.mock('@/components/layout/Layout', () => {
  const React = require('react');
  return {
    Layout: React.forwardRef(({ children, user }: { children: React.ReactNode; user: any }, ref: any) => (
      <div ref={ref} data-testid="layout">
        <div data-testid="user-info">{user?.name}</div>
        {children}
      </div>
    )),
  };
});

// Mock StudioCard component with forwardRef
jest.mock('@/components/studios/StudioCard', () => {
  const React = require('react');
  return {
    StudioCard: React.forwardRef(({ studio, onViewDetails, onBook }: any, ref: any) => (
      <div ref={ref} data-testid="studio-card" data-studio-id={studio.id}>
        <h3 data-testid="studio-name">{studio.name}</h3>
        <p data-testid="studio-description">{studio.description}</p>
        <button onClick={() => onViewDetails(studio)} data-testid="view-details">
          Ver Detalhes
        </button>
        <button onClick={() => onBook(studio)} data-testid="book-button">
          Agendar
        </button>
      </div>
    )),
  };
});

// Mock LocationService
jest.mock('@/components/location/LocationService', () => ({
  LocationService: ({ onLocationUpdate, onLocationError }: any) => {
    React.useEffect(() => {
      onLocationUpdate?.({
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 10,
        timestamp: Date.now(),
      });
    }, [onLocationUpdate]);
    return <div data-testid="location-service" />;
  },
  useLocationService: () => ({
    calculateDistance: jest.fn().mockReturnValue(5.2),
    requestLocation: jest.fn(),
    getCurrentLocation: jest.fn(),
  }),
}));

// Mock UI components with forwardRef
jest.mock('@/components/ui', () => {
  const React = require('react');
  return {
    Card: React.forwardRef(({ children, className }: any, ref: any) => (
      <div ref={ref} data-testid="card" className={className}>
        {children}
      </div>
    )),
    CardContent: React.forwardRef(({ children, className }: any, ref: any) => (
      <div ref={ref} data-testid="card-content" className={className}>
        {children}
      </div>
    )),
    CardHeader: React.forwardRef(({ children, className }: any, ref: any) => (
      <div ref={ref} data-testid="card-header" className={className}>
        {children}
      </div>
    )),
    CardTitle: React.forwardRef(({ children, className }: any, ref: any) => (
      <div ref={ref} data-testid="card-title" className={className}>
        {children}
      </div>
    )),
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, className }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/badge', () => {
  const React = require('react');
  return {
    Badge: React.forwardRef(({ children, variant, className }: any, ref: any) => (
      <span ref={ref} data-testid="badge" className={className} data-variant={variant}>
        {children}
      </span>
    )),
  };
});

// Import the actual component
import FeedPage from '../page';

describe('FeedPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without createFiberFromTypeAndProps error', () => {
    const { container } = render(<FeedPage />);
    expect(container).toBeInTheDocument();
  });

  it('should display Feed heading', () => {
    render(<FeedPage />);
    expect(screen.getByText('Feed')).toBeInTheDocument();
  });

  it('should display feed description', () => {
    render(<FeedPage />);
    expect(screen.getByText(/Descubra estúdios incríveis/i)).toBeInTheDocument();
  });

  it('should render refresh button', () => {
    render(<FeedPage />);
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
  });

  it('should render LocationService component', () => {
    render(<FeedPage />);
    expect(screen.getByTestId('location-service')).toBeInTheDocument();
  });

  it('should render user info in Layout', () => {
    render(<FeedPage />);
    expect(screen.getByTestId('user-info')).toHaveTextContent('João Silva');
  });

  it('should render studio cards for featured studios', async () => {
    render(<FeedPage />);
    
    await waitFor(() => {
      const studioCards = screen.getAllByTestId('studio-card');
      expect(studioCards.length).toBeGreaterThan(0);
    });
  });

  it('should render studio cards for trending studios', async () => {
    render(<FeedPage />);
    
    await waitFor(() => {
      const studioCards = screen.getAllByTestId('studio-card');
      expect(studioCards.length).toBeGreaterThan(0);
    });
  });

  it('should render nearby studios section', async () => {
    render(<FeedPage />);
    
    await waitFor(() => {
      const studioCards = screen.getAllByTestId('studio-card');
      expect(studioCards.length).toBeGreaterThan(0);
    });
  });

  it('should render news section', () => {
    render(<FeedPage />);
    expect(screen.getByText(/Novidades/i)).toBeInTheDocument();
  });

  it('should render studio categories', () => {
    render(<FeedPage />);
    expect(screen.getByText(/Categorias de Estúdios/i)).toBeInTheDocument();
  });
});