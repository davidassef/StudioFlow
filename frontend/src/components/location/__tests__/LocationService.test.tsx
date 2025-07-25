import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LocationService, useLocationService } from '../LocationService'
import { renderHook, act } from '@testing-library/react'

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
  value: localStorageMock,
  writable: true
})

describe('LocationService', () => {
  const mockOnLocationUpdate = jest.fn()
  const mockOnLocationError = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockGeolocation.getCurrentPosition.mockClear()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
    mockOnLocationUpdate.mockClear()
    mockOnLocationError.mockClear()
  })

  it('deve renderizar o componente corretamente', () => {
    render(<LocationService onLocationUpdate={mockOnLocationUpdate} />)
    
    expect(screen.getByText('Localização')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /obter localização/i })).toBeInTheDocument()
  })

  it('deve solicitar permissão de localização ao clicar no botão', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        },
        timestamp: Date.now()
      })
    })

    render(<LocationService onLocationUpdate={mockOnLocationUpdate} />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
      expect(mockOnLocationUpdate).toHaveBeenCalledWith({
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 100,
        timestamp: expect.any(Number)
      })
    })
  })

  it('deve exibir coordenadas quando localização for obtida', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        },
        timestamp: Date.now()
      })
    })

    render(<LocationService onLocationUpdate={mockOnLocationUpdate} />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('-23.550500, -46.633300')).toBeInTheDocument()
      expect(screen.getByText(/precisão: ~100m/i)).toBeInTheDocument()
      expect(screen.getByText('Localização obtida')).toBeInTheDocument()
    })
  })

  it('deve exibir erro quando localização for negada', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'User denied the request for Geolocation.',
        PERMISSION_DENIED: 1
      })
    })

    render(<LocationService onLocationUpdate={mockOnLocationUpdate} onLocationError={mockOnLocationError} />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/permissão de localização negada/i)).toBeInTheDocument()
      expect(mockOnLocationError).toHaveBeenCalledWith('Permissão de localização negada pelo usuário')
    })
  })

  it('deve exibir erro quando localização não estiver disponível', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 2,
        message: 'Position unavailable.',
        POSITION_UNAVAILABLE: 2
      })
    })

    render(<LocationService onLocationUpdate={mockOnLocationUpdate} onLocationError={mockOnLocationError} />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/informações de localização não disponíveis/i)).toBeInTheDocument()
      expect(mockOnLocationError).toHaveBeenCalledWith('Informações de localização não disponíveis')
    })
  })

  it('deve exibir erro de timeout', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 3,
        message: 'Timeout expired.',
        TIMEOUT: 3
      })
    })

    render(<LocationService onLocationUpdate={mockOnLocationUpdate} onLocationError={mockOnLocationError} />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/tempo limite para obter localização excedido/i)).toBeInTheDocument()
      expect(mockOnLocationError).toHaveBeenCalledWith('Tempo limite para obter localização excedido')
    })
  })

  it('deve exibir estado de carregamento', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {
      // Não chama nem success nem error para simular carregamento
    })

    render(<LocationService onLocationUpdate={mockOnLocationUpdate} />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Obtendo localização...')).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('deve mostrar botão de atualizar quando localização for obtida', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        },
        timestamp: Date.now()
      })
    })

    render(<LocationService onLocationUpdate={mockOnLocationUpdate} />)
    
    // Obtém localização primeiro
    const getLocationButton = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(getLocationButton)
    
    await waitFor(() => {
      expect(screen.getByText('-23.550500, -46.633300')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /atualizar localização/i })).toBeInTheDocument()
    })
  })
})

describe('useLocationService hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGeolocation.getCurrentPosition.mockClear()
  })

  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useLocationService())
    
    expect(result.current.location).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.permission).toBe('prompt')
  })

  it('deve obter localização com sucesso', async () => {
    const mockTimestamp = Date.now()
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        },
        timestamp: mockTimestamp
      })
    })

    const { result } = renderHook(() => useLocationService())
    
    await act(async () => {
      await result.current.getCurrentLocation()
    })
    
    await waitFor(() => {
      expect(result.current.location).toEqual({
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 100,
        timestamp: mockTimestamp
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.permission).toBe('granted')
    })
  })

  it('deve lidar com erro de permissão', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'User denied the request for Geolocation.',
        PERMISSION_DENIED: 1
      })
    })

    const { result } = renderHook(() => useLocationService())
    
    await act(async () => {
      try {
        await result.current.getCurrentLocation()
      } catch (e) {
        // Esperado que rejeite
      }
    })
    
    await waitFor(() => {
      expect(result.current.location).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Permissão de localização negada')
      expect(result.current.permission).toBe('denied')
    })
  })

  it('deve calcular distância corretamente', () => {
    const { result } = renderHook(() => useLocationService())
    
    const distance = result.current.calculateDistance(
      -23.5505, -46.6333, // São Paulo
      -22.9068, -43.1729  // Rio de Janeiro
    )
    
    // Distância aproximada entre SP e RJ é ~361km
    expect(distance).toBeCloseTo(361, 0)
  })

  it('deve formatar coordenadas corretamente', () => {
    const { result } = renderHook(() => useLocationService())
    
    const formatted = result.current.formatCoordinates(-23.5505, -46.6333)
    expect(formatted).toBe('-23.5505, -46.6333')
    
    const formattedWithPrecision = result.current.formatCoordinates(-23.5505123, -46.6333456, 2)
    expect(formattedWithPrecision).toBe('-23.55, -46.63')
  })

  it('deve limpar localização', async () => {
    const mockTimestamp = Date.now()
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        },
        timestamp: mockTimestamp
      })
    })

    const { result } = renderHook(() => useLocationService())
    
    // Obtém localização primeiro
    await act(async () => {
      await result.current.getCurrentLocation()
    })
    
    await waitFor(() => {
      expect(result.current.location).not.toBeNull()
    })
    
    // Limpa localização
    act(() => {
      result.current.clearLocation()
    })
    
    expect(result.current.location).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('deve verificar se geolocalização é suportada', () => {
    const { result } = renderHook(() => useLocationService())
    
    expect(result.current.isSupported()).toBe(true)
    
    // Simula navegador sem suporte criando um novo mock do navigator
    const originalNavigator = global.navigator
    Object.defineProperty(global, 'navigator', {
      value: {},
      writable: true
    })
    
    const { result: resultWithoutSupport } = renderHook(() => useLocationService())
    expect(resultWithoutSupport.current.isSupported()).toBe(false)
    
    // Restaura navigator original
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true
    })
  })
})