'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Users,
  Building,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react';

// Mock data para demonstração
const stats = [
  {
    title: 'Agendamentos Hoje',
    value: '12',
    description: '+2 desde ontem',
    icon: Calendar,
    color: 'text-primary',
  },
  {
    title: 'Clientes Ativos',
    value: '48',
    description: '+5 este mês',
    icon: Users,
    color: 'text-accent',
  },
  {
    title: 'Salas Disponíveis',
    value: '3/5',
    description: '2 em uso agora',
    icon: Building,
    color: 'text-primary',
  },
  {
    title: 'Receita Mensal',
    value: 'R$ 15.240',
    description: '+12% vs mês anterior',
    icon: DollarSign,
    color: 'text-accent',
  },
];

const recentBookings = [
  {
    id: 1,
    client: 'João Silva',
    room: 'Sala A',
    time: '14:00 - 16:00',
    status: 'confirmed',
  },
  {
    id: 2,
    client: 'Maria Santos',
    room: 'Sala B',
    time: '16:30 - 18:30',
    status: 'pending',
  },
  {
    id: 3,
    client: 'Pedro Costa',
    room: 'Sala C',
    time: '19:00 - 21:00',
    status: 'confirmed',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Gravação - Banda XYZ',
    time: '09:00',
    room: 'Sala A',
  },
  {
    id: 2,
    title: 'Mixagem - Album Solo',
    time: '14:00',
    room: 'Sala B',
  },
  {
    id: 3,
    title: 'Ensaio - Grupo ABC',
    time: '18:00',
    room: 'Sala C',
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
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
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
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
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-accent" />
              <span>Próximos Eventos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.time} • {event.room}
                  </p>
                </div>
              </div>
            ))}
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
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{booking.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.room} • {booking.time}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {booking.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}