'use client'

import React, { useState, useEffect } from 'react'
import { Studio } from '@/types/studio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, Users, Wrench } from 'lucide-react'

interface BookingFormData {
  studioId: string
  date: string
  startTime: string
  endTime: string
  notes: string
  totalPrice: number
}

interface BookingFormProps {
  studio: Studio
  onSubmit: (data: BookingFormData) => Promise<void> | void
  onCancel: () => void
}

interface FormErrors {
  date?: string
  startTime?: string
  endTime?: string
  general?: string
}

export const BookingForm: React.FC<BookingFormProps> = ({
  studio,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  // Calcular preço total quando horários mudarem
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}:00`)
      const end = new Date(`2024-01-01T${formData.endTime}:00`)
      const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      
      if (diffInHours > 0) {
        setTotalPrice(diffInHours * studio.price)
      } else {
        setTotalPrice(0)
      }
    } else {
      setTotalPrice(0)
    }
  }, [formData.startTime, formData.endTime, studio.price])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Validar data
    if (!formData.date) {
      newErrors.date = 'Data é obrigatória'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.date = 'Data não pode ser no passado'
      }
    }
    
    // Validar horário de início
    if (!formData.startTime) {
      newErrors.startTime = 'Horário de início é obrigatório'
    }
    
    // Validar horário de término
    if (!formData.endTime) {
      newErrors.endTime = 'Horário de término é obrigatório'
    }
    
    // Validar se horário de término é após início
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}:00`)
      const end = new Date(`2024-01-01T${formData.endTime}:00`)
      
      if (end <= start) {
        newErrors.endTime = 'Horário de término deve ser após o início'
      } else {
        // Validar duração mínima de 1 hora
        const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        if (diffInHours < 1) {
          newErrors.endTime = 'Duração mínima é de 1 hora'
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando corrigido
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const bookingData: BookingFormData = {
        studioId: studio.id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
        totalPrice
      }
      
      await onSubmit(bookingData)
    } catch (error) {
      console.error('Erro ao processar reserva:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reservar {studio.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Informações do Studio */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-semibold text-lg">{studio.name}</h3>
          
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{studio.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatPrice(studio.price)}/hora</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>Capacidade: {studio.capacity} pessoas</span>
          </div>
          
          {studio.equipment && studio.equipment.length > 0 && (
            <div className="flex items-start gap-2 text-gray-600">
              <Wrench className="h-4 w-4 mt-0.5" />
              <div>
                <span className="font-medium">Equipamentos:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {studio.equipment.map((item, index) => (
                    <span key={index} className="text-sm bg-gray-200 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Data da Reserva */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Data da Reserva
            </label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          
          {/* Horários */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium mb-2">
                Horário de Início
              </label>
              <Input
                id="startTime"
                type="time"
                min="08:00"
                max="22:00"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                Horário de Término
              </label>
              <Input
                id="endTime"
                type="time"
                min="08:00"
                max="22:00"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>
          
          {/* Observações */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Observações
            </label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre a reserva..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
          
          {/* Total */}
          {totalPrice > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          )}
          
          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Processando reserva...' : 'Confirmar Reserva'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default BookingForm