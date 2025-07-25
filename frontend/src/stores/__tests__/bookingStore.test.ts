import { renderHook, act } from '@testing-library/react'
import { useBookingStore } from '../bookingStore'
import { apiUtils } from '@/lib/api'

// Mock do apiUtils
jest.mock('@/lib/api', () => ({
  apiUtils: {
    bookings: {
      list: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}))

// Mock do notificationStore
jest.mock('../notificationStore', () => ({
  useNotifications: () => ({
    addNotification: jest.fn()
  })
}))

const mockBooking = {
  id: 1,
  cliente: {
    id: 1,
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '11999999999'
  },
  sala: {
    id: 1,
    nome: 'Sala A',
    preco_hora: 100,
    estudio: {
      id: 1,
      nome: 'Studio Test'
    }
  },
  data_inicio: '2025-01-26T10:00:00Z',
  data_fim: '2025-01-26T12:00:00Z',
  status: 'PENDENTE' as const,
  observacoes: 'Teste de agendamento',
  valor_total: 200,
  created_at: '2025-01-25T10:00:00Z',
  updated_at: '2025-01-25T10:00:00Z'
}

const mockApiResponse = {
  data: {
    results: [mockBooking]
  }
}

describe('bookingStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store state
    const store = useBookingStore.getState()
    store.bookings = []
    store.selectedBooking = null
    store.filters = {}
    store.isLoading = false
    store.error = null
  })

  it('deve inicializar com estado vazio', () => {
    const { result } = renderHook(() => useBookingStore())
    
    expect(result.current.bookings).toEqual([])
    expect(result.current.selectedBooking).toBeNull()
    expect(result.current.filters).toEqual({})
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('deve buscar agendamentos com sucesso', async () => {
    const mockApi = apiUtils.bookings.list as jest.Mock
    mockApi.mockResolvedValueOnce(mockApiResponse)
    
    const { result } = renderHook(() => useBookingStore())
    
    await act(async () => {
      await result.current.fetchBookings()
    })
    
    expect(result.current.bookings).toEqual([mockBooking])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockApi).toHaveBeenCalledWith({})
  })

  it('deve buscar agendamentos com filtros', async () => {
    const mockApi = apiUtils.bookings.list as jest.Mock
    mockApi.mockResolvedValueOnce(mockApiResponse)
    
    const { result } = renderHook(() => useBookingStore())
    const filters = { status: 'CONFIRMADO', sala_id: 1 }
    
    await act(async () => {
      await result.current.fetchBookings(filters)
    })
    
    expect(result.current.filters).toEqual(filters)
    expect(mockApi).toHaveBeenCalledWith(filters)
  })

  it('deve lidar com erro ao buscar agendamentos', async () => {
    const mockApi = apiUtils.bookings.list as jest.Mock
    mockApi.mockRejectedValueOnce(new Error('Erro de rede'))
    
    const { result } = renderHook(() => useBookingStore())
    
    await act(async () => {
      await result.current.fetchBookings()
    })
    
    expect(result.current.bookings).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Erro de rede')
  })

  it('deve buscar agendamento específico', async () => {
    const mockApi = apiUtils.bookings.get as jest.Mock
    mockApi.mockResolvedValueOnce({ data: mockBooking })
    
    const { result } = renderHook(() => useBookingStore())
    
    await act(async () => {
      await result.current.getBooking(1)
    })
    
    expect(result.current.selectedBooking).toEqual(mockBooking)
    expect(result.current.isLoading).toBe(false)
    expect(mockApi).toHaveBeenCalledWith(1)
  })

  it('deve criar novo agendamento', async () => {
    const mockApi = apiUtils.bookings.create as jest.Mock
    mockApi.mockResolvedValueOnce({ data: mockBooking })
    
    const { result } = renderHook(() => useBookingStore())
    const bookingData = {
      sala_id: 1,
      data_inicio: '2025-01-26T10:00:00Z',
      data_fim: '2025-01-26T12:00:00Z',
      observacoes: 'Novo agendamento'
    }
    
    let createdBooking
    await act(async () => {
      createdBooking = await result.current.createBooking(bookingData)
    })
    
    expect(createdBooking).toEqual(mockBooking)
    expect(result.current.bookings).toContain(mockBooking)
    expect(mockApi).toHaveBeenCalledWith(bookingData)
  })

  it('deve atualizar agendamento existente', async () => {
    const mockApi = apiUtils.bookings.update as jest.Mock
    const updatedBooking = { ...mockBooking, observacoes: 'Atualizado' }
    mockApi.mockResolvedValueOnce({ data: updatedBooking })
    
    const { result } = renderHook(() => useBookingStore())
    
    // Adiciona booking inicial
    act(() => {
      useBookingStore.setState({ bookings: [mockBooking] })
    })
    
    await act(async () => {
      await result.current.updateBooking(1, { observacoes: 'Atualizado' })
    })
    
    expect(result.current.bookings[0]).toEqual(updatedBooking)
    expect(mockApi).toHaveBeenCalledWith(1, { observacoes: 'Atualizado' })
  })

  it('deve cancelar agendamento', async () => {
    const mockApi = apiUtils.bookings.update as jest.Mock
    mockApi.mockResolvedValueOnce({ data: mockBooking })
    
    const { result } = renderHook(() => useBookingStore())
    
    // Adiciona booking inicial
    act(() => {
      useBookingStore.setState({ bookings: [mockBooking] })
    })
    
    await act(async () => {
      await result.current.cancelBooking(1, 'Cancelado pelo cliente')
    })
    
    expect(result.current.bookings[0].status).toBe('CANCELADO')
    expect(result.current.bookings[0].observacoes).toBe('Cancelado pelo cliente')
    expect(mockApi).toHaveBeenCalledWith(1, {
      status: 'CANCELADO',
      observacoes: 'Cancelado pelo cliente'
    })
  })

  it('deve confirmar agendamento', async () => {
    const mockApi = apiUtils.bookings.update as jest.Mock
    mockApi.mockResolvedValueOnce({ data: mockBooking })
    
    const { result } = renderHook(() => useBookingStore())
    
    // Adiciona booking inicial
    act(() => {
      useBookingStore.setState({ bookings: [mockBooking] })
    })
    
    await act(async () => {
      await result.current.confirmBooking(1)
    })
    
    expect(result.current.bookings[0].status).toBe('CONFIRMADO')
    expect(mockApi).toHaveBeenCalledWith(1, { status: 'CONFIRMADO' })
  })

  it('deve definir filtros', () => {
    const { result } = renderHook(() => useBookingStore())
    const filters = { status: 'CONFIRMADO', sala_id: 1 }
    
    act(() => {
      result.current.setFilters(filters)
    })
    
    expect(result.current.filters).toEqual(filters)
  })

  it('deve definir agendamento selecionado', () => {
    const { result } = renderHook(() => useBookingStore())
    
    act(() => {
      result.current.setSelectedBooking(mockBooking)
    })
    
    expect(result.current.selectedBooking).toEqual(mockBooking)
    
    act(() => {
      result.current.setSelectedBooking(null)
    })
    
    expect(result.current.selectedBooking).toBeNull()
  })

  it('deve limpar erro', () => {
    const { result } = renderHook(() => useBookingStore())
    
    // Define erro inicial
    act(() => {
      useBookingStore.setState({ error: 'Erro de teste' })
    })
    
    expect(result.current.error).toBe('Erro de teste')
    
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBeNull()
  })

  it('deve lidar com erro ao criar agendamento', async () => {
    const mockApi = apiUtils.bookings.create as jest.Mock
    mockApi.mockRejectedValueOnce(new Error('Erro ao criar'))
    
    const { result } = renderHook(() => useBookingStore())
    const bookingData = {
      sala_id: 1,
      data_inicio: '2025-01-26T10:00:00Z',
      data_fim: '2025-01-26T12:00:00Z'
    }
    
    await act(async () => {
      try {
        await result.current.createBooking(bookingData)
      } catch (error) {
        expect(error).toEqual(new Error('Erro ao criar'))
      }
    })
    
    expect(result.current.error).toBe('Erro ao criar')
    expect(result.current.isLoading).toBe(false)
  })
})