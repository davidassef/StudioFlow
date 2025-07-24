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

describe('LocationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGeolocation.getCurrentPosition.mockClear()
  })

  it('deve renderizar o componente corretamente', () => {
    render(<LocationService />)
    
    expect(screen.getByText(/localização/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /obter localização/i })).toBeInTheDocument()
  })

  it('deve solicitar permissão de localização ao clicar no botão', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        }
      })
    })

    render(<LocationService />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })
  })

  it('deve exibir coordenadas quando localização for obtida', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        }
      })
    })

    render(<LocationService />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/-23.5505, -46.6333/)).toBeInTheDocument()
      expect(screen.getByText(/precisão: 100m/i)).toBeInTheDocument()
    })
  })

  it('deve exibir erro quando localização for negada', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'User denied the request for Geolocation.'
      })
    })

    render(<LocationService />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/permissão negada/i)).toBeInTheDocument()
    })
  })

  it('deve exibir erro quando localização não estiver disponível', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 2,
        message: 'Position unavailable.'
      })
    })

    render(<LocationService />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/localização indisponível/i)).toBeInTheDocument()
    })
  })

  it('deve exibir erro de timeout', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 3,
        message: 'Timeout expired.'
      })
    })

    render(<LocationService />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/tempo esgotado/i)).toBeInTheDocument()
    })
  })

  it('deve exibir estado de carregamento', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {
      // Não chama nem success nem error para simular carregamento
    })

    render(<LocationService />)
    
    const button = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(button)
    
    expect(screen.getByText(/obtendo localização/i)).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('deve permitir limpar a localização', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        }
      })
    })

    render(<LocationService />)
    
    // Obtém localização primeiro
    const getLocationButton = screen.getByRole('button', { name: /obter localização/i })
    fireEvent.click(getLocationButton)
    
    await waitFor(() => {
      expect(screen.getByText(/-23.5505, -46.6333/)).toBeInTheDocument()
    })
    
    // Limpa localização
    const clearButton = screen.getByRole('button', { name: /limpar localização/i })
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/-23.5505, -46.6333/)).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /obter localização/i })).toBeInTheDocument()
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
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        }
      })
    })

    const { result } = renderHook(() => useLocationService())
    
    await act(async () => {
      result.current.getCurrentLocation()
    })
    
    await waitFor(() => {
      expect(result.current.location).toEqual({
        latitude: -23.5505,
        longitude: -46.6333,
        accuracy: 100
      })
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('deve lidar com erro de permissão', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({
        code: 1,
        message: 'User denied the request for Geolocation.'
      })
    })

    const { result } = renderHook(() => useLocationService())
    
    await act(async () => {
      result.current.getCurrentLocation()
    })
    
    await waitFor(() => {
      expect(result.current.location).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Erro desconhecido ao obter localização')
      expect(result.current.permission).toBe('prompt')
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
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 100
        }
      })
    })

    const { result } = renderHook(() => useLocationService())
    
    // Obtém localização primeiro
    await act(async () => {
      result.current.getCurrentLocation()
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