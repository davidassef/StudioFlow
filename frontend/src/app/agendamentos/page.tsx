'use client';

import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import BookingCalendar from '@/components/calendar/BookingCalendar';
import { useBookings } from '@/stores/bookingStore';
import { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Building,
  Plus,
  Filter,
  Search,
  TrendingUp,
} from 'lucide-react';

// Mock user data
const mockUser = {
  name: 'João Silva',
  email: 'joao@studioflow.com',
};

// Mock agendamentos data
const agendamentos = [
  {
    id: 1,
    cliente: 'Maria Santos',
    sala: 'Sala A - Gravação',
    data: '2024-01-15',
    horario: '14:00 - 16:00',
    status: 'confirmado',
    servico: 'Gravação de Vocal',
    valor: 'R$ 200,00',
  },
  {
    id: 2,
    cliente: 'Pedro Costa',
    sala: 'Sala B - Mixagem',
    data: '2024-01-15',
    horario: '16:30 - 18:30',
    status: 'pendente',
    servico: 'Mixagem de Album',
    valor: 'R$ 300,00',
  },
  {
    id: 3,
    cliente: 'Ana Silva',
    sala: 'Sala C - Ensaio',
    data: '2024-01-16',
    horario: '19:00 - 21:00',
    status: 'confirmado',
    servico: 'Ensaio de Banda',
    valor: 'R$ 150,00',
  },
  {
    id: 4,
    cliente: 'Carlos Oliveira',
    sala: 'Sala A - Gravação',
    data: '2024-01-17',
    horario: '10:00 - 12:00',
    status: 'cancelado',
    servico: 'Gravação de Instrumento',
    valor: 'R$ 180,00',
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmado':
      return 'bg-primary/10 text-primary';
    case 'pendente':
      return 'bg-accent/10 text-accent';
    case 'cancelado':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'confirmado':
      return 'Confirmado';
    case 'pendente':
      return 'Pendente';
    case 'cancelado':
      return 'Cancelado';
    default:
      return status;
  }
}

export default function AgendamentosPage() {
  const { requireAuth, user } = useAuth();
  const { fetchBookings } = useBookings();
  const [stats, setStats] = useState({
    totalHoje: 0,
    confirmados: 0,
    receitaHoje: 0,
    taxaOcupacao: 0
  });

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Calcular estatísticas
  useEffect(() => {
    const hoje = new Date().toDateString();
    const agendamentosHoje = agendamentos.filter(agendamento => 
      new Date(agendamento.data).toDateString() === hoje
    );
    
    const confirmados = agendamentos.filter(agendamento => 
      agendamento.status === 'confirmado'
    ).length;
    
    const receitaHoje = agendamentosHoje.reduce((total, agendamento) => {
      const valor = parseFloat(agendamento.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
      return total + valor;
    }, 0);
    
    // Calcular taxa de ocupação (simplificado)
    const taxaOcupacao = agendamentos.length > 0 ? Math.round((confirmados / agendamentos.length) * 100) : 0;
    
    setStats({
      totalHoje: agendamentosHoje.length,
      confirmados,
      receitaHoje,
      taxaOcupacao
    });
  }, []);

  // Handlers comentados para uso futuro
  // const handleFilterChange = (key: string, value: string | boolean) => {
  //   const storeFilters: Record<string, unknown> = {}
  //   // Apply filters logic here
  // };

  // const handleSearch = (query: string) => {
  //   // Search logic here
  // };

  // const handleNewBooking = (data: Record<string, unknown>) => {
  //   // Create new booking logic
  // };

  // const handleEditBooking = (booking: any, data: Record<string, unknown>) => {
  //   // Edit booking logic
  // };

  const handleNovoAgendamento = () => {
    if (requireAuth('fazer uma reserva')) {
      // Lógica para criar novo agendamento
      console.log('Criando novo agendamento...');
    }
  };

  // Mapear o user para o formato esperado pelo Layout
  const layoutUser = user ? {
    name: user.nome,
    email: user.email,
  } : mockUser;

  return (
    <Layout user={layoutUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os agendamentos do seu estúdio
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleNovoAgendamento}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, sala ou serviço..."
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Hoje
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalHoje}</div>
              <p className="text-xs text-muted-foreground">Agendamentos para hoje</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confirmados
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.confirmados}</div>
              <p className="text-xs text-muted-foreground">{stats.taxaOcupacao}% do total</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Hoje
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ {stats.receitaHoje.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Faturamento do dia</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa Ocupação
              </CardTitle>
              <Building className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.taxaOcupacao}%</div>
              <p className="text-xs text-muted-foreground">Salas ocupadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendário Interativo */}
        <BookingCalendar height={700} />

        {/* Agendamentos List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Agendamentos Recentes</CardTitle>
            <CardDescription>
              Últimos agendamentos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground">
                          {agendamento.cliente}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            getStatusColor(agendamento.status)
                          }`}
                        >
                          {getStatusText(agendamento.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Building className="mr-1 h-3 w-3" />
                          {agendamento.sala}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {agendamento.data} • {agendamento.horario}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {agendamento.servico}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {agendamento.valor}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}