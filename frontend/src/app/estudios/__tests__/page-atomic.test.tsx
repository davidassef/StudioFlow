import React from 'react';
import { render } from '@testing-library/react';

// Mock absolutamente TUDO
jest.mock('../../../components/ui/select', () => ({
  __esModule: true,
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('../../../components/ui/card', () => ({
  __esModule: true,
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../components/ui/tabs', () => ({
  __esModule: true,
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../components/ui/button', () => ({
  __esModule: true,
  Button: ({ children }: any) => <button>{children}</button>,
}));

jest.mock('../../../components/ui/input', () => ({
  __esModule: true,
  Input: () => <input />,
}));

jest.mock('../../../components/ui/LoadingStates', () => ({
  __esModule: true,
  LoadingOverlay: () => null,
  StudioCardSkeleton: () => <div>Loading...</div>,
  EmptyState: () => <div>Empty</div>,
}));

jest.mock('../../../components/layout/Layout', () => ({
  __esModule: true,
  Layout: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../components/search/AdvancedSearch', () => ({
  __esModule: true,
  AdvancedSearch: () => <div>AdvancedSearch</div>,
}));

jest.mock('../../../components/studios/StudioCard', () => ({
  __esModule: true,
  StudioCard: () => <div>StudioCard</div>,
}));

jest.mock('../../../components/location/LocationService', () => ({
  __esModule: true,
  LocationService: {
    useLocation: () => ({ location: null, loading: false, error: null }),
  },
  useLocationService: () => ({
    calculateDistance: () => 1.5,
    getLocation: () => Promise.resolve({ lat: 0, lng: 0 }),
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

// Importar o componente real após todos os mocks
import EstudiosPage from '../page';

describe('EstudiosPage - Teste Atômico', () => {
  it('deve renderizar sem erro', () => {
    const { container } = render(<EstudiosPage />);
    expect(container).toBeInTheDocument();
  });
});