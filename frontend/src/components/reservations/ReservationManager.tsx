'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

interface Reservation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  studioName: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: ReservationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  equipment?: string[];
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

// Mock data para demonstração
const mockReservations: Reservation[] = [
  {
    id: '1',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    clientPhone: '(11) 99999-9999',
    studioName: 'Estúdio A',
    date: new Date('2024-01-15'),
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    price: 200,
    status: 'confirmed',
    notes: 'Gravação de podcast',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    equipment: ['Microfone', 'Mesa de som'],
    paymentStatus: 'paid',
  },
  {
    id: '2',
    clientName: 'Maria Santos',
    clientEmail: 'maria@email.com',
    clientPhone: '(11) 88888-8888',
    studioName: 'Estúdio B',
    date: new Date('2024-01-16'),
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    price: 180,
    status: 'pending',
    notes: 'Ensaio de banda',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    equipment: ['Bateria', 'Amplificadores'],
    paymentStatus: 'pending',
  },
  {
    id: '3',
    clientName: 'Pedro Costa',
    clientEmail: 'pedro@email.com',
    clientPhone: '(11) 77777-7777',
    studioName: 'Estúdio C',
    date: new Date('2024-01-12'),
    startTime: '16:00',
    endTime: '18:00',
    duration: 2,
    price: 220,
    status: 'completed',
    notes: 'Gravação de single',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    equipment: ['Piano', 'Microfone condensador'],
    paymentStatus: 'paid',
  },
];

const statusConfig = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: AlertCircle,
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: XCircle,
  },
  completed: {
    label: 'Concluído',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: CheckCircle,
  },
  'no-show': {
    label: 'Não compareceu',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    icon: Clock3,
  },
};

const paymentStatusConfig = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  paid: {
    label: 'Pago',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  refunded: {
    label: 'Reembolsado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
};

export function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filtrar reservas
  useEffect(() => {
    let filtered = reservations;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.studioName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter);
    }

    // Filtro por data
    if (dateFilter !== 'all') {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(
            (reservation) => reservation.date >= startOfToday && 
            reservation.date < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
          );
          break;
        case 'week':
          const weekAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((reservation) => reservation.date >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((reservation) => reservation.date >= monthAgo);
          break;
      }
    }

    // Filtro por aba ativa
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'upcoming':
          filtered = filtered.filter(
            (reservation) => reservation.date >= new Date() && 
            ['pending', 'confirmed'].includes(reservation.status)
          );
          break;
        case 'past':
          filtered = filtered.filter(
            (reservation) => reservation.date < new Date() || 
            ['completed', 'cancelled', 'no-show'].includes(reservation.status)
          );
          break;
      }
    }

    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter, dateFilter, activeTab]);

  const updateReservationStatus = (id: string, newStatus: ReservationStatus) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: newStatus, updatedAt: new Date() }
          : reservation
      )
    );
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  };

  const openDetailModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getPaymentBadge = (status: 'pending' | 'paid' | 'refunded') => {
    const config = paymentStatusConfig[status];
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {reservation.clientName}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <MapPin className="h-4 w-4" />
              <span>{reservation.studioName}</span>
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-2">
            {getStatusBadge(reservation.status)}
            {getPaymentBadge(reservation.paymentStatus)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(reservation.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{reservation.startTime} - {reservation.endTime}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>R$ {reservation.price}</span>
            </div>
            <div className="text-muted-foreground">
              {reservation.duration}h de duração
            </div>
          </div>
          
          {reservation.notes && (
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {reservation.notes}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDetailModal(reservation)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Detalhes
              </Button>
              
              {reservation.status === 'pending' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirmar
                </Button>
              )}
              
              {['pending', 'confirmed'].includes(reservation.status) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteReservation(reservation.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gerenciar Reservas</h2>
          <p className="text-muted-foreground">Controle completo de agendamentos e histórico</p>
        </div>
        
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, email ou estúdio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="no-show">Não compareceu</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas ({reservations.length})</TabsTrigger>
          <TabsTrigger value="upcoming">
            Próximas ({reservations.filter(r => r.date >= new Date() && ['pending', 'confirmed'].includes(r.status)).length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Passadas ({reservations.filter(r => r.date < new Date() || ['completed', 'cancelled', 'no-show'].includes(r.status)).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredReservations.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma reserva encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou criar uma nova reserva.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedReservation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Detalhes da Reserva</span>
                  {getStatusBadge(selectedReservation.status)}
                </DialogTitle>
                <DialogDescription>
                  Informações completas do agendamento
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Informações do Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedReservation.clientName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedReservation.clientEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedReservation.clientPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Detalhes da Reserva</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedReservation.studioName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(selectedReservation.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedReservation.startTime} - {selectedReservation.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>R$ {selectedReservation.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedReservation.equipment && selectedReservation.equipment.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Equipamentos</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedReservation.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedReservation.notes && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Observações</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {selectedReservation.notes}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Criado em:</span>
                    <p>{format(selectedReservation.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Atualizado em:</span>
                    <p>{format(selectedReservation.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-muted-foreground">Status do Pagamento:</span>
                  <div className="mt-1">
                    {getPaymentBadge(selectedReservation.paymentStatus)}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Fechar
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Reserva
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}