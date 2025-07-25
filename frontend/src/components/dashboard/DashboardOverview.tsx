'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Activity,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { useStudioStore } from '@/stores/studioStore';
import { useAuthStore } from '@/stores/authStore';

interface DashboardStats {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}

export function DashboardOverview() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { bookings, fetchBookings, isLoading: bookingsLoading } = useBookingStore();
  const { rooms, fetchRooms, isLoading: roomsLoading } = useStudioStore();
  const { user } = useAuthStore();

  // Carregar dados iniciais
  useEffect(() => {
    const loadDashboardData = async () => {
      await Promise.all([
        fetchBookings(),
        fetchRooms()
      ]);
    };
    
    loadDashboardData();
  }, [fetchBookings, fetchRooms]);

  // Função para atualizar dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchBookings(),
        fetchRooms()
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calcular estatísticas baseadas nos dados reais
  const calculateStats = (): DashboardStats[] => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Agendamentos de hoje
    const todayBookings = bookings.filter(booking => 
      booking.data_inicio.startsWith(todayStr)
    );
    
    // Agendamentos do mês atual
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.data_inicio);
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear;
    });
    
    // Receita do mês
    const monthlyRevenue = monthlyBookings.reduce((total, booking) => 
      total + (booking.valor_total || 0), 0
    );
    
    // Salas disponíveis
    const availableRooms = rooms.filter(room => room.disponivel);
    const totalRooms = rooms.length;
    
    // Clientes únicos do mês
    const uniqueClients = new Set(
      monthlyBookings.map(booking => booking.cliente.id)
    ).size;

    return [
      {
        title: 'Agendamentos Hoje',
        value: todayBookings.length.toString(),
        change: `${todayBookings.length > 0 ? '+' : ''}${todayBookings.length} hoje`,
        changeType: todayBookings.length > 0 ? 'positive' : 'neutral',
        icon: Calendar,
        isLoading: bookingsLoading,
      },
      {
        title: 'Clientes Ativos',
        value: uniqueClients.toString(),
        change: `${uniqueClients > 0 ? '+' : ''}${uniqueClients} este mês`,
        changeType: uniqueClients > 0 ? 'positive' : 'neutral',
        icon: Users,
        isLoading: bookingsLoading,
      },
      {
        title: 'Salas Disponíveis',
        value: `${availableRooms.length}/${totalRooms}`,
        change: `${totalRooms - availableRooms.length} em uso`,
        changeType: availableRooms.length > 0 ? 'positive' : 'negative',
        icon: MapPin,
        isLoading: roomsLoading,
      },
      {
        title: 'Receita do Mês',
        value: `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        change: `${monthlyBookings.length} agendamentos`,
        changeType: monthlyRevenue > 0 ? 'positive' : 'neutral',
        icon: DollarSign,
        isLoading: bookingsLoading,
      },
    ];
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header com botão de refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Bem-vindo, {user?.nome || 'Usuário'}!
          </h2>
          <p className="text-muted-foreground">
            Aqui está um resumo do seu estúdio hoje.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {stat.isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 
                        'text-muted-foreground'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Calendar Card - Estrela do show */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Calendário de Agendamentos</span>
            </CardTitle>
            <CardDescription>
              Visão geral dos agendamentos de hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder para o calendário */}
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Calendário será implementado aqui</p>
                <Button variant="outline" size="sm">
                  Ver Calendário Completo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-accent" />
                <span>Próximos Eventos</span>
              </div>
              <Button variant="ghost" size="sm">
                Ver agenda
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {bookings
                  .filter(booking => {
                    const bookingDate = new Date(booking.data_inicio);
                    const today = new Date();
                    return bookingDate >= today && booking.status !== 'Cancelado';
                  })
                  .sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime())
                  .slice(0, 3)
                  .map((booking) => {
                    const startDate = new Date(booking.data_inicio);
                    const endDate = new Date(booking.data_fim);
                    const timeStr = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <div key={booking.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {booking.cliente.nome} - {booking.sala.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {timeStr} • {booking.sala.nome}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {bookings.filter(booking => {
                  const bookingDate = new Date(booking.data_inicio);
                  const today = new Date();
                  return bookingDate >= today && booking.status !== 'Cancelado';
                }).length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum evento próximo</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agendamentos Recentes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Agendamentos Recentes</span>
            </div>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-muted rounded" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => {
                const startDate = new Date(booking.data_inicio);
                const endDate = new Date(booking.data_fim);
                const timeStr = `${startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
                
                return (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{booking.cliente.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.sala.nome} • {timeStr}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmado'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'Pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'Cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}