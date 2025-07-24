import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StudioCard } from '../StudioCard'
import { Studio } from '@/types/studio'

// Mock do Zustand store
jest.mock('@/stores/favoritesStore', () => ({
  useFavoritesStore: () => ({
    favorites: [],
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    isFavorite: jest.fn(() => false)
  })
}))

const mockStudio: Studio = {
  id: '1',
  nome: 'Studio Teste',
  descricao: 'Um estúdio incrível para gravações',
  endereco: 'Rua Teste, 123',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01234-567',
  telefone: '(11) 99999-9999',
  email: 'contato@studioteste.com',
  website: 'https://studioteste.com',
  capacidade: 10,
  preco_hora: 150.00,
  avaliacao: 4.5,
  total_avaliacoes: 25,
  equipamentos: ['Microfone', 'Mesa de Som', 'Instrumentos'],
  tipo_estudio: 'Gravação',
  fotos: ['https://example.com/foto1.jpg'],
  foto_perfil: 'https://example.com/perfil.jpg',
  is_disponivel: true,
  horario_funcionamento: {
    segunda: { abertura: '09:00', fechamento: '18:00' },
    terca: { abertura: '09:00', fechamento: '18:00' },
    quarta: { abertura: '09:00', fechamento: '18:00' },
    quinta: { abertura: '09:00', fechamento: '18:00' },
    sexta: { abertura: '09:00', fechamento: '18:00' },
    sabado: { abertura: '10:00', fechamento: '16:00' },
    domingo: { abertura: '', fechamento: '' }
  },
  latitude: -23.5505,
  longitude: -46.6333,
  distancia: 2.5
}

describe('StudioCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar as informações básicas do estúdio', () => {
    render(<StudioCard studio={mockStudio} />)
    
    expect(screen.getByText('Studio Teste')).toBeInTheDocument()
    expect(screen.getByText('Um estúdio incrível para gravações')).toBeInTheDocument()
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument()
    expect(screen.getByText('R$ 150/hora')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(25 avaliações)')).toBeInTheDocument()
    expect(screen.getByText('Até 10 pessoas')).toBeInTheDocument()
  })

  it('deve exibir a distância quando fornecida', () => {
    render(<StudioCard studio={mockStudio} />)
    
    expect(screen.getByText('2.5 km')).toBeInTheDocument()
  })

  it('deve exibir o status de disponibilidade', () => {
    render(<StudioCard studio={mockStudio} />)
    
    expect(screen.getByText('Disponível')).toBeInTheDocument()
  })

  it('deve exibir status indisponível quando o estúdio não estiver disponível', () => {
    const studioIndisponivel = { ...mockStudio, is_disponivel: false }
    render(<StudioCard studio={studioIndisponivel} />)
    
    expect(screen.getByText('Indisponível')).toBeInTheDocument()
  })

  it('deve exibir os equipamentos do estúdio', () => {
    render(<StudioCard studio={mockStudio} />)
    
    expect(screen.getByText('Microfone')).toBeInTheDocument()
    expect(screen.getByText('Mesa de Som')).toBeInTheDocument()
    expect(screen.getByText('Instrumentos')).toBeInTheDocument()
  })

  it('deve ter botão de agendar funcional', () => {
    render(<StudioCard studio={mockStudio} />)
    
    const agendarButton = screen.getByRole('button', { name: /agendar/i })
    expect(agendarButton).toBeInTheDocument()
    expect(agendarButton).not.toBeDisabled()
  })

  it('deve desabilitar botão de agendar quando estúdio indisponível', () => {
    const studioIndisponivel = { ...mockStudio, is_disponivel: false }
    render(<StudioCard studio={studioIndisponivel} />)
    
    const agendarButton = screen.getByRole('button', { name: /agendar/i })
    expect(agendarButton).toBeDisabled()
  })

  it('deve ter funcionalidade de favoritar', async () => {
    const mockAddFavorite = jest.fn()
    const mockUseFavoritesStore = jest.fn(() => ({
      favorites: [],
      addFavorite: mockAddFavorite,
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(() => false)
    }))
    
    jest.doMock('@/stores/favoritesStore', () => ({
      useFavoritesStore: mockUseFavoritesStore
    }))
    
    render(<StudioCard studio={mockStudio} />)
    
    const favoriteButton = screen.getByRole('button', { name: /favoritar/i })
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      expect(mockAddFavorite).toHaveBeenCalledWith(mockStudio.id)
    })
  })

  it('deve exibir skeleton quando em estado de carregamento', () => {
    render(<StudioCard studio={mockStudio} loading={true} />)
    
    // Verifica se os elementos de skeleton estão presentes
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('deve renderizar imagem do estúdio quando fornecida', () => {
    render(<StudioCard studio={mockStudio} />)
    
    const image = screen.getByRole('img', { name: /studio teste/i })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockStudio.foto_perfil)
  })

  it('deve exibir placeholder quando não há imagem', () => {
    const studioSemImagem = { ...mockStudio, foto_perfil: undefined }
    render(<StudioCard studio={studioSemImagem} />)
    
    const placeholder = screen.getByTestId('image-placeholder')
    expect(placeholder).toBeInTheDocument()
  })

  it('deve formatar corretamente o preço', () => {
    const studioPrecoAlto = { ...mockStudio, preco_hora: 1250.50 }
    render(<StudioCard studio={studioPrecoAlto} />)
    
    expect(screen.getByText('R$ 1.251/hora')).toBeInTheDocument()
  })

  it('deve exibir avaliação com estrelas', () => {
    render(<StudioCard studio={mockStudio} />)
    
    // Verifica se as estrelas estão sendo renderizadas
    const stars = screen.getAllByTestId('star-icon')
    expect(stars).toHaveLength(5) // 5 estrelas no total
  })
})