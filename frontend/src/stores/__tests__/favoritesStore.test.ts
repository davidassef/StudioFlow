import { renderHook, act } from '@testing-library/react'
import { useFavoritesStore } from '../favoritesStore'

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('favoritesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Reset do store antes de cada teste
    const { result } = renderHook(() => useFavoritesStore())
    act(() => {
      result.current.clearFavorites()
    })
  })

  it('deve inicializar com lista vazia quando não há dados no localStorage', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    expect(result.current.favorites).toEqual([])
    expect(result.current.getFavoriteCount()).toBe(0)
  })

  it('deve carregar favoritos do localStorage na inicialização', () => {
    const savedFavorites = ['studio1', 'studio2', 'studio3']
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFavorites))
    
    const { result } = renderHook(() => useFavoritesStore())
    
    expect(result.current.favorites).toEqual(savedFavorites)
    expect(result.current.getFavoriteCount()).toBe(3)
  })

  it('deve adicionar studio aos favoritos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result.current.addFavorite('studio1')
    })
    
    expect(result.current.favorites).toContain('studio1')
    expect(result.current.getFavoriteCount()).toBe(1)
    expect(result.current.isFavorite('studio1')).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'studioflow_favorites',
      JSON.stringify(['studio1'])
    )
  })

  it('deve remover studio dos favoritos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    // Adiciona primeiro
    act(() => {
      result.current.addFavorite('studio1')
      result.current.addFavorite('studio2')
    })
    
    expect(result.current.favorites).toEqual(['studio1', 'studio2'])
    
    // Remove um
    act(() => {
      result.current.removeFavorite('studio1')
    })
    
    expect(result.current.favorites).toEqual(['studio2'])
    expect(result.current.getFavoriteCount()).toBe(1)
    expect(result.current.isFavorite('studio1')).toBe(false)
    expect(result.current.isFavorite('studio2')).toBe(true)
  })

  it('deve alternar status de favorito', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    // Adiciona aos favoritos
    act(() => {
      result.current.toggleFavorite('studio1')
    })
    
    expect(result.current.isFavorite('studio1')).toBe(true)
    expect(result.current.getFavoriteCount()).toBe(1)
    
    // Remove dos favoritos
    act(() => {
      result.current.toggleFavorite('studio1')
    })
    
    expect(result.current.isFavorite('studio1')).toBe(false)
    expect(result.current.getFavoriteCount()).toBe(0)
  })

  it('não deve adicionar studio duplicado aos favoritos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result.current.addFavorite('studio1')
      result.current.addFavorite('studio1') // Tentativa de duplicação
    })
    
    expect(result.current.favorites).toEqual(['studio1'])
    expect(result.current.getFavoriteCount()).toBe(1)
  })

  it('deve verificar corretamente se studio é favorito', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    expect(result.current.isFavorite('studio1')).toBe(false)
    
    act(() => {
      result.current.addFavorite('studio1')
    })
    
    expect(result.current.isFavorite('studio1')).toBe(true)
    expect(result.current.isFavorite('studio2')).toBe(false)
  })

  it('deve retornar contagem correta de favoritos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    expect(result.current.getFavoriteCount()).toBe(0)
    
    act(() => {
      result.current.addFavorite('studio1')
      result.current.addFavorite('studio2')
      result.current.addFavorite('studio3')
    })
    
    expect(result.current.getFavoriteCount()).toBe(3)
    
    act(() => {
      result.current.removeFavorite('studio2')
    })
    
    expect(result.current.getFavoriteCount()).toBe(2)
  })

  it('deve limpar todos os favoritos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    // Adiciona alguns favoritos
    act(() => {
      result.current.addFavorite('studio1')
      result.current.addFavorite('studio2')
      result.current.addFavorite('studio3')
    })
    
    expect(result.current.getFavoriteCount()).toBe(3)
    
    // Limpa todos
    act(() => {
      result.current.clearFavorites()
    })
    
    expect(result.current.favorites).toEqual([])
    expect(result.current.getFavoriteCount()).toBe(0)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'studioflow_favorites',
      JSON.stringify([])
    )
  })

  it('deve persistir favoritos no localStorage', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result.current.addFavorite('studio1')
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'studioflow_favorites',
      JSON.stringify(['studio1'])
    )
    
    act(() => {
      result.current.addFavorite('studio2')
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'studioflow_favorites',
      JSON.stringify(['studio1', 'studio2'])
    )
  })

  it('deve lidar com dados corrompidos no localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid json')
    
    const { result } = renderHook(() => useFavoritesStore())
    
    // Deve inicializar com array vazio quando dados estão corrompidos
    expect(result.current.favorites).toEqual([])
    expect(result.current.getFavoriteCount()).toBe(0)
  })

  it('deve lidar com localStorage indisponível', () => {
    // Simula erro no localStorage
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage not available')
    })
    
    const { result } = renderHook(() => useFavoritesStore())
    
    // Deve funcionar mesmo sem localStorage
    act(() => {
      result.current.addFavorite('studio1')
    })
    
    expect(result.current.favorites).toContain('studio1')
    expect(result.current.isFavorite('studio1')).toBe(true)
  })

  it('deve manter ordem de adição dos favoritos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result.current.addFavorite('studio3')
      result.current.addFavorite('studio1')
      result.current.addFavorite('studio2')
    })
    
    expect(result.current.favorites).toEqual(['studio3', 'studio1', 'studio2'])
  })

  it('deve funcionar com IDs de diferentes tipos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result.current.addFavorite('1')
      result.current.addFavorite('studio-abc')
      result.current.addFavorite('uuid-123-456')
    })
    
    expect(result.current.favorites).toEqual(['1', 'studio-abc', 'uuid-123-456'])
    expect(result.current.isFavorite('1')).toBe(true)
    expect(result.current.isFavorite('studio-abc')).toBe(true)
    expect(result.current.isFavorite('uuid-123-456')).toBe(true)
  })

  it('deve permitir múltiplas operações em sequência', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result.current.addFavorite('studio1')
      result.current.addFavorite('studio2')
      result.current.toggleFavorite('studio3') // Adiciona
      result.current.removeFavorite('studio1')
      result.current.toggleFavorite('studio3') // Remove
      result.current.addFavorite('studio4')
    })
    
    expect(result.current.favorites).toEqual(['studio2', 'studio4'])
    expect(result.current.getFavoriteCount()).toBe(2)
  })

  it('deve ser reativo a mudanças', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    const initialCount = result.current.getFavoriteCount()
    expect(initialCount).toBe(0)
    
    act(() => {
      result.current.addFavorite('studio1')
    })
    
    // O valor deve ter mudado imediatamente
    expect(result.current.getFavoriteCount()).toBe(1)
    expect(result.current.getFavoriteCount()).not.toBe(initialCount)
  })

  it('deve lidar com strings vazias e valores inválidos', () => {
    const { result } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result.current.addFavorite('')
      result.current.addFavorite('  ')
      result.current.addFavorite('valid-id')
    })
    
    // Deve adicionar todos os valores, mesmo vazios (comportamento pode variar conforme regra de negócio)
    expect(result.current.favorites).toContain('')
    expect(result.current.favorites).toContain('  ')
    expect(result.current.favorites).toContain('valid-id')
  })

  it('deve manter estado consistente entre múltiplas instâncias', () => {
    const { result: result1 } = renderHook(() => useFavoritesStore())
    const { result: result2 } = renderHook(() => useFavoritesStore())
    
    act(() => {
      result1.current.addFavorite('studio1')
    })
    
    // Ambas as instâncias devem ter o mesmo estado
    expect(result1.current.favorites).toEqual(result2.current.favorites)
    expect(result1.current.getFavoriteCount()).toBe(result2.current.getFavoriteCount())
  })
})