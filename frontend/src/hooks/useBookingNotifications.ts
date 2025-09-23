'use client';

import { useCallback, useEffect, useState } from 'react';
import { PushNotificationManager } from '@/lib/pushNotificationManager';
import { PushNotificationAPI } from '@/lib/pushNotificationAPI';

export interface BookingNotification {
  id: string;
  type: 'confirmation' | 'reminder' | 'request' | 'update' | 'cancellation';
  bookingId: string;
  studioId: string;
  userId: string;
  scheduledFor?: Date;
  sent: boolean;
  error?: string;
}

export interface UseBookingNotificationsReturn {
  // Estado
  notifications: BookingNotification[];
  isLoading: boolean;
  error: string | null;
  
  // Ações
  scheduleConfirmationNotification: (bookingId: string, bookingData: any) => Promise<void>;
  scheduleReminderNotification: (bookingId: string, bookingTime: Date) => Promise<void>;
  scheduleRequestNotification: (studioOwnerId: string, bookingData: any) => Promise<void>;
  scheduleUpdateNotification: (bookingId: string, changes: any) => Promise<void>;
  scheduleCancellationNotification: (bookingId: string, reason?: string) => Promise<void>;
  
  // Utilitários
  cancelNotification: (notificationId: string) => Promise<void>;
  getNotificationsByBooking: (bookingId: string) => BookingNotification[];
  clearError: () => void;
}

export function useBookingNotifications(): UseBookingNotificationsReturn {
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar notificações existentes
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      // Carregar do localStorage ou API
      const stored = localStorage.getItem('booking-notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          scheduledFor: n.scheduledFor ? new Date(n.scheduledFor) : undefined
        })));
      }
    } catch (err) {
      setError('Erro ao carregar notificações');
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveNotifications = useCallback((newNotifications: BookingNotification[]) => {
    localStorage.setItem('booking-notifications', JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  }, []);

  const scheduleConfirmationNotification = useCallback(async (
    bookingId: string, 
    bookingData: any
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const manager = PushNotificationManager.getInstance();
      
      // Verificar se as notificações estão habilitadas
      const preferences = await manager.getPreferences();
      if (!preferences.confirmations.enabled) {
        return;
      }

      // Criar notificação de confirmação
      const notification: BookingNotification = {
        id: `confirmation-${bookingId}-${Date.now()}`,
        type: 'confirmation',
        bookingId,
        studioId: bookingData.studioId,
        userId: bookingData.userId,
        sent: false
      };

      // Enviar notificação imediatamente
      await PushNotificationAPI.sendTestNotification({
        title: '✅ Agendamento Confirmado',
        body: `Seu agendamento no ${bookingData.studioName} foi confirmado para ${new Date(bookingData.startTime).toLocaleString('pt-BR')}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: `booking-confirmation-${bookingId}`,
        data: {
          type: 'booking_confirmation',
          bookingId,
          studioId: bookingData.studioId,
          url: `/bookings/${bookingId}`
        },
        actions: [
          {
            action: 'view',
            title: 'Ver Detalhes',
            icon: '/icons/view.png'
          },
          {
            action: 'calendar',
            title: 'Adicionar ao Calendário',
            icon: '/icons/calendar.png'
          }
        ]
      });

      notification.sent = true;
      
      const updatedNotifications = [...notifications, notification];
      saveNotifications(updatedNotifications);

    } catch (err) {
      setError('Erro ao enviar notificação de confirmação');
      console.error('Error scheduling confirmation notification:', err);
    } finally {
      setIsLoading(false);
    }
  }, [notifications, saveNotifications]);

  const scheduleReminderNotification = useCallback(async (
    bookingId: string, 
    bookingTime: Date
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const manager = PushNotificationManager.getInstance();
      const preferences = await manager.getPreferences();
      
      if (!preferences.reminders.enabled) {
        return;
      }

      // Calcular tempo para lembrete (1 hora antes)
      const reminderTime = new Date(bookingTime.getTime() - 60 * 60 * 1000);
      const now = new Date();

      if (reminderTime <= now) {
        // Se o lembrete deveria ter sido enviado, não agendar
        return;
      }

      const notification: BookingNotification = {
        id: `reminder-${bookingId}-${Date.now()}`,
        type: 'reminder',
        bookingId,
        studioId: '', // Será preenchido quando enviado
        userId: '', // Será preenchido quando enviado
        scheduledFor: reminderTime,
        sent: false
      };

      // Agendar lembrete usando setTimeout (em produção, usar sistema de jobs)
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      
      setTimeout(async () => {
        try {
          await PushNotificationAPI.sendTestNotification({
            title: '⏰ Lembrete de Agendamento',
            body: `Seu agendamento começa em 1 hora (${bookingTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: `booking-reminder-${bookingId}`,
            requireInteraction: true,
            data: {
              type: 'booking_reminder',
              bookingId,
              url: `/bookings/${bookingId}`
            },
            actions: [
              {
                action: 'view',
                title: 'Ver Agendamento',
                icon: '/icons/view.png'
              },
              {
                action: 'directions',
                title: 'Como Chegar',
                icon: '/icons/directions.png'
              }
            ]
          });

          // Marcar como enviado
          const updatedNotifications = notifications.map(n => 
            n.id === notification.id ? { ...n, sent: true } : n
          );
          saveNotifications(updatedNotifications);

        } catch (err) {
          console.error('Error sending reminder notification:', err);
          
          // Marcar erro
          const updatedNotifications = notifications.map(n => 
            n.id === notification.id ? { ...n, error: 'Falha ao enviar' } : n
          );
          saveNotifications(updatedNotifications);
        }
      }, timeUntilReminder);

      const updatedNotifications = [...notifications, notification];
      saveNotifications(updatedNotifications);

    } catch (err) {
      setError('Erro ao agendar lembrete');
      console.error('Error scheduling reminder notification:', err);
    } finally {
      setIsLoading(false);
    }
  }, [notifications, saveNotifications]);

  const scheduleRequestNotification = useCallback(async (
    studioOwnerId: string, 
    bookingData: any
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const manager = PushNotificationManager.getInstance();
      const preferences = await manager.getPreferences();
      
      if (!preferences.requests.enabled) {
        return;
      }

      const notification: BookingNotification = {
        id: `request-${bookingData.id}-${Date.now()}`,
        type: 'request',
        bookingId: bookingData.id,
        studioId: bookingData.studioId,
        userId: studioOwnerId,
        sent: false
      };

      // Enviar notificação para o proprietário do estúdio
      await PushNotificationAPI.sendTestNotification({
        title: '🎵 Nova Solicitação de Agendamento',
        body: `${bookingData.userName} solicitou agendamento para ${new Date(bookingData.startTime).toLocaleString('pt-BR')}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: `booking-request-${bookingData.id}`,
        requireInteraction: true,
        data: {
          type: 'booking_request',
          bookingId: bookingData.id,
          studioId: bookingData.studioId,
          url: `/studio/bookings/${bookingData.id}`
        },
        actions: [
          {
            action: 'approve',
            title: 'Aprovar',
            icon: '/icons/approve.png'
          },
          {
            action: 'view',
            title: 'Ver Detalhes',
            icon: '/icons/view.png'
          },
          {
            action: 'reject',
            title: 'Rejeitar',
            icon: '/icons/reject.png'
          }
        ]
      });

      notification.sent = true;
      
      const updatedNotifications = [...notifications, notification];
      saveNotifications(updatedNotifications);

    } catch (err) {
      setError('Erro ao enviar notificação de solicitação');
      console.error('Error scheduling request notification:', err);
    } finally {
      setIsLoading(false);
    }
  }, [notifications, saveNotifications]);

  const scheduleUpdateNotification = useCallback(async (
    bookingId: string, 
    changes: any
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const manager = PushNotificationManager.getInstance();
      const preferences = await manager.getPreferences();
      
      if (!preferences.updates.enabled) {
        return;
      }

      const notification: BookingNotification = {
        id: `update-${bookingId}-${Date.now()}`,
        type: 'update',
        bookingId,
        studioId: changes.studioId,
        userId: changes.userId,
        sent: false
      };

      // Determinar tipo de mudança
      let changeDescription = 'Seu agendamento foi atualizado';
      if (changes.startTime) {
        changeDescription = `Horário alterado para ${new Date(changes.startTime).toLocaleString('pt-BR')}`;
      } else if (changes.status) {
        changeDescription = `Status alterado para ${changes.status}`;
      }

      await PushNotificationAPI.sendTestNotification({
        title: '📝 Agendamento Atualizado',
        body: changeDescription,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: `booking-update-${bookingId}`,
        data: {
          type: 'booking_update',
          bookingId,
          changes,
          url: `/bookings/${bookingId}`
        },
        actions: [
          {
            action: 'view',
            title: 'Ver Alterações',
            icon: '/icons/view.png'
          }
        ]
      });

      notification.sent = true;
      
      const updatedNotifications = [...notifications, notification];
      saveNotifications(updatedNotifications);

    } catch (err) {
      setError('Erro ao enviar notificação de atualização');
      console.error('Error scheduling update notification:', err);
    } finally {
      setIsLoading(false);
    }
  }, [notifications, saveNotifications]);

  const scheduleCancellationNotification = useCallback(async (
    bookingId: string, 
    reason?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const manager = PushNotificationManager.getInstance();
      const preferences = await manager.getPreferences();
      
      if (!preferences.updates.enabled) {
        return;
      }

      const notification: BookingNotification = {
        id: `cancellation-${bookingId}-${Date.now()}`,
        type: 'cancellation',
        bookingId,
        studioId: '',
        userId: '',
        sent: false
      };

      const body = reason 
        ? `Agendamento cancelado. Motivo: ${reason}`
        : 'Seu agendamento foi cancelado';

      await PushNotificationAPI.sendTestNotification({
        title: '❌ Agendamento Cancelado',
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: `booking-cancellation-${bookingId}`,
        data: {
          type: 'booking_cancellation',
          bookingId,
          reason,
          url: '/bookings'
        },
        actions: [
          {
            action: 'rebook',
            title: 'Reagendar',
            icon: '/icons/calendar.png'
          },
          {
            action: 'view',
            title: 'Ver Detalhes',
            icon: '/icons/view.png'
          }
        ]
      });

      notification.sent = true;
      
      const updatedNotifications = [...notifications, notification];
      saveNotifications(updatedNotifications);

    } catch (err) {
      setError('Erro ao enviar notificação de cancelamento');
      console.error('Error scheduling cancellation notification:', err);
    } finally {
      setIsLoading(false);
    }
  }, [notifications, saveNotifications]);

  const cancelNotification = useCallback(async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      saveNotifications(updatedNotifications);
    } catch (err) {
      setError('Erro ao cancelar notificação');
      console.error('Error canceling notification:', err);
    }
  }, [notifications, saveNotifications]);

  const getNotificationsByBooking = useCallback((bookingId: string) => {
    return notifications.filter(n => n.bookingId === bookingId);
  }, [notifications]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    notifications,
    isLoading,
    error,
    scheduleConfirmationNotification,
    scheduleReminderNotification,
    scheduleRequestNotification,
    scheduleUpdateNotification,
    scheduleCancellationNotification,
    cancelNotification,
    getNotificationsByBooking,
    clearError
  };
}