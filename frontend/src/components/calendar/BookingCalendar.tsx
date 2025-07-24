'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/pt-br'
import { useBookings, Booking } from '@/stores/bookingStore'
import { useRooms } from '@/stores/studioStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { useReactiveForm } from '@/hooks/useReactiveForm'
import { z } from 'zod'
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Configurar moment para português
moment.locale('pt-br')
const localizer = momentLocalizer(moment)

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
    createBookingWithNotification
  } = useBookings()
  
  const { rooms, fetchRooms } = useRooms()

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

  // Formulário para criar agendamento
  const {
    register,
    handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useReactiveForm<BookingFormData>({
    schema: bookingSchema,
    onSubmit: async (data) => {
      await createBookingWithNotification(data)
      setShowCreateModal(false)
      reset()
    },
    successMessage: 'Agendamento criado com sucesso!',
  })

  // Manipular seleção de slot
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setValue('data_inicio', moment(start).format('YYYY-MM-DDTHH:mm'))
    setValue('data_fim', moment(end).format('YYYY-MM-DDTHH:mm'))
    setShowCreateModal(true)
  }

  // Manipular clique em evento
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowDetailsModal(true)
  }

  // Estilo personalizado para eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    const booking = event.resource
    let backgroundColor = '#3174ad'
    
    switch (booking.status) {
      case 'CONFIRMADO':
        backgroundColor = '#10b981' // green
        break
      case 'PENDENTE':
        backgroundColor = '#f59e0b' // yellow
        break
      case 'CANCELADO':
        backgroundColor = '#ef4444' // red
        break
      case 'CONCLUIDO':
        backgroundColor = '#6b7280' // gray
        break
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
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
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Confirmado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Pendente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Cancelado</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendário */}
      <Card>
        <CardContent className="p-4">
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
          />
        </CardContent>
      </Card>

      {/* Modal para criar agendamento */}
      <Modal open={showCreateModal} onOpenChange={setShowCreateModal}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Novo Agendamento</ModalTitle>
          </ModalHeader>
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
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar Agendamento
            </Button>
          </ModalFooter>
        </form>
        </ModalContent>
      </Modal>

      {/* Modal para detalhes do agendamento */}
        <Modal open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Detalhes do Agendamento</ModalTitle>
            </ModalHeader>
        {selectedEvent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedEvent.resource.sala.nome}</h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {selectedEvent.resource.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{selectedEvent.resource.cliente.nome}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')} - 
                  {moment(selectedEvent.end).format('HH:mm')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{selectedEvent.resource.sala.estudio.nome}</span>
              </div>
              
              <div>
                <strong>Valor Total:</strong> R$ {selectedEvent.resource.valor_total.toFixed(2)}
              </div>
              
              {selectedEvent.resource.observacoes && (
                <div>
                  <strong>Observações:</strong>
                  <p className="text-gray-600 mt-1">{selectedEvent.resource.observacoes}</p>
                </div>
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