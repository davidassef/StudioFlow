'use client'

import React, { useState, useEffect } from 'react'
import { useOfflineData, useOfflineAgendamentos } from '@/hooks/useOfflineData'
import { WifiOff, RefreshCw, Calendar, Clock, User, MapPin, AlertCircle, CheckCircle } from 'lucide-react'

interface OfflineFallbackProps {
  route?: string
  title?: string
  message?: string
  showCachedData?: boolean
  children?: React.ReactNode
}

export function OfflineFallback({ 
  route = '',
  title = 'Você está offline',
  message = 'Não foi possível carregar esta página. Verifique sua conexão com a internet.',
  showCachedData = true,
  children 
}: OfflineFallbackProps) {
  const { isOnline, processSyncQueue, syncInProgress } = useOfflineData()
  const { getAgendamentos } = useOfflineAgendamentos()
  
  const [cachedAgendamentos, setCachedAgendamentos] = useState<any[]>([])
  const [retryAttempts, setRetryAttempts] = useState(0)
  const [lastRetryTime, setLastRetryTime] = useState<Date | null>(null)

  // Load cached data on mount
  useEffect(() => {
    if (showCachedData) {
      loadCachedData()
    }
  }, [showCachedData])

  const loadCachedData = async () => {
    try {
      const agendamentos = await getAgendamentos()
      setCachedAgendamentos(agendamentos.slice(0, 10)) // Show last 10
    } catch (error) {
      console.error('Failed to load cached data:', error)
    }
  }

  const handleRetry = async () => {
    setRetryAttempts(prev => prev + 1)
    setLastRetryTime(new Date())
    
    if (isOnline) {
      try {
        await processSyncQueue()
        // Attempt to reload the page
        window.location.reload()
      } catch (error) {
        console.error('Retry failed:', error)
      }
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'text-green-600 bg-green-100'
      case 'pendente': return 'text-yellow-600 bg-yellow-100'
      case 'cancelado': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Offline Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>

          {/* Connection Status */}
          <div className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
            ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}>
            {isOnline ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Conexão restaurada
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Sem conexão
              </>
            )}
          </div>

          {/* Retry Button */}
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              disabled={syncInProgress}
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                transition-colors duration-200
                ${isOnline 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                ${syncInProgress ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <RefreshCw className={`w-4 h-4 ${syncInProgress ? 'animate-spin' : ''}`} />
              {syncInProgress ? 'Tentando...' : 'Tentar Novamente'}
            </button>

            {retryAttempts > 0 && lastRetryTime && (
              <p className="text-sm text-gray-500">
                Última tentativa: {lastRetryTime.toLocaleTimeString('pt-BR')}
                {retryAttempts > 1 && ` (${retryAttempts} tentativas)`}
              </p>
            )}
          </div>

          {/* Navigation Options */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enquanto isso, você pode:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Ir para Início
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Cached Data Section */}
        {showCachedData && cachedAgendamentos.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Agendamentos em Cache
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {cachedAgendamentos.length} itens
              </span>
            </div>

            <div className="space-y-3">
              {cachedAgendamentos.map((agendamento, index) => {
                const { date, time } = formatDateTime(agendamento.dataHora)
                const isOfflineCreated = agendamento._offline?.status === 'pending' && agendamento.isOffline

                return (
                  <div 
                    key={agendamento.id || index}
                    className={`
                      p-4 rounded-lg border transition-colors
                      ${isOfflineCreated 
                        ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20' 
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {date} às {time}
                          </span>
                          {isOfflineCreated && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                              Criado offline
                            </span>
                          )}
                        </div>

                        {agendamento.cliente && (
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {agendamento.cliente.nome || agendamento.clienteId}
                            </span>
                          </div>
                        )}

                        {agendamento.sala && (
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {agendamento.sala.nome || agendamento.salaId}
                            </span>
                          </div>
                        )}

                        {agendamento.observacoes && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            {agendamento.observacoes}
                          </p>
                        )}
                      </div>

                      <div className="ml-4">
                        <span className={`
                          text-xs px-2 py-1 rounded-full font-medium
                          ${getStatusColor(agendamento.status)}
                        `}>
                          {agendamento.status}
                        </span>
                      </div>
                    </div>

                    {/* Offline Status Indicator */}
                    {agendamento._offline && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className={`
                            w-2 h-2 rounded-full
                            ${agendamento._offline.status === 'synced' ? 'bg-green-500' :
                              agendamento._offline.status === 'pending' ? 'bg-yellow-500' :
                              agendamento._offline.status === 'conflict' ? 'bg-red-500' :
                              'bg-gray-500'}
                          `} />
                          Status: {agendamento._offline.status}
                          {agendamento._offline.lastSync && (
                            <span className="ml-2">
                              Sync: {new Date(agendamento._offline.lastSync).toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                Dados salvos localmente. Serão sincronizados quando a conexão for restaurada.
              </p>
            </div>
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// Specialized offline fallback for specific routes
export function AgendamentosOfflineFallback() {
  return (
    <OfflineFallback
      title="Agendamentos Offline"
      message="Não foi possível carregar os agendamentos mais recentes, mas você pode ver os dados salvos localmente."
      showCachedData={true}
    />
  )
}

export function DashboardOfflineFallback() {
  return (
    <OfflineFallback
      title="Dashboard Offline"
      message="Não foi possível carregar os dados mais recentes do dashboard."
      showCachedData={true}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Funcionalidades Offline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Criar Agendamento</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Você pode criar novos agendamentos que serão sincronizados automaticamente.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100">Ver Dados Salvos</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Acesse agendamentos e dados salvos localmente no seu dispositivo.
            </p>
          </div>
        </div>
      </div>
    </OfflineFallback>
  )
}