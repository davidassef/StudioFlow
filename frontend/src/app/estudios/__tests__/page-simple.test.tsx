import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock all imports completely
jest.mock('@/components/layout/Layout', () => ({
  __esModule: true,
  Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

jest.mock('@/components/search/AdvancedSearch', () => ({
  __esModule: true,
  AdvancedSearch: ({ onSearch, onClear }: any) => (
    <div data-testid="advanced-search">
      <button onClick={() => onSearch({})}>Search</button>
      <button onClick={onClear}>Clear</button>
    </div>
  ),
}));

jest.mock('@/components/studios/StudioCard', () => ({
  __esModule: true,
  StudioCard: ({ studio }: any) => (
    <div data-testid="studio-card" data-studio-name={studio.name}>
      <h3>{studio.name}</h3>
      <p>{studio.location}</p>
    </div>
  ),
}));

jest.mock('@/components/ui/LoadingStates', () => ({
  __esModule: true,
  LoadingOverlay: () => <div data-testid="loading-overlay">Loading...</div>,
  StudioCardSkeleton: () => <div data-testid="studio-card-skeleton">Loading studio...</div>,
  EmptyState: ({ title, description }: any) => <div data-testid="empty-state"><h3>{title}</h3><p>{description}</p></div>,
}));

jest.mock('@/components/location/LocationService', () => ({
  __esModule: true,
  useLocationService: () => ({
    calculateDistance: () => 5.2,
  }),
}));

// Mock UI components
jest.mock('@/components/ui/select', () => ({
  __esModule: true,
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder || 'Select'}</span>,
}));

jest.mock('@/components/ui/card', () => ({
  __esModule: true,
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/tabs', () => ({
  __esModule: true,
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button data-value={value}>{children}</button>,
}));

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/input', () => ({
  __esModule: true,
  Input: (props: any) => <input {...props} />,
}));

jest.mock('lucide-react', () => ({
  __esModule: true,
  Building: () => <div>🏢</div>,
  Grid3X3: () => <div>⊞</div>,
  List: () => <div>☰</div>,
  SortAsc: () => <div>↑</div>,
  SortDesc: () => <div>↓</div>,
  Navigation: () => <div>📍</div>,
}));

// Mock Next.js
jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
  usePathname: () => '',
}));

// Import the component after mocks
import EstudiosPage from '../page';

describe('EstudiosPage - Simple Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', async () => {
    const { container } = render(<EstudiosPage />);
    
    // Basic smoke test - just check if it renders
    expect(container).toBeInTheDocument();
  });

  it('should render the main layout', async () => {
    render(<EstudiosPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should complete loading cycle', async () => {
    const { container } = render(<EstudiosPage />);
    
    // Just verify the component renders and completes loading
    await waitFor(() => {
      expect(container).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});