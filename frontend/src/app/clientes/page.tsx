'use client'

import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNotifications } from '@/stores/notificationStore'
import { useReactiveForm } from '@/hooks/useReactiveForm'
import { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Search,
  Edit,
  Trash2,
  MessageCircle,
  Star,
  TrendingUp,
  MapPin,
} from 'lucide-react'
import { z } from 'zod'

// Mock user data
const mockUser = {
  name: 'João Silva',
  email: 'joao@studioflow.com',
};

// Client interface
interface Client {
  id: number
  nome: string
  email: string
  telefone: string
  avatar?: string
  location: string
  agendamentosTotal: number
  totalGasto: number
  ultimoAgendamento: string
  status: 'ativo' | 'inativo' | 'vip'
  joinDate: string
  tipo?: string
  notes?: string
}

// Mock clientes data
const clientes: Client[] = [
  {
    id: 1,
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    telefone: '(11) 99999-1234',
    tipo: 'Artista Solo',
    ultimoAgendamento: '2024-01-10',
    totalGasto: 1200,
    agendamentosTotal: 8,
    status: 'ativo',
    avatar: '',
    location: 'São Paulo, SP',
    joinDate: '2023-06-15',
    notes: 'Cliente frequente, prefere horários noturnos',
  },
  {
    id: 2,
    nome: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    telefone: '(11) 98888-5678',
    tipo: 'Produtor',
    ultimoAgendamento: '2024-01-12',
    totalGasto: 2500,
    agendamentosTotal: 15,
    status: 'ativo',
    avatar: '',
    location: 'São Paulo, SP',
    joinDate: '2023-09-20',
    notes: 'Produtor musical, sempre pontual',
  },
  {
    id: 3,
    nome: 'Ana Silva',
    email: 'ana.silva@email.com',
    telefone: '(11) 97777-9012',
    tipo: 'Banda',
    ultimoAgendamento: '2024-01-08',
    totalGasto: 800,
    agendamentosTotal: 5,
    status: 'ativo',
    avatar: '',
    location: 'Guarulhos, SP',
    joinDate: '2023-11-10',
    notes: 'Banda iniciante, precisa de orientação',
  },
  {
    id: 4,
    nome: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    telefone: '(11) 96666-3456',
    tipo: 'Artista Solo',
    ultimoAgendamento: '2023-12-20',
    totalGasto: 450,
    agendamentosTotal: 3,
    status: 'inativo',
    avatar: '',
    location: 'São Paulo, SP',
    joinDate: '2023-03-05',
  },
  {
    id: 5,
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    telefone: '(11) 95555-7890',
    tipo: 'Podcaster',
    ultimoAgendamento: '2024-01-14',
    totalGasto: 600,
    agendamentosTotal: 4,
    status: 'ativo',
    avatar: '',
    location: 'Osasco, SP',
    joinDate: '2023-08-10',
    notes: 'Podcaster, grava semanalmente',
  },
];

// Client form schema
const clientSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  location: z.string().min(2, 'Localização é obrigatória'),
  tipo: z.string().optional(),
  notes: z.string().optional(),
})

  function getInitials(nome: string) {
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Ativo
          </div>
        )
      case 'inativo':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Inativo
          </div>
        )
      case 'vip':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Star className="h-3 w-3 mr-1" />
            VIP
          </div>
        )
      default:
        return null
    }
  }

export default function ClientesPage() {
  const { showSuccess } = useNotifications()
  const [clientesList, setClientesList] = useState<Client[]>(clientes)
  const [filteredClientes, setFilteredClientes] = useState<Client[]>(clientes)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('nome')
  const [showNewClientForm, setShowNewClientForm] = useState(false)

  const handleNewClient = (data: Record<string, unknown>) => {
    const newClient: Client = {
      id: Math.max(...clientesList.map(c => c.id)) + 1,
      nome: data.nome as string,
      email: data.email as string,
      telefone: data.telefone as string,
      location: data.location as string,
      tipo: data.tipo as string | undefined,
      notes: data.notes as string | undefined,
      agendamentosTotal: 0,
      totalGasto: 0,
      ultimoAgendamento: new Date().toISOString().split('T')[0],
      status: 'ativo' as const,
      joinDate: new Date().toISOString().split('T')[0],
    }

    setClientesList(prev => [...prev, newClient])
    setShowNewClientForm(false)
    reset()
    showSuccess('Cliente', 'Cliente adicionado com sucesso!')
  }

  const {
    register,
    handleFormSubmit,
    formState: { errors, isValid },
    reset,
  } = useReactiveForm({
    schema: clientSchema,
    onSubmit: handleNewClient,
  })

  // Filter and search logic
  useEffect(() => {
    let filtered = clientesList

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.telefone.includes(searchQuery) ||
        cliente.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cliente => cliente.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome)
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        case 'ultimoAgendamento':
          return new Date(b.ultimoAgendamento).getTime() - new Date(a.ultimoAgendamento).getTime()
        case 'totalGasto':
          return b.totalGasto - a.totalGasto
        case 'agendamentosTotal':
          return b.agendamentosTotal - a.agendamentosTotal
        default:
          return 0
      }
    })

    setFilteredClientes(filtered)
  }, [clientesList, searchQuery, statusFilter, sortBy])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleDeleteClient = (clientId: number) => {
    setClientesList(prev => prev.filter(c => c.id !== clientId))
    showSuccess('Cliente', 'Cliente removido com sucesso!')
  }

  const handleContactClient = (client: Client) => {
    showSuccess('Contato', `Abrindo conversa com ${client.nome}`)
  }

  // Calculate stats
  const totalClientes = clientesList.length
  const activeClientes = clientesList.filter(c => c.status === 'ativo' || c.status === 'vip').length
  const totalRevenue = clientesList.reduce((sum, cliente) => sum + cliente.totalGasto, 0)
  const totalBookings = clientesList.reduce((sum, cliente) => sum + cliente.agendamentosTotal, 0)

  return (
    <Layout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie sua base de clientes e histórico de relacionamento
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => setShowNewClientForm(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar clientes por nome, email, telefone ou localização..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Status:</label>
                  <select 
                    className="border rounded-md px-3 py-1 text-sm bg-background"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Ordenar por:</label>
                  <select 
                    className="border rounded-md px-3 py-1 text-sm bg-background"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="nome">Nome</option>
                    <option value="joinDate">Data de cadastro</option>
                    <option value="ultimoAgendamento">Última reserva</option>
                    <option value="totalGasto">Total gasto</option>
                    <option value="agendamentosTotal">Total de reservas</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalClientes}</div>
              <p className="text-xs text-muted-foreground">+2 novos este mês</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Clientes Ativos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeClientes}</div>
              <p className="text-xs text-muted-foreground">{Math.round((activeClientes / totalClientes) * 100)}% do total</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">De todos os clientes</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reservas Totais
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">Todas as reservas</p>
            </CardContent>
          </Card>
        </div>

        {/* New Client Form */}
        {showNewClientForm && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Novo Cliente</CardTitle>
              <CardDescription>Adicione um novo cliente ao sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      {...register('nome')}
                      placeholder="Nome completo"
                      className={errors.nome ? 'border-red-500' : ''}
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="email@exemplo.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      {...register('telefone')}
                      placeholder="(11) 99999-9999"
                      className={errors.telefone ? 'border-red-500' : ''}
                    />
                    {errors.telefone && (
                      <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Localização</label>
                    <Input
                      {...register('location')}
                      placeholder="Cidade, Estado"
                      className={errors.location ? 'border-red-500' : ''}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <Input
                      {...register('tipo')}
                      placeholder="Artista Solo, Banda, Produtor..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Observações</label>
                  <textarea
                    {...register('notes')}
                    placeholder="Observações sobre o cliente..."
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={!isValid}>
                    Salvar Cliente
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowNewClientForm(false)
                      reset()
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Clientes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClientes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {searchQuery || statusFilter !== 'all' 
                ? 'Nenhum cliente encontrado com os filtros aplicados.'
                : 'Nenhum cliente cadastrado ainda.'
              }
            </div>
          ) : (
            filteredClientes.map((cliente) => (
              <Card key={cliente.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={cliente.avatar} alt={cliente.nome} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(cliente.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {cliente.location}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(cliente.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {cliente.telefone}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Gasto</p>
                        <p className="text-sm font-semibold">{formatCurrency(cliente.totalGasto)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reservas</p>
                        <p className="text-sm font-semibold">{cliente.agendamentosTotal}</p>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Última reserva:</span>
                        <span>{formatDate(cliente.ultimoAgendamento)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cliente desde:</span>
                        <span>{formatDate(cliente.joinDate)}</span>
                      </div>
                      {cliente.tipo && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="text-xs">{cliente.tipo}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Notes */}
                    {cliente.notes && (
                      <div className="p-2 bg-primary/10 rounded text-xs text-primary">
                        <strong>Observações:</strong> {cliente.notes}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleContactClient(cliente)}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Contatar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClient(cliente.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}