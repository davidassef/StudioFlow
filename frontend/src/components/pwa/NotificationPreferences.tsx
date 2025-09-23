'use client'

import React, { useState, useEffect } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { NotificationPreferences as NotificationPreferencesType } from '@/lib/pushNotificationManager'

interface NotificationPreferencesProps {
  className?: string
  onPreferencesChange?: (preferences: NotificationPreferencesType) => void
}

export function NotificationPreferences({ 
  className = '', 
  onPreferencesChange 
}: NotificationPreferencesProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    preferences,
    isInitialized,
    error,
    requestPermissionWithUI,
    subscribe,
    unsubscribe,
    updatePreferences,
    sendTestNotification,
    sendTestPushNotification
  } = usePushNotifications()

  const [localPreferences, setLocalPreferences] = useState<NotificationPreferencesType>(preferences)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setLocalPreferences(preferences)
  }, [preferences])

  const handleToggleNotifications = async () => {
    setIsLoading(true)
    try {
      if (isSubscribed) {
        await unsubscribe()
        setSuccessMessage('Notificações desativadas com sucesso')
      } else {
        if (permission !== 'granted') {
          const result = await requestPermissionWithUI()
          if (result.permission !== 'granted') {
            setSuccessMessage('Permissão negada. Você pode ativar manualmente nas configurações do navegador.')
            return
          }
        }
        await subscribe()
        setSuccessMessage('Notificações ativadas com sucesso')
      }
    } catch (error) {
      console.error('Failed to toggle notifications:', error)
    } finally {
      setIsLoading(false)
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const handlePreferenceChange = async (key: keyof NotificationPreferencesType, value: any) => {
    const newPreferences = { ...localPreferences, [key]: value }
    setLocalPreferences(newPreferences)

    try {
      await updatePreferences({ [key]: value })
      onPreferencesChange?.(newPreferences)
    } catch (error) {
      console.error('Failed to update preferences:', error)
      // Revert local state on error
      setLocalPreferences(preferences)
    }
  }

  const handleQuietHoursChange = async (field: 'enabled' | 'start' | 'end', value: boolean | string) => {
    const newQuietHours = { ...localPreferences.quietHours, [field]: value }
    const newPreferences = { ...localPreferences, quietHours: newQuietHours }
    setLocalPreferences(newPreferences)

    try {
      await updatePreferences({ quietHours: newQuietHours })
      onPreferencesChange?.(newPreferences)
    } catch (error) {
      console.error('Failed to update quiet hours:', error)
      setLocalPreferences(preferences)
    }
  }

  const handleTestNotification = () => {
    try {
      sendTestNotification()
      setSuccessMessage('Notificação de teste enviada')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to send test notification:', error)
    }
  }

  const handleTestPushNotification = async () => {
    try {
      await sendTestPushNotification()
      setSuccessMessage('Notificação push de teste enviada')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to send test push notification:', error)
    }
  }

  if (!isInitialized) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    )
  }

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-yellow-800 dark:text-yellow-200">
            Notificações push não são suportadas neste navegador.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notificações Push
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure suas preferências de notificação
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isSubscribed 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}>
            {isSubscribed ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800 dark:text-green-200 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Main Toggle */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-medium text-gray-900 dark:text-white">
              Ativar Notificações Push
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Receba notificações importantes sobre seus agendamentos e atualizações do sistema
            </p>
          </div>
          
          <button
            onClick={handleToggleNotifications}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubscribed 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isSubscribed ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Permission Status */}
        <div className="mt-4 flex items-center text-sm">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            permission === 'granted' 
              ? 'bg-green-500' 
              : permission === 'denied' 
                ? 'bg-red-500' 
                : 'bg-yellow-500'
          }`} />
          <span className="text-gray-600 dark:text-gray-400">
            Permissão: {
              permission === 'granted' ? 'Concedida' :
              permission === 'denied' ? 'Negada' : 'Pendente'
            }
          </span>
        </div>
      </div>

      {/* Notification Types */}
      {isSubscribed && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Tipos de Notificação
          </h4>
          
          <div className="space-y-4">
            {/* Booking Confirmations */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Confirmações de Agendamento
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receba confirmações quando um agendamento for criado ou modificado
                </p>
              </div>
              <input
                type="checkbox"
                checked={localPreferences.bookingConfirmations}
                onChange={(e) => handlePreferenceChange('bookingConfirmations', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Booking Reminders */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Lembretes de Agendamento
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receba lembretes 1 hora antes dos seus agendamentos
                </p>
              </div>
              <input
                type="checkbox"
                checked={localPreferences.bookingReminders}
                onChange={(e) => handlePreferenceChange('bookingReminders', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* New Booking Requests */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Novas Solicitações
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receba notificações sobre novas solicitações de agendamento
                </p>
              </div>
              <input
                type="checkbox"
                checked={localPreferences.newBookingRequests}
                onChange={(e) => handlePreferenceChange('newBookingRequests', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* System Updates */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Atualizações do Sistema
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receba notificações sobre atualizações importantes do sistema
                </p>
              </div>
              <input
                type="checkbox"
                checked={localPreferences.systemUpdates}
                onChange={(e) => handlePreferenceChange('systemUpdates', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Marketing Messages */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Mensagens Promocionais
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receba ofertas especiais e novidades do StudioFlow
                </p>
              </div>
              <input
                type="checkbox"
                checked={localPreferences.marketingMessages}
                onChange={(e) => handlePreferenceChange('marketingMessages', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sound & Vibration */}
      {isSubscribed && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Som e Vibração
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Som das Notificações
              </label>
              <input
                type="checkbox"
                checked={localPreferences.soundEnabled}
                onChange={(e) => handlePreferenceChange('soundEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Vibração (Mobile)
              </label>
              <input
                type="checkbox"
                checked={localPreferences.vibrationEnabled}
                onChange={(e) => handlePreferenceChange('vibrationEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quiet Hours */}
      {isSubscribed && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-medium text-gray-900 dark:text-white">
                Horário Silencioso
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não receber notificações durante determinados horários
              </p>
            </div>
            <input
              type="checkbox"
              checked={localPreferences.quietHours.enabled}
              onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          {localPreferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Início
                </label>
                <input
                  type="time"
                  value={localPreferences.quietHours.start}
                  onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fim
                </label>
                <input
                  type="time"
                  value={localPreferences.quietHours.end}
                  onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Notifications */}
      {isSubscribed && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Testar Notificações
          </h4>
          
          <div className="flex space-x-3">
            <button
              onClick={handleTestNotification}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Teste Local
            </button>
            <button
              onClick={handleTestPushNotification}
              disabled={!isSubscribed}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Teste Push
            </button>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Use os botões acima para testar se as notificações estão funcionando corretamente
          </p>
        </div>
      )}
    </div>
  )
}