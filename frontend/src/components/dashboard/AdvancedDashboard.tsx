'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  Activity,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { useStudioStore } from '@/stores/studioStore';
import { useAuthStore } from '@/stores/authStore';

interface DashboardData {
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
  dailyBookings: Array<{ day: string; bookings: number; revenue: number }>;
  roomUsage: Array<{ name: string; value: number; color: string }>;
  hourlyUsage: Array<{ hour: string; usage: number }>;
  stats: Array<{
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: any;
    description: string;
  }>;
}

// Componente de tooltip customizado para os gráficos
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AdvancedDashboard() {
  const [timeRange, setTimeRange] = useState('6m');
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  
  const { bookings, fetchBookings, loading: bookingsLoading } = useBookingStore();
  const { rooms, fetchRooms, loading: roomsLoading } = useStudioStore();
  const { user } = useAuthStore();

  // Função para calcular dados do dashboard
  const calculateDashboardData = (): DashboardData => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filtrar agendamentos por período
    const getMonthsBack = (months: number) => {
      const date = new Date();
      date.setMonth(date.getMonth() - months);
      return date;
    };
    
    const periodStart = timeRange === '1m' ? getMonthsBack(1) :
                       timeRange === '3m' ? getMonthsBack(3) :
                       timeRange === '6m' ? getMonthsBack(6) :
                       getMonthsBack(12);
    
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.data_inicio);
      return bookingDate >= periodStart && booking.status !== 'Cancelado';
    });
    
    // Calcular receita mensal
    const monthlyRevenue = [];
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.data_inicio);
        return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
      });
      
      const revenue = monthBookings.reduce((sum, booking) => sum + (booking.valor_total || 0), 0);
      
      monthlyRevenue.push({
        month: monthNames[month],
        revenue,
        bookings: monthBookings.length
      });
    }
    
    // Calcular agendamentos diários (última semana)
    const dailyBookings = [];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      
      const dayBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.data_inicio);
        return bookingDate.toDateString() === date.toDateString();
      });
      
      const revenue = dayBookings.reduce((sum, booking) => sum + (booking.valor_total || 0), 0);
      
      dailyBookings.push({
        day: dayNames[dayOfWeek],
        bookings: dayBookings.length,
        revenue
      });
    }
    
    // Calcular uso por sala
    const roomUsage = rooms.map((room, index) => {
      const roomBookings = filteredBookings.filter(booking => booking.sala.id === room.id);
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
      
      return {
        name: room.nome,
        value: roomBookings.length,
        color: colors[index % colors.length]
      };
    });
    
    // Calcular uso por horário
    const hourlyUsage = [];
    for (let hour = 8; hour <= 22; hour += 2) {
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      const hourBookings = filteredBookings.filter(booking => {
        const startHour = new Date(booking.data_inicio).getHours();
        return startHour >= hour && startHour < hour + 2;
      });
      
      hourlyUsage.push({
        hour: hourStr,
        usage: hourBookings.length
      });
    }
    
    // Calcular estatísticas
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + (booking.valor_total || 0), 0);
    const totalBookings = filteredBookings.length;
    const activeClients = new Set(filteredBookings.map(booking => booking.cliente.id)).size;
    const occupancyRate = rooms.length > 0 ? Math.round((totalBookings / (rooms.length * 30)) * 100) : 0;
    
    const stats = [
      {
        title: 'Receita Total',
        value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
        change: '+12.5%',
        changeType: 'positive' as const,
        icon: DollarSign,
        description: 'vs período anterior',
      },
      {
        title: 'Agendamentos',
        value: totalBookings.toString(),
        change: '+8.2%',
        changeType: 'positive' as const,
        icon: Calendar,
        description: 'total no período',
      },
      {
        title: 'Taxa de Ocupação',
        value: `${occupancyRate}%`,
        change: '+5.1%',
        changeType: 'positive' as const,
        icon: Activity,
        description: 'média das salas',
      },
      {
        title: 'Clientes Ativos',
        value: activeClients.toString(),
        change: '+15.3%',
        changeType: 'positive' as const,
        icon: Users,
        description: 'no período',
      },
    ];
    
    return {
      monthlyRevenue,
      dailyBookings,
      roomUsage,
      hourlyUsage,
      stats
    };
  };
  
  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchBookings(),
          fetchRooms()
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchBookings, fetchRooms]);
  
  // Recalcular dados quando bookings, rooms ou timeRange mudarem
  useEffect(() => {
    if (bookings.length > 0 || rooms.length > 0) {
      const data = calculateDashboardData();
      setDashboardData(data);
    }
  }, [bookings, rooms, timeRange]);
  
  // Função para atualizar dados
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchBookings(),
        fetchRooms()
      ]);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loading = isLoading || bookingsLoading || roomsLoading;
  const data = dashboardData || {
    monthlyRevenue: [],
    dailyBookings: [],
    roomUsage: [],
    hourlyUsage: [],
    stats: []
  };



  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Avançado</h2>
          <p className="text-muted-foreground">
            {user ? `Olá, ${user.nome}! ` : ''}Análise detalhada do desempenho do estúdio
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex border border-border rounded-lg">
            {['1m', '3m', '6m', '1a'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                disabled={loading}
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button variant="outline" size="sm" disabled={loading}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Button variant="outline" size="sm" disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-24 animate-pulse mb-2"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 bg-muted rounded w-12 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          data.stats.map((stat) => {
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
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Receita Mensal */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Receita Mensal</span>
            </CardTitle>
            <CardDescription>
              Evolução da receita nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    fontSize={12}
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Agendamentos Semanais */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-accent" />
              <span>Agendamentos por Dia</span>
            </CardTitle>
            <CardDescription>
              Distribuição semanal de agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.dailyBookings}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="bookings" 
                    fill="hsl(var(--accent))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Uso por Sala */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <span>Uso por Sala</span>
            </CardTitle>
            <CardDescription>
              Distribuição de uso entre as salas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-32 bg-muted rounded-full mx-auto w-32"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-muted rounded-full"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.roomUsage}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.roomUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {data.roomUsage.map((room) => (
                    <div key={room.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: room.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {room.name}: {room.value} agend.
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Uso por Horário */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-accent" />
              <span>Uso por Horário</span>
            </CardTitle>
            <CardDescription>
              Taxa de ocupação ao longo do dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.hourlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="hour" 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights e Recomendações */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Insights e Recomendações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg border animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Insight de Receita */}
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  💰 Receita do Mês
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  R$ {data.stats.monthlyRevenue.toLocaleString('pt-BR')} arrecadados este mês com {data.stats.totalBookings} agendamentos.
                </p>
              </div>
              
              {/* Insight de Horário de Pico */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  ⏰ Horário de Pico
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {data.hourlyUsage.length > 0 
                    ? `${data.hourlyUsage.reduce((max, curr) => curr.usage > max.usage ? curr : max).hour} é o horário mais movimentado.`
                    : 'Dados insuficientes para análise de horários.'
                  }
                </p>
              </div>
              
              {/* Insight de Salas */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  🎯 Uso de Salas
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {data.roomUsage.length > 0
                    ? `${data.roomUsage[0]?.name || 'Sala principal'} é a mais utilizada com ${data.roomUsage[0]?.value || 0} agendamentos.`
                    : 'Nenhum agendamento registrado ainda.'
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}