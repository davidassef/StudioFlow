import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingForm } from '../BookingForm'
import { Studio } from '@/types/studio'

// Mock do studio para testes
const mockStudio: Studio = {
  id: '1',
  name: 'Studio Test',
  description: 'Studio para testes',
  location: 'São Paulo, SP',
  latitude: -23.5505,
  longitude: -46.6333,
  price: 100,
  rating: 4.5,
  reviewCount: 10,
  images: ['image1.jpg'],
  equipment: ['Microfone', 'Mesa de Som'],
  capacity: 5,
  type: 'Gravação',
  availability: 'Disponível',
  distance: 2.5
}

// Mock das funções de callback
const mockOnSubmit = jest.fn()
const mockOnCancel = jest.fn()

describe('BookingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock do Date para testes consistentes
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T10:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('deve renderizar o formulário corretamente', () => {
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    expect(screen.getByText('Reservar Studio Test')).toBeInTheDocument()
    expect(screen.getByLabelText(/data da reserva/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/horário de início/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/horário de término/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/observações/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirmar reserva/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('deve exibir informações do studio', () => {
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    expect(screen.getByText('Studio Test')).toBeInTheDocument()
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument()
    expect(screen.getByText('R$ 100/hora')).toBeInTheDocument()
    expect(screen.getByText('Capacidade: 5 pessoas')).toBeInTheDocument()
  })

  it('deve calcular o valor total corretamente', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    // Preenche horário de início e fim (2 horas)
    const startTime = screen.getByLabelText(/horário de início/i)
    const endTime = screen.getByLabelText(/horário de término/i)
    
    await user.clear(startTime)
    await user.type(startTime, '10:00')
    
    await user.clear(endTime)
    await user.type(endTime, '12:00')
    
    await waitFor(() => {
      expect(screen.getByText('Total: R$ 200,00')).toBeInTheDocument()
    })
  })

  it('deve validar campos obrigatórios', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    const submitButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/data é obrigatória/i)).toBeInTheDocument()
      expect(screen.getByText(/horário de início é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/horário de término é obrigatório/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('deve validar data mínima (não pode ser no passado)', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    const dateInput = screen.getByLabelText(/data da reserva/i)
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-10') // Data no passado
    
    const submitButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/data não pode ser no passado/i)).toBeInTheDocument()
    })
  })

  it('deve validar horários (término deve ser após início)', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    const dateInput = screen.getByLabelText(/data da reserva/i)
    const startTime = screen.getByLabelText(/horário de início/i)
    const endTime = screen.getByLabelText(/horário de término/i)
    
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-20')
    
    await user.clear(startTime)
    await user.type(startTime, '14:00')
    
    await user.clear(endTime)
    await user.type(endTime, '12:00') // Horário anterior ao início
    
    const submitButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/horário de término deve ser após o início/i)).toBeInTheDocument()
    })
  })

  it('deve validar duração mínima (1 hora)', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    const dateInput = screen.getByLabelText(/data da reserva/i)
    const startTime = screen.getByLabelText(/horário de início/i)
    const endTime = screen.getByLabelText(/horário de término/i)
    
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-20')
    
    await user.clear(startTime)
    await user.type(startTime, '14:00')
    
    await user.clear(endTime)
    await user.type(endTime, '14:30') // Apenas 30 minutos
    
    const submitButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/duração mínima é de 1 hora/i)).toBeInTheDocument()
    })
  })

  it('deve submeter formulário com dados válidos', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    const dateInput = screen.getByLabelText(/data da reserva/i)
    const startTime = screen.getByLabelText(/horário de início/i)
    const endTime = screen.getByLabelText(/horário de término/i)
    const notes = screen.getByLabelText(/observações/i)
    
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-20')
    
    await user.clear(startTime)
    await user.type(startTime, '14:00')
    
    await user.clear(endTime)
    await user.type(endTime, '16:00')
    
    await user.clear(notes)
    await user.type(notes, 'Sessão de gravação importante')
    
    const submitButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        studioId: '1',
        date: '2024-01-20',
        startTime: '14:00',
        endTime: '16:00',
        notes: 'Sessão de gravação importante',
        totalPrice: 200
      })
    })
  })

  it('deve chamar onCancel ao clicar em cancelar', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('deve exibir estado de carregamento durante submissão', async () => {
    const user = userEvent.setup({ delay: null })
    
    // Mock que demora para resolver
    const slowOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)))
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={slowOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    // Preenche formulário válido
    const dateInput = screen.getByLabelText(/data da reserva/i)
    const startTime = screen.getByLabelText(/horário de início/i)
    const endTime = screen.getByLabelText(/horário de término/i)
    
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-20')
    
    await user.clear(startTime)
    await user.type(startTime, '14:00')
    
    await user.clear(endTime)
    await user.type(endTime, '16:00')
    
    const submitButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(submitButton)
    
    // Verifica estado de carregamento
    expect(screen.getByText(/processando reserva/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('deve permitir apenas horários de funcionamento', () => {
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    const startTime = screen.getByLabelText(/horário de início/i) as HTMLInputElement
    const endTime = screen.getByLabelText(/horário de término/i) as HTMLInputElement
    
    // Verifica se os horários estão limitados (ex: 08:00 às 22:00)
    expect(startTime.min).toBe('08:00')
    expect(startTime.max).toBe('22:00')
    expect(endTime.min).toBe('08:00')
    expect(endTime.max).toBe('22:00')
  })

  it('deve exibir equipamentos disponíveis', () => {
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    expect(screen.getByText('Equipamentos:')).toBeInTheDocument()
    expect(screen.getByText('Microfone')).toBeInTheDocument()
    expect(screen.getByText('Mesa de Som')).toBeInTheDocument()
  })

  it('deve formatar preço corretamente', () => {
    const studioWithHighPrice = {
      ...mockStudio,
      price: 1500.50
    }
    
    render(
      <BookingForm 
        studio={studioWithHighPrice} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    expect(screen.getByText('R$ 1.500,50/hora')).toBeInTheDocument()
  })

  it('deve limpar erros ao corrigir campos', async () => {
    const user = userEvent.setup({ delay: null })
    
    render(
      <BookingForm 
        studio={mockStudio} 
        onSubmit={mockOnSubmit} 
        onCancel={mockOnCancel} 
      />
    )
    
    // Submete formulário vazio para gerar erros
    const submitButton = screen.getByRole('button', { name: /confirmar reserva/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/data é obrigatória/i)).toBeInTheDocument()
    })
    
    // Corrige o campo de data
    const dateInput = screen.getByLabelText(/data da reserva/i)
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-20')
    
    await waitFor(() => {
      expect(screen.queryByText(/data é obrigatória/i)).not.toBeInTheDocument()
    })
  })
})