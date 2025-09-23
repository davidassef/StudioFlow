export interface Studio {
  id: string;
  nome: string;
  descricao: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  website?: string;
  capacidade: number;
  preco_hora: number;
  avaliacao: number;
  total_avaliacoes: number;
  equipamentos: string[];
  tipo_estudio: string;
  fotos: string[];
  foto_perfil?: string;
  is_disponivel: boolean;
  horario_funcionamento: {
    segunda: { abertura: string; fechamento: string };
    terca: { abertura: string; fechamento: string };
    quarta: { abertura: string; fechamento: string };
    quinta: { abertura: string; fechamento: string };
    sexta: { abertura: string; fechamento: string };
    sabado: { abertura: string; fechamento: string };
    domingo: { abertura: string; fechamento: string };
  };
  latitude: number;
  longitude: number;
  distancia?: number;
  
  // Propriedades compatíveis com favoritesStore
  name: string;
  description: string;
  location: string;
  pricePerHour: number;
  rating: number;
  images: string[];
  equipment: string[];
  capacity: number;
  studioType: string;
  availability: boolean;
}

export interface StudioFilters {
  search?: string;
  cidade?: string;
  preco_min?: number;
  preco_max?: number;
  capacidade_min?: number;
  equipamentos?: string[];
  disponivel?: boolean;
  avaliacao_min?: number;
}

export interface StudioSearchParams {
  page?: number;
  limit?: number;
  filters?: StudioFilters;
  sort_by?: 'nome' | 'avaliacao' | 'preco_hora' | 'created_at';
  sort_order?: 'asc' | 'desc';
}