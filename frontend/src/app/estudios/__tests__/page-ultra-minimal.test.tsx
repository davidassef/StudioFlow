import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock absolutamente minimalista - usando paths corretos
jest.mock('../../../components/ui/select', () => ({
  Select: ({ children, value, onValueChange, ...props }: any) => <div data-testid="select" {...props}>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value, onValueChange, ...props }: any) => <div {...props}>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ children, placeholder }: any) => <span>{children || placeholder}</span>,
}));

jest.mock('../../../components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../components/ui/tabs', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
}));

jest.mock('../../../components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('../../../components/ui/LoadingStates', () => ({
  LoadingOverlay: () => <div>Loading...</div>,
  StudioCardSkeleton: () => <div>Skeleton</div>,
  EmptyState: ({ title }: any) => <div>{title}</div>,
}));

// Mock de componentes com paths corretos
jest.mock('../../../components/layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../components/search/AdvancedSearch', () => ({
  __esModule: true,
  default: ({ onSearch, onClearSearch }: any) => <div>AdvancedSearch</div>,
}));

jest.mock('../../../components/studios/StudioCard', () => ({
  __esModule: true,
  default: ({ studio }: any) => <div>StudioCard: {studio.name}</div>,
}));

// Mock do LocationService - estrutura correta baseada no import
jest.mock('../../../components/location/LocationService', () => ({
  __esModule: true,
  LocationService: {
    useLocation: () => ({
      location: { lat: -23.5505, lng: -46.6333 },
      loading: false,
      error: null,
    }),
  },
  useLocationService: () => ({
    calculateDistance: () => 1.5,
    getLocation: () => Promise.resolve({ lat: -23.5505, lng: -46.6333 }),
  }),
}));

// Mock do lucide-react
jest.mock('lucide-react', () => ({
  Building: () => <div>BuildingIcon</div>,
  Grid3X3: () => <div>GridIcon</div>,
  List: () => <div>ListIcon</div>,
  SortAsc: () => <div>SortAscIcon</div>,
  SortDesc: () => <div>SortDescIcon</div>,
  Navigation: () => <div>NavigationIcon</div>,
}));

// Importar o componente após todos os mocks
import EstudiosPage from '../page';

describe('EstudiosPage - Teste Ultra Minimalista', () => {
  it('deve renderizar sem crashar', () => {
    const { container } = render(<EstudiosPage />);
    expect(container).toBeInTheDocument();
  });

  it('deve mostrar o título da página', () => {
    render(<EstudiosPage />);
    expect(screen.getByText(/Estúdios/i)).toBeInTheDocument();
  });
});