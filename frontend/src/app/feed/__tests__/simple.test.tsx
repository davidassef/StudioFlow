import React from 'react';
import { render } from '@testing-library/react';

// Mock just the essential dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
  usePathname: () => '/feed',
}));

// Mock all UI components simply with forwardRef
jest.mock('@/components/ui', () => {
  const React = require('react');
  return {
    Card: React.forwardRef(({ children, className }: any, ref: any) => 
      <div ref={ref} className={className}>{children}</div>
    ),
    CardContent: React.forwardRef(({ children, className }: any, ref: any) => 
      <div ref={ref} className={className}>{children}</div>
    ),
    CardHeader: React.forwardRef(({ children, className }: any, ref: any) => 
      <div ref={ref} className={className}>{children}</div>
    ),
    CardTitle: React.forwardRef(({ children, className }: any, ref: any) => 
      <h3 ref={ref} className={className}>{children}</h3>
    ),
    CardDescription: React.forwardRef(({ children, className }: any, ref: any) => 
      <p ref={ref} className={className}>{children}</p>
    ),
    CardFooter: React.forwardRef(({ children, className }: any, ref: any) => 
      <div ref={ref} className={className}>{children}</div>
    ),
  };
});

jest.mock('@/components/ui/button', () => {
  const React = require('react');
  return {
    Button: React.forwardRef(({ children, onClick, disabled, variant, className }: any, ref: any) => 
      <button ref={ref} onClick={onClick} disabled={disabled} className={className} data-variant={variant}>
        {children}
      </button>
    ),
  };
});

jest.mock('@/components/ui/badge', () => {
  const React = require('react');
  return {
    Badge: React.forwardRef(({ children, variant, className }: any, ref: any) => 
      <span ref={ref} className={className} data-variant={variant}>{children}</span>
    ),
  };
});

// Mock other components
// Mock other components with forwardRef
jest.mock('@/components/layout/Layout', () => {
  const React = require('react');
  return {
    Layout: React.forwardRef(({ children, user }: any, ref: any) => 
      <div ref={ref}>{children}</div>
    ),
  };
});

jest.mock('@/components/studios/StudioCard', () => {
  const React = require('react');
  return {
    StudioCard: React.forwardRef(({ studio, onViewDetails, onBook }: any, ref: any) => 
      <div ref={ref} data-testid="studio-card" data-studio-id={studio.id}>
        <h3>{studio.name}</h3>
      </div>
    ),
  };
});

jest.mock('@/components/location/LocationService', () => {
  const React = require('react');
  return {
    LocationService: React.forwardRef(({ onLocationUpdate }: any, ref: any) => {
      React.useEffect(() => {
        onLocationUpdate?.({
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 10,
          timestamp: Date.now(),
        });
      }, [onLocationUpdate]);
      return <div ref={ref} />;
    }),
    useLocationService: () => ({
      calculateDistance: jest.fn().mockReturnValue(5.2),
      requestLocation: jest.fn(),
      getCurrentLocation: jest.fn(),
    }),
  };
});

jest.mock('lucide-react', () => ({
  Heart: () => <span>♥</span>,
  TrendingUp: () => <span>📈</span>,
  MapPin: () => <span>📍</span>,
  RefreshCw: () => <span>🔄</span>,
}));

// Import the actual component
import FeedPage from '../page';

describe('FeedPage Simple Test', () => {
  it('should render without errors', () => {
    const { container } = render(<FeedPage />);
    expect(container).toBeInTheDocument();
  });
});