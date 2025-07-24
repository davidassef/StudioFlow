import { renderHook, act } from '@testing-library/react'
import { useLocationService } from '../useLocationService'

// Mock da API de geolocalização
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true
})

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

const mockPosition = {
  coords: {
    latitude: -23.5505,
    longitude: -46.6333,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: Date.now()
}

const mockPosition2 = {
  coords: {
    latitude: -22.9068,
    longitude: -43.1729,
    accuracy: 15,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: Date.now()
}

describe('useLocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    mockGeolocation.getCurrentPosition.mockClear()
    mockGeolocation.watchPosition.mockClear()
    mockGeolocation.clearWatch.mockClear()
  })

  it('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useLocationService())

    expect(result.current.location).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.isSupported).toBe(true)
  })

  it('deve detectar quando geolocalização não é suportada', () => {
    // Remove temporariamente o suporte à geolocalização
    const originalGeolocation = global.navigator.geolocation
    delete (global.navigator as any).geolocation

    const { result } = renderHook(() => useLocationService())

    expect(result.current.isSupported).toBe(false)

    // Restaura a geolocalização
    global.navigator.geolocation = originalGeolocation
  })

  it('deve obter localização atual com sucesso', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await result.current.getCurrentLocation()
    })

    expect(result.current.location).toEqual({
      latitude: mockPosition.coords.latitude,
      longitude: mockPosition.coords.longitude,
      accuracy: mockPosition.coords.accuracy
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('deve lidar com erro de permissão negada', async () => {
    const permissionError = {
      code: 1, // PERMISSION_DENIED
      message: 'User denied the request for Geolocation.'
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      setTimeout(() => error(permissionError), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await result.current.getCurrentLocation()
    })

    expect(result.current.location).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Permissão de localização negada')
  })

  it('deve lidar com erro de posição indisponível', async () => {
    const positionError = {
      code: 2, // POSITION_UNAVAILABLE
      message: 'Position unavailable.'
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      setTimeout(() => error(positionError), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await result.current.getCurrentLocation()
    })

    expect(result.current.location).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Localização indisponível')
  })

  it('deve lidar com timeout', async () => {
    const timeoutError = {
      code: 3, // TIMEOUT
      message: 'Timeout expired.'
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      setTimeout(() => error(timeoutError), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await result.current.getCurrentLocation()
    })

    expect(result.current.location).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Timeout ao obter localização')
  })

  it('deve gerenciar estado de loading corretamente', async () => {
    let resolvePosition: (position: any) => void
    const positionPromise = new Promise((resolve) => {
      resolvePosition = resolve
    })

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      positionPromise.then(success)
    })

    const { result } = renderHook(() => useLocationService())

    // Inicia a obtenção da localização
    const locationPromise = act(async () => {
      await result.current.getCurrentLocation()
    })

    // Verifica se está carregando
    expect(result.current.isLoading).toBe(true)

    // Resolve a posição
    resolvePosition!(mockPosition)
    await locationPromise

    // Verifica se parou de carregar
    expect(result.current.isLoading).toBe(false)
  })

  it('deve calcular distância entre duas coordenadas', () => {
    const { result } = renderHook(() => useLocationService())

    // São Paulo para Rio de Janeiro (aproximadamente 357 km)
    const distance = result.current.calculateDistance(
      -23.5505, -46.6333, // São Paulo
      -22.9068, -43.1729  // Rio de Janeiro
    )

    // Verifica se a distância está próxima do esperado (com margem de erro)
    expect(distance).toBeGreaterThan(350)
    expect(distance).toBeLessThan(370)
  })

  it('deve calcular distância zero para coordenadas iguais', () => {
    const { result } = renderHook(() => useLocationService())

    const distance = result.current.calculateDistance(
      -23.5505, -46.6333,
      -23.5505, -46.6333
    )

    expect(distance).toBe(0)
  })

  it('deve formatar coordenadas corretamente', () => {
    const { result } = renderHook(() => useLocationService())

    const formatted = result.current.formatCoordinates(-23.5505, -46.6333)
    expect(formatted).toBe('-23.5505, -46.6333')

    const formattedWithPrecision = result.current.formatCoordinates(-23.5505123, -46.6333456, 2)
    expect(formattedWithPrecision).toBe('-23.55, -46.63')
  })

  it('deve limpar localização', () => {
    const { result } = renderHook(() => useLocationService())

    // Simula localização obtida
    act(() => {
      result.current.location = {
        latitude: mockPosition.coords.latitude,
        longitude: mockPosition.coords.longitude,
        accuracy: mockPosition.coords.accuracy
      }
    })

    act(() => {
      result.current.clearLocation()
    })

    expect(result.current.location).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('deve carregar localização do localStorage na inicialização', () => {
    const savedLocation = {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 10
    }

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedLocation))

    const { result } = renderHook(() => useLocationService())

    expect(result.current.location).toEqual(savedLocation)
  })

  it('deve salvar localização no localStorage', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await result.current.getCurrentLocation()
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'studioflow_location',
      JSON.stringify({
        latitude: mockPosition.coords.latitude,
        longitude: mockPosition.coords.longitude,
        accuracy: mockPosition.coords.accuracy
      })
    )
  })

  it('deve lidar com dados corrompidos no localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid json')

    const { result } = renderHook(() => useLocationService())

    expect(result.current.location).toBeNull()
  })

  it('deve usar opções personalizadas para getCurrentPosition', async () => {
    const customOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await result.current.getCurrentLocation(customOptions)
    })

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      customOptions
    )
  })

  it('deve iniciar monitoramento de localização', () => {
    const watchId = 123
    mockGeolocation.watchPosition.mockReturnValue(watchId)

    const { result } = renderHook(() => useLocationService())

    act(() => {
      result.current.startWatching()
    })

    expect(mockGeolocation.watchPosition).toHaveBeenCalled()
    expect(result.current.isWatching).toBe(true)
  })

  it('deve parar monitoramento de localização', () => {
    const watchId = 123
    mockGeolocation.watchPosition.mockReturnValue(watchId)

    const { result } = renderHook(() => useLocationService())

    act(() => {
      result.current.startWatching()
    })

    act(() => {
      result.current.stopWatching()
    })

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId)
    expect(result.current.isWatching).toBe(false)
  })

  it('deve atualizar localização durante monitoramento', () => {
    let watchCallback: (position: any) => void
    mockGeolocation.watchPosition.mockImplementation((callback) => {
      watchCallback = callback
      return 123
    })

    const { result } = renderHook(() => useLocationService())

    act(() => {
      result.current.startWatching()
    })

    // Simula nova posição
    act(() => {
      watchCallback!(mockPosition2)
    })

    expect(result.current.location).toEqual({
      latitude: mockPosition2.coords.latitude,
      longitude: mockPosition2.coords.longitude,
      accuracy: mockPosition2.coords.accuracy
    })
  })

  it('deve limpar monitoramento ao desmontar', () => {
    const watchId = 123
    mockGeolocation.watchPosition.mockReturnValue(watchId)

    const { result, unmount } = renderHook(() => useLocationService())

    act(() => {
      result.current.startWatching()
    })

    unmount()

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId)
  })

  it('deve verificar se localização está disponível', () => {
    const { result } = renderHook(() => useLocationService())

    expect(result.current.hasLocation()).toBe(false)

    act(() => {
      result.current.location = {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 10
      }
    })

    expect(result.current.hasLocation()).toBe(true)
  })

  it('deve obter coordenadas como string', () => {
    const { result } = renderHook(() => useLocationService())

    act(() => {
      result.current.location = {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 10
      }
    })

    expect(result.current.getCoordinatesString()).toBe('-23.5505, -46.6333')

    act(() => {
      result.current.location = null
    })

    expect(result.current.getCoordinatesString()).toBe('')
  })

  it('deve calcular distância para localização atual', () => {
    const { result } = renderHook(() => useLocationService())

    act(() => {
      result.current.location = {
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 10
      }
    })

    const distance = result.current.getDistanceToCurrentLocation(-22.9068, -43.1729)
    expect(distance).toBeGreaterThan(350)
    expect(distance).toBeLessThan(370)
  })

  it('deve retornar null para distância quando não há localização atual', () => {
    const { result } = renderHook(() => useLocationService())

    const distance = result.current.getDistanceToCurrentLocation(-22.9068, -43.1729)
    expect(distance).toBeNull()
  })

  it('deve lidar com localStorage indisponível', async () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage not available')
    })

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => success(mockPosition), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await result.current.getCurrentLocation()
    })

    // Deve funcionar mesmo sem localStorage
    expect(result.current.location).toEqual({
      latitude: mockPosition.coords.latitude,
      longitude: mockPosition.coords.longitude,
      accuracy: mockPosition.coords.accuracy
    })
  })

  it('deve permitir múltiplas chamadas simultâneas', async () => {
    let callCount = 0
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      callCount++
      setTimeout(() => success(mockPosition), 0)
    })

    const { result } = renderHook(() => useLocationService())

    await act(async () => {
      await Promise.all([
        result.current.getCurrentLocation(),
        result.current.getCurrentLocation(),
        result.current.getCurrentLocation()
      ])
    })

    // Deve fazer apenas uma chamada real
    expect(callCount).toBe(1)
    expect(result.current.location).toEqual({
      latitude: mockPosition.coords.latitude,
      longitude: mockPosition.coords.longitude,
      accuracy: mockPosition.coords.accuracy
    })
  })

  it('deve validar coordenadas', () => {
    const { result } = renderHook(() => useLocationService())

    expect(result.current.isValidCoordinate(-23.5505, -46.6333)).toBe(true)
    expect(result.current.isValidCoordinate(0, 0)).toBe(true)
    expect(result.current.isValidCoordinate(90, 180)).toBe(true)
    expect(result.current.isValidCoordinate(-90, -180)).toBe(true)
    
    expect(result.current.isValidCoordinate(91, 0)).toBe(false)
    expect(result.current.isValidCoordinate(-91, 0)).toBe(false)
    expect(result.current.isValidCoordinate(0, 181)).toBe(false)
    expect(result.current.isValidCoordinate(0, -181)).toBe(false)
    expect(result.current.isValidCoordinate(NaN, 0)).toBe(false)
    expect(result.current.isValidCoordinate(0, NaN)).toBe(false)
  })
})