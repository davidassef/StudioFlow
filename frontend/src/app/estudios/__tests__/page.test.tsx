import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock absolutamente TUDO com estrutura correta
jest.mock('../../../components/ui/select', () => ({
  __esModule: true,
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectContent: ({ children }: any) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children }: any) => <div data-testid="select-item">{children}</div>,
  SelectTrigger: ({ children }: any) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ children }: any) => <span data-testid="select-value">{children}</span>,
}));

jest.mock('../../../components/ui/card', () => ({
  __esModule: true,
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
}));

jest.mock('../../../components/ui/tabs', () => ({
  __esModule: true,
  Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
  TabsContent: ({ children }: any) => <div data-testid="tabs-content">{children}</div>,
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children }: any) => <div data-testid="tabs-trigger">{children}</div>,
}));

jest.mock('../../../components/ui/button', () => ({
  __esModule: true,
  Button: ({ children, onClick }: any) => <button data-testid="button" onClick={onClick}>{children}</button>,
}));

jest.mock('../../../components/ui/input', () => ({
  __esModule: true,
  Input: (props: any) => <input data-testid="input" {...props} />,
}));

jest.mock('../../../components/ui/LoadingStates', () => ({
  __esModule: true,
  LoadingOverlay: () => <div data-testid="loading-overlay">Loading...</div>,
  StudioCardSkeleton: () => <div data-testid="skeleton">Loading...</div>,
  EmptyState: ({ title }: any) => <div data-testid="empty-state">{title}</div>,
}));

jest.mock('../../../components/layout/Layout', () => ({
  __esModule: true,
  Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

jest.mock('../../../components/search/AdvancedSearch', () => ({
  __esModule: true,
  AdvancedSearch: () => <div data-testid="advanced-search">Advanced Search</div>,
}));

jest.mock('../../../components/studios/StudioCard', () => ({
  __esModule: true,
  StudioCard: ({ studio }: any) => (
    <div data-testid={`studio-card-${studio.id}`}>
      <h3>{studio.name}</h3>
      <p>{studio.description}</p>
    </div>
  ),
}));

jest.mock('../../../components/location/LocationService', () => ({
  __esModule: true,
  LocationService: {
    useLocation: () => ({ location: null, loading: false, error: null }),
  },
  useLocationService: () => ({
    calculateDistance: () => 1.5,
    getLocation: () => Promise.resolve({ lat: -23.5505, lng: -46.6333 }),
  }),
}));



jest.mock('lucide-react', () => ({
  __esModule: true,
  Building: () => <div>Icon</div>,
  Grid3X3: () => <div>Icon</div>,
  List: () => <div>Icon</div>,
  SortAsc: () => <div>Icon</div>,
  SortDesc: () => <div>Icon</div>,
  Navigation: () => <div>Icon</div>,
}));

// Importar o componente após todos os mocks
import EstudiosPage from '../page';

describe('EstudiosPage', () => {
  it('deve renderizar sem erro', () => {
    const { container } = render(<EstudiosPage />);
    expect(container).toBeInTheDocument();
  });

  it('deve exibir o título da página', async () => {
    render(<EstudiosPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Encontre o Studio Perfeito/i)).toBeInTheDocument();
    });
  });

  it('deve carregar a estrutura básica', async () => {
    render(<EstudiosPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('advanced-search')).toBeInTheDocument();
    });
  });
});