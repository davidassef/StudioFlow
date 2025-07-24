'use client';

import { useState } from 'react';
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
} from 'lucide-react';

// Mock data para demonstração
const monthlyRevenue = [
  { month: 'Jan', revenue: 12000, bookings: 45 },
  { month: 'Fev', revenue: 15000, bookings: 52 },
  { month: 'Mar', revenue: 18000, bookings: 61 },
  { month: 'Abr', revenue: 16000, bookings: 58 },
  { month: 'Mai', revenue: 22000, bookings: 72 },
  { month: 'Jun', revenue: 25000, bookings: 85 },
];

const dailyBookings = [
  { day: 'Seg', bookings: 12, revenue: 2400 },
  { day: 'Ter', bookings: 15, revenue: 3200 },
  { day: 'Qua', bookings: 8, revenue: 1800 },
  { day: 'Qui', bookings: 18, revenue: 4100 },
  { day: 'Sex', bookings: 22, revenue: 5200 },
  { day: 'Sáb', bookings: 25, revenue: 6800 },
  { day: 'Dom', bookings: 10, revenue: 2200 },
];

const roomUsage = [
  { name: 'Sala A', value: 35, color: '#8884d8' },
  { name: 'Sala B', value: 28, color: '#82ca9d' },
  { name: 'Sala C', value: 22, color: '#ffc658' },
  { name: 'Sala D', value: 15, color: '#ff7300' },
];

const hourlyUsage = [
  { hour: '08:00', usage: 20 },
  { hour: '10:00', usage: 45 },
  { hour: '12:00', usage: 60 },
  { hour: '14:00', usage: 80 },
  { hour: '16:00', usage: 95 },
  { hour: '18:00', usage: 85 },
  { hour: '20:00', usage: 70 },
  { hour: '22:00', usage: 40 },
];

const stats = [
  {
    title: 'Receita Total',
    value: 'R$ 108.000',
    change: '+12.5%',
    changeType: 'positive',
    icon: DollarSign,
    description: 'vs mês anterior',
  },
  {
    title: 'Agendamentos',
    value: '373',
    change: '+8.2%',
    changeType: 'positive',
    icon: Calendar,
    description: 'total no período',
  },
  {
    title: 'Taxa de Ocupação',
    value: '78%',
    change: '+5.1%',
    changeType: 'positive',
    icon: Activity,
    description: 'média das salas',
  },
  {
    title: 'Clientes Ativos',
    value: '156',
    change: '+15.3%',
    changeType: 'positive',
    icon: Users,
    description: 'últimos 30 dias',
  },
];

export function AdvancedDashboard() {
  const [timeRange, setTimeRange] = useState('6m');

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: { value: number; name: string; color: string }, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard Avançado</h2>
          <p className="text-muted-foreground">Análise detalhada do desempenho do estúdio</p>
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
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
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
        })}
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
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyBookings}>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {roomUsage.map((room) => (
                <div key={room.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: room.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {room.name}: {room.value}%
                  </span>
                </div>
              ))}
            </div>
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyUsage}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="hour" 
                  className="text-muted-foreground"
                  fontSize={12}
                />
                <YAxis 
                  className="text-muted-foreground"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                📈 Crescimento Positivo
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Receita cresceu 12.5% este mês. Continue investindo em marketing digital.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                ⏰ Horário de Pico
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                16h-18h é o horário mais movimentado. Considere preços dinâmicos.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                🎯 Oportunidade
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Sala D tem baixa ocupação. Ofereça promoções para aumentar o uso.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}