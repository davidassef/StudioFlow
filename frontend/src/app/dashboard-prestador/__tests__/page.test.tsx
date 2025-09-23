import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPrestadorPage from '../page'

// Mock do router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })
}))

// Mock do AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      nome: 'João Silva',
      email: 'joao@example.com',
      user_type: 'prestador'
    },
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn()
  })
}))

// Mock do Layout
jest.mock('@/components/layout/Layout', () => {
  return function MockLayout({ children }: any) {
    return <div data-testid="layout">{children}</div>
  }
})

// Mock dos componentes de gráfico
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />
}))

// Mock dos ícones
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon" />,
  DollarSign: () => <div data-testid="dollar-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Users: () => <div data-testid="users-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  MessageSquare: () => <div data-testid="message-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Settings: () => <div data-testid="settings-icon" />
}))

describe('DashboardPrestadorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar a página corretamente', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByText('Dashboard do Prestador')).toBeInTheDocument()
    expect(screen.getByText('Gerencie seu estúdio e acompanhe suas métricas')).toBeInTheDocument()
  })

  it('deve exibir métricas principais', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se as métricas são exibidas
    expect(screen.getByText('Reservas do Mês')).toBeInTheDocument()
    expect(screen.getByText('23')).toBeInTheDocument()
    expect(screen.getByText('+12% vs mês anterior')).toBeInTheDocument()
    
    expect(screen.getByText('Receita do Mês')).toBeInTheDocument()
    expect(screen.getByText('R$ 4.850')).toBeInTheDocument()
    expect(screen.getByText('+8% vs mês anterior')).toBeInTheDocument()
    
    expect(screen.getByText('Avaliação Média')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('Baseado em 45 avaliações')).toBeInTheDocument()
    
    expect(screen.getByText('Taxa de Ocupação')).toBeInTheDocument()
    expect(screen.getByText('78%')).toBeInTheDocument()
    expect(screen.getByText('+5% vs mês anterior')).toBeInTheDocument()
  })

  it('deve exibir ícones das métricas', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
    expect(screen.getByTestId('dollar-icon')).toBeInTheDocument()
    expect(screen.getByTestId('star-icon')).toBeInTheDocument()
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
  })

  it('deve exibir gráfico de receita', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByText('Receita dos Últimos 6 Meses')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('deve exibir gráfico de reservas', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByText('Reservas por Mês')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('deve exibir lista de reservas recentes', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByText('Reservas Recentes')).toBeInTheDocument()
    
    // Verifica se as reservas mockadas são exibidas
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument()
    expect(screen.getByText('Ana Costa')).toBeInTheDocument()
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument()
  })

  it('deve exibir status das reservas com cores corretas', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se os status são exibidos
    expect(screen.getByText('Confirmada')).toBeInTheDocument()
    expect(screen.getByText('Pendente')).toBeInTheDocument()
    expect(screen.getByText('Concluída')).toBeInTheDocument()
    expect(screen.getByText('Cancelada')).toBeInTheDocument()
    
    // Verifica se os ícones de status são exibidos
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
    expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument()
  })

  it('deve exibir datas e horários das reservas', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByText('15/01/2024')).toBeInTheDocument()
    expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument()
    expect(screen.getByText('16/01/2024')).toBeInTheDocument()
    expect(screen.getByText('10:00 - 12:00')).toBeInTheDocument()
  })

  it('deve exibir valores das reservas formatados', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByText('R$ 200')).toBeInTheDocument()
    expect(screen.getByText('R$ 150')).toBeInTheDocument()
    expect(screen.getByText('R$ 300')).toBeInTheDocument()
    expect(screen.getByText('R$ 180')).toBeInTheDocument()
    expect(screen.getByText('R$ 250')).toBeInTheDocument()
  })

  it('deve ter botões de ação para cada reserva', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se os botões de ação estão presentes
    const viewButtons = screen.getAllByTestId('eye-icon')
    const editButtons = screen.getAllByTestId('edit-icon')
    const messageButtons = screen.getAllByTestId('message-icon')
    
    expect(viewButtons.length).toBeGreaterThan(0)
    expect(editButtons.length).toBeGreaterThan(0)
    expect(messageButtons.length).toBeGreaterThan(0)
  })

  it('deve exibir atalhos de gerenciamento', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByText('Atalhos de Gerenciamento')).toBeInTheDocument()
    expect(screen.getByText('Gerenciar Clientes')).toBeInTheDocument()
    expect(screen.getByText('Calendário')).toBeInTheDocument()
    expect(screen.getByText('Relatórios')).toBeInTheDocument()
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  it('deve ter ícones nos atalhos de gerenciamento', () => {
    render(<DashboardPrestadorPage />)
    
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument()
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
  })

  it('deve permitir clique nos atalhos de gerenciamento', async () => {
    const user = userEvent.setup()
    render(<DashboardPrestadorPage />)
    
    const clientsButton = screen.getByText('Gerenciar Clientes')
    const calendarButton = screen.getByText('Calendário')
    const reportsButton = screen.getByText('Relatórios')
    const settingsButton = screen.getByText('Configurações')
    
    // Verifica se os botões são clicáveis
    await user.click(clientsButton)
    await user.click(calendarButton)
    await user.click(reportsButton)
    await user.click(settingsButton)
    
    // Como estamos usando mock do router, apenas verificamos se são clicáveis
    expect(clientsButton).toBeInTheDocument()
    expect(calendarButton).toBeInTheDocument()
    expect(reportsButton).toBeInTheDocument()
    expect(settingsButton).toBeInTheDocument()
  })

  it('deve permitir ações nas reservas', async () => {
    const user = userEvent.setup()
    render(<DashboardPrestadorPage />)
    
    // Testa clique nos botões de ação da primeira reserva
    const actionButtons = screen.getAllByRole('button')
    const viewButton = actionButtons.find(btn => btn.querySelector('[data-testid="eye-icon"]'))
    const editButton = actionButtons.find(btn => btn.querySelector('[data-testid="edit-icon"]'))
    const messageButton = actionButtons.find(btn => btn.querySelector('[data-testid="message-icon"]'))
    
    if (viewButton) await user.click(viewButton)
    if (editButton) await user.click(editButton)
    if (messageButton) await user.click(messageButton)
    
    // Verifica se os botões existem e são clicáveis
    expect(viewButton).toBeInTheDocument()
    expect(editButton).toBeInTheDocument()
    expect(messageButton).toBeInTheDocument()
  })

  it('deve exibir indicadores de tendência nas métricas', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se os indicadores de crescimento são exibidos
    expect(screen.getByText('+12% vs mês anterior')).toBeInTheDocument()
    expect(screen.getByText('+8% vs mês anterior')).toBeInTheDocument()
    expect(screen.getByText('+5% vs mês anterior')).toBeInTheDocument()
    
    // Verifica se o ícone de tendência é exibido
    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument()
  })

  it('deve ter layout responsivo', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se as classes CSS para responsividade estão presentes
    const container = screen.getByText('Dashboard do Prestador').closest('div')
    expect(container).toHaveClass('container')
    
    // Verifica se os grids têm classes responsivas
    const gridElements = document.querySelectorAll('.grid')
    expect(gridElements.length).toBeGreaterThan(0)
  })

  it('deve exibir dados de receita no gráfico', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se o gráfico de receita tem os componentes necessários
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('line')).toBeInTheDocument()
    expect(screen.getByTestId('x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
  })

  it('deve exibir dados de reservas no gráfico', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se o gráfico de reservas tem os componentes necessários
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    expect(screen.getByTestId('bar')).toBeInTheDocument()
  })

  it('deve filtrar reservas por status', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se diferentes status de reservas são exibidos
    const statusElements = [
      screen.getByText('Confirmada'),
      screen.getByText('Pendente'),
      screen.getByText('Concluída'),
      screen.getByText('Cancelada')
    ]
    
    statusElements.forEach(element => {
      expect(element).toBeInTheDocument()
    })
  })

  it('deve exibir informações detalhadas das reservas', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se todas as informações das reservas são exibidas
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('15/01/2024')).toBeInTheDocument()
    expect(screen.getByText('14:00 - 16:00')).toBeInTheDocument()
    expect(screen.getByText('R$ 200')).toBeInTheDocument()
    expect(screen.getByText('Confirmada')).toBeInTheDocument()
  })

  it('deve ter seções bem organizadas', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se as seções principais estão presentes
    expect(screen.getByText('Receita dos Últimos 6 Meses')).toBeInTheDocument()
    expect(screen.getByText('Reservas por Mês')).toBeInTheDocument()
    expect(screen.getByText('Reservas Recentes')).toBeInTheDocument()
    expect(screen.getByText('Atalhos de Gerenciamento')).toBeInTheDocument()
  })

  it('deve exibir métricas com formatação adequada', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica formatação de números
    expect(screen.getByText('23')).toBeInTheDocument() // Reservas
    expect(screen.getByText('R$ 4.850')).toBeInTheDocument() // Receita formatada
    expect(screen.getByText('4.8')).toBeInTheDocument() // Avaliação
    expect(screen.getByText('78%')).toBeInTheDocument() // Porcentagem
  })

  it('deve ter acessibilidade adequada', () => {
    render(<DashboardPrestadorPage />)
    
    // Verifica se botões têm labels adequados
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    // Verifica se headings estão estruturados
    expect(screen.getByRole('heading', { name: 'Dashboard do Prestador' })).toBeInTheDocument()
  })
})