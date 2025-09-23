import React from 'react'
import { render, screen } from '@testing-library/react'
import CadastroEstudioPage from '../page'
import { useAuth } from '../../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

// Mocks básicos
jest.mock('next/navigation')
jest.mock('../../../contexts/AuthContext')

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('CadastroEstudioPage - Debug', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    } as any)
    
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        type: 'provider' as const,
        avatar: null
      },
      isAuthenticated: true,
      isProvider: () => true,
      isClient: () => false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      token: 'mock-token',
      isLoading: false
    })
  })

  it('deve renderizar sem erros', () => {
    expect(() => {
      render(<CadastroEstudioPage />)
    }).not.toThrow()
  })
})