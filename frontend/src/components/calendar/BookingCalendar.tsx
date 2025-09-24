'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/pt-br'
import { useBookings, Booking } from '@/stores/bookingStore'
import { useStudioStore } from '@/stores/studioStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { useReactiveForm } from '@/hooks/useReactiveForm'
import { z } from 'zod'
import { Calendar as CalendarIcon, Clock, MapPin, User, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Configurar moment para português
moment.locale('pt-br')
const localizer = momentLocalizer(moment)

// Tipos
interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  resource: Booking
}

// Componente de Tooltip personalizado
const EventTooltip: React.FC<{ event: CalendarEvent }> = ({ event }) => {
  const booking = event.resource
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-4 w-4 text-gray-500" />
        <span className="font-medium text-sm">{booking.cliente?.nome || 'Cliente'}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{booking.sala?.nome || 'Sala'}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <span className="text-sm">
          {moment(event.start).format('DD/MM HH:mm')} - {moment(event.end).format('HH:mm')}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">R$ {booking.valor_total?.toFixed(2) || '0.00'}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          booking.status === 'CONFIRMADO' ? 'bg-green-100 text-green-800' :
          booking.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
          booking.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {booking.status}
        </span>
      </div>
      
      {booking.observacoes && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">{booking.observacoes}</p>
        </div>
      )}
    </div>
  )
}

// Schema para criação de agendamento
const bookingSchema = z.object({
  sala_id: z.number().min(1, 'Selecione uma sala'),
  data_inicio: z.string().min(1, 'Data de início é obrigatória'),
  data_fim: z.string().min(1, 'Data de fim é obrigatória'),
  observacoes: z.string().optional(),
}).refine((data) => {
  const inicio = new Date(data.data_inicio)
  const fim = new Date(data.data_fim)
  return fim > inicio
}, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['data_fim']
})

type BookingFormData = z.infer<typeof bookingSchema>

interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  resource: Booking
}

interface BookingCalendarProps {
  roomId?: number
  height?: number
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  roomId, 
  height = 600 
}) => {
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const { 
    bookings, 
    fetchBookings, 
    createBookingWithNotification,
    isLoading
  } = useBookings()
  
  const { rooms, fetchRooms } = useStudioStore()

  // Carregar dados
  useEffect(() => {
    fetchBookings(roomId ? { sala_id: roomId } : {})
    fetchRooms()
  }, [roomId, fetchBookings, fetchRooms])

  // Converter bookings para eventos do calendário
  const events: CalendarEvent[] = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.sala.nome} - ${booking.cliente.nome}`,
    start: new Date(booking.data_inicio),
    end: new Date(booking.data_fim),
    resource: booking,
  }))

  // Estado para validação de conflitos
  const [hasConflict, setHasConflict] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)

  // Formulário para criar agendamento
  const {
    register,
    handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useReactiveForm<BookingFormData>({
    schema: bookingSchema,
    onSubmit: async (data) => {
      if (hasConflict) {
        alert('Não é possível criar agendamento neste horário devido a conflitos.')
        return
      }
      
      await createBookingWithNotification(data)
      setShowCreateModal(false)
      reset()
      setHasConflict(false)
      setSelectedRoomId(null)
    },
    successMessage: 'Agendamento criado com sucesso!',
  })

  // Validar conflitos quando os campos de data/hora mudam
  useEffect(() => {
    const startTime = watch('data_inicio')
    const endTime = watch('data_fim')
    const roomIdValue = watch('sala_id')
    
    if (startTime && endTime && roomIdValue) {
      const start = new Date(startTime)
      const end = new Date(endTime)
      const conflict = checkBookingConflicts(roomIdValue, start, end)
      setHasConflict(conflict)
      setSelectedRoomId(roomIdValue)
    } else {
      setHasConflict(false)
      setSelectedRoomId(null)
    }
  }, [watch('data_inicio'), watch('data_fim'), watch('sala_id')])

  // Estado para verificação de disponibilidade
  const [availabilityChecked, setAvailabilityChecked] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])

  // Verificar disponibilidade no backend
  const checkRoomAvailability = async (roomId: number, startDate: string, endDate: string) => {
    try {
      // TODO: Implementar chamada para API de disponibilidade
      // const slots = await getAvailableSlots(roomId, startDate, endDate)
      // setAvailableSlots(slots)
      setAvailabilityChecked(true)
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error)
    }
  }

  // Verificar conflitos incluindo slots disponíveis
  const checkBookingConflicts = (roomId: number, startTime: Date, endTime: Date): boolean => {
    // Primeiro verificar conflitos locais
    const localConflict = bookings.some(booking => {
      if (booking.sala.id !== roomId || booking.status === 'CANCELADO') {
        return false
      }
      
      const bookingStart = new Date(booking.data_inicio)
      const bookingEnd = new Date(booking.data_fim)
      
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      )
    })

    if (localConflict) return true

    // TODO: Verificar contra slots disponíveis do backend
    // if (availableSlots.length > 0) {
    //   return !availableSlots.some(slot => {
    //     const slotStart = new Date(slot.start_time)
    //     const slotEnd = new Date(slot.end_time)
    //     return startTime >= slotStart && endTime <= slotEnd
    //   })
    // }

    return false
  }

  // Manipular seleção de slot com validação de conflitos
  const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
    // Se uma sala específica foi selecionada, verificar disponibilidade
    if (roomId) {
      // Verificar disponibilidade no backend
      const startDate = moment(start).format('YYYY-MM-DD')
      const endDate = moment(end).format('YYYY-MM-DD')
      await checkRoomAvailability(roomId, startDate, endDate)
      
      // Verificar conflitos
      const hasConflict = checkBookingConflicts(roomId, start, end)
      if (hasConflict) {
        alert('Este horário já está ocupado ou não está disponível. Por favor, selecione outro horário.')
        return
      }
    }
    
    setValue('data_inicio', moment(start).format('YYYY-MM-DDTHH:mm'))
    setValue('data_fim', moment(end).format('YYYY-MM-DDTHH:mm'))
    setShowCreateModal(true)
  }

  // Manipular clique em evento
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowDetailsModal(true)
  }

  // Estilo personalizado para eventos com tooltips
  const eventStyleGetter = (event: CalendarEvent) => {
    const booking = event.resource
    let backgroundColor = '#6b7280' // default gray
    let borderColor = '#4b5563'
    let textColor = '#ffffff'
    
    switch (booking.status) {
      case 'CONFIRMADO':
        backgroundColor = '#10b981' // green
        borderColor = '#059669'
        break
      case 'PENDENTE':
        backgroundColor = '#f59e0b' // yellow
        borderColor = '#d97706'
        textColor = '#000000'
        break
      case 'CANCELADO':
        backgroundColor = '#ef4444' // red
        borderColor = '#dc2626'
        break
      case 'CONCLUIDO':
        backgroundColor = '#6b7280' // gray
        borderColor = '#4b5563'
        break
    }
    
    return {
      style: {
        backgroundColor,
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        color: textColor,
        borderRadius: '6px',
        opacity: 0.9,
        display: 'block',
        fontSize: '12px',
        fontWeight: '500',
        padding: '2px 6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ':hover': {
          opacity: 1,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    }
  }

  // Mensagens em português
  const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há agendamentos neste período.',
    showMore: (total: number) => `+ Ver mais (${total})`,
  }



  return (
    <div className="space-y-4">
      {/* Cabeçalho com filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendário de Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={view === Views.MONTH ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView(Views.MONTH)}
              >
                Mês
              </Button>
              <Button
                variant={view === Views.WEEK ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView(Views.WEEK)}
              >
                Semana
              </Button>
              <Button
                variant={view === Views.DAY ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView(Views.DAY)}
              >
                Dia
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Confirmado</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                <span>Pendente</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-red-500" />
                <span>Cancelado</span>
              </div>
              {isLoading && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                  <span>Carregando...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendário */}
      <Card>
        <CardContent className="p-4 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="text-gray-600">Carregando agendamentos...</span>
              </div>
            </div>
          )}
          
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              messages={messages}
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 8, 0)} // 8:00 AM
              max={new Date(2024, 0, 1, 22, 0)} // 10:00 PM
              slotPropGetter={(date) => {
                // Destacar slots disponíveis vs ocupados
                if (roomId && availabilityChecked) {
                  const isOccupied = bookings.some(booking => {
                    if (booking.sala.id !== roomId || booking.status === 'CANCELADO') return false
                    const bookingStart = new Date(booking.data_inicio)
                    const bookingEnd = new Date(booking.data_fim)
                    return date >= bookingStart && date < bookingEnd
                  })
                  
                  return {
                    style: {
                      backgroundColor: isOccupied ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      border: isOccupied ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',
                    }
                  }
                }
                return {}
              }}
              components={{
                event: ({ event }) => (
                  <div className="rbc-event-content">
                    <div className="font-medium text-xs truncate">
                      {event.title}
                    </div>
                    <div className="text-xs opacity-75 truncate">
                      {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                    </div>
                  </div>
                ),
                toolbar: ({ label }) => (
                  <div className="rbc-toolbar flex flex-col sm:flex-row justify-between items-center gap-2 p-2 bg-gray-50 rounded-t-lg">
                    <div className="flex gap-2">
                      <Button
                        variant={view === Views.MONTH ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView(Views.MONTH)}
                      >
                        Mês
                      </Button>
                      <Button
                        variant={view === Views.WEEK ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView(Views.WEEK)}
                      >
                        Semana
                      </Button>
                      <Button
                        variant={view === Views.DAY ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView(Views.DAY)}
                      >
                        Dia
                      </Button>
                    </div>
                    <span className="font-medium text-lg">{label}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDate(moment(date).subtract(1, view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toDate())}
                      >
                        ‹
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDate(new Date())}
                      >
                        Hoje
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDate(moment(date).add(1, view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toDate())}
                      >
                        ›
                      </Button>
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal para criar agendamento */}
      <Modal open={showCreateModal} onOpenChange={setShowCreateModal}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Novo Agendamento</ModalTitle>
          </ModalHeader>
          
          {hasConflict && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Conflito de horário detectado</p>
                <p className="text-sm text-red-600">Este horário já está ocupado. Por favor, selecione outro horário.</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sala</label>
            <select
              {...register('sala_id', { valueAsNumber: true })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione uma sala</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.nome} - R$ {room.preco_hora}/hora
                </option>
              ))}
            </select>
            {errors.sala_id && (
              <p className="text-red-500 text-sm mt-1">{errors.sala_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data/Hora Início</label>
              <Input
                type="datetime-local"
                {...register('data_inicio')}
                error={errors.data_inicio?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Data/Hora Fim</label>
              <Input
                type="datetime-local"
                {...register('data_fim')}
                error={errors.data_fim?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Observações</label>
            <textarea
              {...register('observacoes')}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Observações sobre o agendamento..."
            />
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                reset()
                setHasConflict(false)
                setSelectedRoomId(null)
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={hasConflict}
              className={hasConflict ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Criar Agendamento
            </Button>
          </ModalFooter>
        </form>
        </ModalContent>
      </Modal>

      {/* Modal para detalhes do agendamento */}
        <Modal open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <ModalContent className="max-w-lg">
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Detalhes do Agendamento
              </ModalTitle>
            </ModalHeader>
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedEvent.resource.sala.nome}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                selectedEvent.resource.status === 'CONFIRMADO' ? 'bg-green-100 text-green-800' :
                selectedEvent.resource.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                selectedEvent.resource.status === 'CANCELADO' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedEvent.resource.status === 'CONFIRMADO' && <CheckCircle className="w-3 h-3" />}
                {selectedEvent.resource.status === 'PENDENTE' && <AlertCircle className="w-3 h-3" />}
                {selectedEvent.resource.status === 'CANCELADO' && <XCircle className="w-3 h-3" />}
                {selectedEvent.resource.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Cliente</p>
                  <p className="text-sm text-gray-600">{selectedEvent.resource.cliente.nome}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Horário</p>
                  <p className="text-sm text-gray-600">
                    {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Duração: {moment.duration(moment(selectedEvent.end).diff(moment(selectedEvent.start))).asHours()}h
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Estúdio</p>
                  <p className="text-sm text-gray-600">{selectedEvent.resource.sala.estudio.nome}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Valor Total</span>
                <span className="text-lg font-bold text-blue-600">R$ {selectedEvent.resource.valor_total.toFixed(2)}</span>
              </div>
            </div>
            
            {selectedEvent.resource.observacoes && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">Observações</p>
                <p className="text-sm text-yellow-700">{selectedEvent.resource.observacoes}</p>
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
                className="flex-1"
              >
                Fechar
              </Button>
              {selectedEvent.resource.status === 'PENDENTE' && (
                <>
                  <Button
                    variant="default"
                    onClick={() => {
                      // TODO: Implementar confirmação
                      setShowDetailsModal(false)
                    }}
                    className="flex-1"
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // TODO: Implementar cancelamento
                      setShowDetailsModal(false)
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
          )}
          </ModalContent>
        </Modal>
    </div>
  )
}

export default BookingCalendar

// Estilos personalizados para o calendário
const calendarStyles = `
  .calendar-container .rbc-calendar {
    font-family: inherit;
  }
  
  .calendar-container .rbc-header {
    padding: 8px 6px;
    font-weight: 600;
    color: #374151;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .calendar-container .rbc-today {
    background-color: #fef3c7;
  }
  
  .calendar-container .rbc-event {
    border-radius: 6px;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .calendar-container .rbc-event:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .calendar-container .rbc-event.rbc-selected {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .calendar-container .rbc-slot-selection {
    background-color: rgba(59, 130, 246, 0.1);
    border: 1px dashed #3b82f6;
  }
  
  .calendar-container .rbc-time-slot {
    border-top: 1px solid #f3f4f6;
  }
  
  .calendar-container .rbc-current-time-indicator {
    background-color: #ef4444;
    height: 2px;
  }
  
  /* Responsividade */
  @media (max-width: 768px) {
    .calendar-container .rbc-toolbar {
      flex-direction: column !important;
      gap: 1rem !important;
    }
    
    .calendar-container .rbc-toolbar button {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }
  }
`

// Injetar estilos no head do documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = calendarStyles
  document.head.appendChild(styleSheet)
}