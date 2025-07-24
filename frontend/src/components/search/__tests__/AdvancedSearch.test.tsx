import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdvancedSearch } from '../AdvancedSearch'

const mockOnSearch = jest.fn()
const mockOnFilterChange = jest.fn()

const defaultProps = {
  onSearch: mockOnSearch,
  onFilterChange: mockOnFilterChange,
  loading: false
}

describe('AdvancedSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar todos os campos de busca', () => {
    render(<AdvancedSearch {...defaultProps} />)
    
    expect(screen.getByPlaceholderText(/buscar estúdios/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/localização/i)).toBeInTheDocument()
    expect(screen.getByText(/faixa de preço/i)).toBeInTheDocument()
    expect(screen.getByText(/avaliação mínima/i)).toBeInTheDocument()
    expect(screen.getByText(/capacidade/i)).toBeInTheDocument()
    expect(screen.getByText(/tipo de estúdio/i)).toBeInTheDocument()
  })

  it('deve chamar onSearch quando o usuário digita no campo de busca', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/buscar estúdios/i)
    await user.type(searchInput, 'Studio Rock')
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Studio Rock')
    })
  })

  it('deve aplicar filtros de preço corretamente', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const minPriceInput = screen.getByLabelText(/preço mínimo/i)
    const maxPriceInput = screen.getByLabelText(/preço máximo/i)
    
    await user.type(minPriceInput, '100')
    await user.type(maxPriceInput, '300')
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          preco_min: 100,
          preco_max: 300
        })
      )
    })
  })

  it('deve filtrar por avaliação mínima', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const ratingSelect = screen.getByRole('combobox', { name: /avaliação mínima/i })
    await user.click(ratingSelect)
    
    const rating4 = screen.getByText('4+ estrelas')
    await user.click(rating4)
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          avaliacao_min: 4
        })
      )
    })
  })

  it('deve filtrar por capacidade', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const capacityInput = screen.getByLabelText(/capacidade mínima/i)
    await user.type(capacityInput, '10')
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          capacidade_min: 10
        })
      )
    })
  })

  it('deve filtrar por tipo de estúdio', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const typeSelect = screen.getByRole('combobox', { name: /tipo de estúdio/i })
    await user.click(typeSelect)
    
    const recordingType = screen.getByText('Gravação')
    await user.click(recordingType)
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          tipo_estudio: 'Gravação'
        })
      )
    })
  })

  it('deve filtrar por disponibilidade', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const availabilityCheckbox = screen.getByLabelText(/apenas disponíveis/i)
    await user.click(availabilityCheckbox)
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          apenas_disponiveis: true
        })
      )
    })
  })

  it('deve selecionar múltiplos equipamentos', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const microfoneCheckbox = screen.getByLabelText(/microfone/i)
    const mesaSomCheckbox = screen.getByLabelText(/mesa de som/i)
    
    await user.click(microfoneCheckbox)
    await user.click(mesaSomCheckbox)
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          equipamentos: expect.arrayContaining(['Microfone', 'Mesa de Som'])
        })
      )
    })
  })

  it('deve limpar todos os filtros', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    // Aplica alguns filtros primeiro
    const searchInput = screen.getByPlaceholderText(/buscar estúdios/i)
    await user.type(searchInput, 'Studio Test')
    
    const availabilityCheckbox = screen.getByLabelText(/apenas disponíveis/i)
    await user.click(availabilityCheckbox)
    
    // Clica no botão limpar
    const clearButton = screen.getByRole('button', { name: /limpar filtros/i })
    await user.click(clearButton)
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({})
      expect(mockOnSearch).toHaveBeenCalledWith('')
    })
  })

  it('deve exibir estado de carregamento', () => {
    render(<AdvancedSearch {...defaultProps} loading={true} />)
    
    const searchButton = screen.getByRole('button', { name: /buscar/i })
    expect(searchButton).toBeDisabled()
    expect(screen.getByText(/buscando/i)).toBeInTheDocument()
  })

  it('deve validar campos de preço', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const minPriceInput = screen.getByLabelText(/preço mínimo/i)
    const maxPriceInput = screen.getByLabelText(/preço máximo/i)
    
    // Tenta inserir preço mínimo maior que máximo
    await user.type(minPriceInput, '500')
    await user.type(maxPriceInput, '200')
    
    await waitFor(() => {
      expect(screen.getByText(/preço mínimo não pode ser maior que o máximo/i)).toBeInTheDocument()
    })
  })

  it('deve expandir e recolher filtros avançados', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    const expandButton = screen.getByRole('button', { name: /filtros avançados/i })
    
    // Inicialmente os filtros avançados devem estar ocultos
    expect(screen.queryByText(/equipamentos/i)).not.toBeInTheDocument()
    
    // Expande os filtros
    await user.click(expandButton)
    
    await waitFor(() => {
      expect(screen.getByText(/equipamentos/i)).toBeInTheDocument()
    })
    
    // Recolhe os filtros
    await user.click(expandButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/equipamentos/i)).not.toBeInTheDocument()
    })
  })

  it('deve manter o estado dos filtros ao expandir/recolher', async () => {
    const user = userEvent.setup()
    render(<AdvancedSearch {...defaultProps} />)
    
    // Aplica um filtro básico
    const availabilityCheckbox = screen.getByLabelText(/apenas disponíveis/i)
    await user.click(availabilityCheckbox)
    
    // Expande filtros avançados
    const expandButton = screen.getByRole('button', { name: /filtros avançados/i })
    await user.click(expandButton)
    
    // Aplica filtro avançado
    const microfoneCheckbox = screen.getByLabelText(/microfone/i)
    await user.click(microfoneCheckbox)
    
    // Recolhe filtros
    await user.click(expandButton)
    
    // Verifica se o filtro básico ainda está aplicado
    expect(availabilityCheckbox).toBeChecked()
  })
})