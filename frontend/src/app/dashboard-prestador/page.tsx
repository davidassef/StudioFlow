'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Settings,
  Plus,
  Eye,
  Edit,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock user data (prestador)
const mockUser = {
  id: '1',
  name: 'Estúdio Premium A',
  email: 'contato@studiopremium.com',
  role: 'provider' as const,
  avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20music%20studio%20logo&image_size=square',
};

// Mock data para o dashboard
const mockStats = {
  totalBookings: 45,
  monthlyRevenue: 6750,
  averageRating: 4.8,
  occupancyRate: 78,
  pendingBookings: 8,
  confirmedBookings: 37,
  cancelledBookings: 3,
};

// Mock data para gráficos
const revenueData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Fev', revenue: 5100 },
  { month: 'Mar', revenue: 4800 },
  { month: 'Abr', revenue: 6200 },
  { month: 'Mai', revenue: 5900 },
  { month: 'Jun', revenue: 6750 },
];

const bookingsData = [
  { day: 'Seg', bookings: 6 },
  { day: 'Ter', bookings: 8 },
  { day: 'Qua', bookings: 5 },
  { day: 'Qui', bookings: 9 },
  { day: 'Sex', bookings: 12 },
  { day: 'Sáb', bookings: 15 },
  { day: 'Dom', bookings: 7 },
];

// Mock reservas recentes
const mockRecentBookings = [
  {
    id: '1',
    clientName: 'João Silva',
    date: '2024-01-20',
    time: '14:00 - 18:00',
    service: 'Gravação Musical',
    status: 'confirmed',
    value: 600,
  },
  {
    id: '2',
    clientName: 'Maria Santos',
    date: '2024-01-21',
    time: '10:00 - 12:00',
    service: 'Podcast',
    status: 'pending',
    value: 160,
  },
  {
    id: '3',
    clientName: 'Pedro Costa',
    date: '2024-01-22',
    time: '16:00 - 20:00',
    service: 'Ensaio de Banda',
    status: 'confirmed',
    value: 480,
  },
  {
    id: '4',
    clientName: 'Ana Oliveira',
    date: '2024-01-23',
    time: '09:00 - 11:00',
    service: 'Gravação Vocal',
    status: 'cancelled',
    value: 300,
  },
];

const statusConfig = {
  confirmed: {
    label: 'Confirmado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

export default function DashboardPrestadorPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewBooking = (bookingId: string) => {
    console.log('Ver reserva:', bookingId);
  };

  const handleEditBooking = (bookingId: string) => {
    console.log('Editar reserva:', bookingId);
  };

  if (isLoading) {
    return (
      <Layout user={mockUser}>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={mockUser}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard do Prestador</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu estúdio e acompanhe o desempenho
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Reserva
            </Button>
          </div>
        </div>

        {/* Status do Plano */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Plano Premium Ativo</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Próxima cobrança em 23 dias • R$ 19,99/mês
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Principais */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reservas do Mês</p>
                  <p className="text-2xl font-bold">{mockStats.totalBookings}</p>
                  <p className="text-xs text-green-600 mt-1">+12% vs mês anterior</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                  <p className="text-2xl font-bold">R$ {mockStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+8% vs mês anterior</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avaliação Média</p>
                  <p className="text-2xl font-bold">{mockStats.averageRating}</p>
                  <p className="text-xs text-green-600 mt-1">+0.2 vs mês anterior</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
                  <p className="text-2xl font-bold">{mockStats.occupancyRate}%</p>
                  <p className="text-xs text-green-600 mt-1">+5% vs mês anterior</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Receita Mensal */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reservas por Dia da Semana */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reservas por Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Reservas Recentes */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reservas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentBookings.map((booking) => {
                const StatusIcon = statusConfig[booking.status as keyof typeof statusConfig].icon;
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{booking.clientName}</p>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{new Date(booking.date).toLocaleDateString('pt-BR')}</p>
                        <p>{booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusConfig[booking.status as keyof typeof statusConfig].color}>
                        {statusConfig[booking.status as keyof typeof statusConfig].label}
                      </Badge>
                      <p className="font-semibold">R$ {booking.value}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBooking(booking.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditBooking(booking.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-1">Gerenciar Clientes</h3>
              <p className="text-sm text-muted-foreground">Visualizar e editar informações dos clientes</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-1">Calendário</h3>
              <p className="text-sm text-muted-foreground">Visualizar agenda e disponibilidade</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-3 text-purple-500" />
              <h3 className="font-semibold mb-1">Relatórios</h3>
              <p className="text-sm text-muted-foreground">Análises detalhadas de performance</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 mx-auto mb-3 text-orange-500" />
              <h3 className="font-semibold mb-1">Configurações</h3>
              <p className="text-sm text-muted-foreground">Personalizar seu estúdio</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}