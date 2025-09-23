'use client';

import React, { useState, useEffect } from 'react';
import { PushNotificationManager, NotificationPreferences } from '@/lib/pushNotificationManager';
import { notificationIntegration, BookingData } from '@/lib/notificationIntegration';

interface NotificationPreferencesManagerProps {
  className?: string;
  showTestButtons?: boolean;
  onPreferencesChange?: (preferences: NotificationPreferences) => void;
}

export default function NotificationPreferencesManager({
  className = '',
  showTestButtons = true,
  onPreferencesChange
}: NotificationPreferencesManagerProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  const manager = PushNotificationManager.getInstance();

  useEffect(() => {
    loadPreferences();
    checkPermissionStatus();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const prefs = await manager.getPreferences();
      setPreferences(prefs);
      onPreferencesChange?.(prefs);
    } catch (err) {
      setError('Erro ao carregar preferências');
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermissionStatus = () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  const handlePermissionRequest = async () => {
    try {
      setError(null);
      const granted = await manager.requestPermission();
      if (granted) {
        setPermissionStatus('granted');
        setSuccess('Permissões concedidas com sucesso!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Permissões negadas. Você pode ativá-las nas configurações do navegador.');
      }
    } catch (err) {
      setError('Erro ao solicitar permissões');
      console.error('Error requesting permission:', err);
    }
  };

  const handlePreferenceChange = async (
    category: keyof NotificationPreferences,
    field: string,
    value: any
  ) => {
    if (!preferences) return;

    try {
      setError(null);
      const updatedPreferences = {
        ...preferences,
        [category]: {
          ...preferences[category],
          [field]: value
        }
      };

      setPreferences(updatedPreferences);
      await manager.updatePreferences(updatedPreferences);
      onPreferencesChange?.(updatedPreferences);
    } catch (err) {
      setError('Erro ao atualizar preferências');
      console.error('Error updating preferences:', err);
      // Reverter mudança em caso de erro
      loadPreferences();
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    try {
      setIsSaving(true);
      setError(null);
      
      await manager.updatePreferences(preferences);
      setSuccess('Preferências salvas com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
      
      onPreferencesChange?.(preferences);
    } catch (err) {
      setError('Erro ao salvar preferências');
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (type: string) => {
    try {
      setError(null);
      
      const testBooking: BookingData = {
        id: `test-${Date.now()}`,
        studioId: 'studio-1',
        studioName: 'Estúdio Teste',
        userId: 'user-1',
        userName: 'Usuário Teste',
        userEmail: 'teste@exemplo.com',
        startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hora no futuro
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas no futuro
        status: 'confirmed',
        price: 150
      };

      switch (type) {
        case 'confirmation':
          await notificationIntegration.notifyUserBookingConfirmed(testBooking);
          break;
        case 'reminder':
          await notificationIntegration.sendReminderNotification(testBooking);
          break;
        case 'request':
          await notificationIntegration.notifyStudioOwnerNewRequest(
            { id: 'owner-1', name: 'Proprietário Teste', email: 'owner@exemplo.com', studioIds: ['studio-1'] },
            testBooking
          );
          break;
        case 'update':
          await notificationIntegration.handleBookingUpdate(testBooking, { startTime: new Date().toISOString() });
          break;
        case 'cancellation':
          await notificationIntegration.handleBookingCancellation(testBooking, 'Teste de cancelamento');
          break;
      }

      setSuccess(`Notificação de teste "${type}" enviada!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Erro ao enviar notificação de teste: ${err}`);
      console.error('Error sending test notification:', err);
    }
  };

  if (isLoading) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          Erro ao carregar preferências de notificação
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          🔔 Preferências de Notificação
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure como e quando você deseja receber notificações sobre seus agendamentos
        </p>
      </div>

      {/* Status de Permissão */}
      <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900 dark:text-white">
            Status das Permissões
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            permissionStatus === 'granted' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : permissionStatus === 'denied'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {permissionStatus === 'granted' ? '✅ Concedidas' : 
             permissionStatus === 'denied' ? '❌ Negadas' : '⏳ Pendentes'}
          </span>
        </div>
        
        {permissionStatus !== 'granted' && (
          <div className="mt-2">
            <button
              onClick={handlePermissionRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Solicitar Permissões
            </button>
          </div>
        )}
      </div>

      {/* Mensagens de Feedback */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">✅ {success}</p>
        </div>
      )}

      {/* Configurações por Tipo */}
      <div className="space-y-6">
        {/* Confirmações */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">✅ Confirmações</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quando seus agendamentos forem confirmados
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.confirmations.enabled}
                onChange={(e) => handlePreferenceChange('confirmations', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {preferences.confirmations.enabled && (
            <div className="ml-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.confirmations.sound}
                  onChange={(e) => handlePreferenceChange('confirmations', 'sound', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Som</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.confirmations.vibration}
                  onChange={(e) => handlePreferenceChange('confirmations', 'vibration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Vibração</span>
              </label>
              
              {showTestButtons && (
                <button
                  onClick={() => handleTestNotification('confirmation')}
                  className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200 transition-colors"
                >
                  Testar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lembretes */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">⏰ Lembretes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lembretes 1 hora antes dos agendamentos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.reminders.enabled}
                onChange={(e) => handlePreferenceChange('reminders', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {preferences.reminders.enabled && (
            <div className="ml-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.reminders.sound}
                  onChange={(e) => handlePreferenceChange('reminders', 'sound', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Som</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.reminders.vibration}
                  onChange={(e) => handlePreferenceChange('reminders', 'vibration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Vibração</span>
              </label>
              
              {showTestButtons && (
                <button
                  onClick={() => handleTestNotification('reminder')}
                  className="mt-2 px-3 py-1 bg-orange-100 text-orange-800 rounded text-xs hover:bg-orange-200 transition-colors"
                >
                  Testar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Solicitações */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">🎵 Solicitações</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Novas solicitações de agendamento (proprietários)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.requests.enabled}
                onChange={(e) => handlePreferenceChange('requests', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {preferences.requests.enabled && (
            <div className="ml-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.requests.sound}
                  onChange={(e) => handlePreferenceChange('requests', 'sound', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Som</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.requests.vibration}
                  onChange={(e) => handlePreferenceChange('requests', 'vibration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Vibração</span>
              </label>
              
              {showTestButtons && (
                <button
                  onClick={() => handleTestNotification('request')}
                  className="mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200 transition-colors"
                >
                  Testar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Atualizações */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">📝 Atualizações</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mudanças e cancelamentos de agendamentos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.updates.enabled}
                onChange={(e) => handlePreferenceChange('updates', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {preferences.updates.enabled && (
            <div className="ml-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.updates.sound}
                  onChange={(e) => handlePreferenceChange('updates', 'sound', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Som</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.updates.vibration}
                  onChange={(e) => handlePreferenceChange('updates', 'vibration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Vibração</span>
              </label>
              
              {showTestButtons && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleTestNotification('update')}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
                  >
                    Testar Atualização
                  </button>
                  <button
                    onClick={() => handleTestNotification('cancellation')}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    Testar Cancelamento
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Marketing */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">📢 Marketing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Promoções e novidades dos estúdios
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.marketing.enabled}
                onChange={(e) => handlePreferenceChange('marketing', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {preferences.marketing.enabled && (
            <div className="ml-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.marketing.sound}
                  onChange={(e) => handlePreferenceChange('marketing', 'sound', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Som</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.marketing.vibration}
                  onChange={(e) => handlePreferenceChange('marketing', 'vibration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Vibração</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Horário Silencioso */}
      <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">🌙 Horário Silencioso</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Período em que as notificações serão silenciadas
        </p>
        
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={preferences.quietHours.enabled}
            onChange={(e) => handlePreferenceChange('quietHours', 'enabled', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Ativar horário silencioso</span>
        </label>
        
        {preferences.quietHours.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Início
              </label>
              <input
                type="time"
                value={preferences.quietHours.start}
                onChange={(e) => handlePreferenceChange('quietHours', 'start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fim
              </label>
              <input
                type="time"
                value={preferences.quietHours.end}
                onChange={(e) => handlePreferenceChange('quietHours', 'end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Botão de Salvar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Salvando...' : 'Salvar Preferências'}
        </button>
      </div>
    </div>
  );
}