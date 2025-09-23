'use client'

import React, { useState, useEffect } from 'react'
import { useOfflineAgendamentos, useOfflineData } from '@/hooks/useOfflineData'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  WifiOff,
  Filter,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'

interface OfflineDataDisplayProps {
  showSyncStatus?: boolean
  showFilters?: boolean
  maxItems?: number
  className?: string
}

export function OfflineDataDisplay({
  showSyncStatus = true,
  showFilters = true,
  maxItems = 50,
  className = ''
}: OfflineDataDisplayProps) {
  const { 
    getAgendamentos, 
    getAgendamentoConflicts,
    resolveAgendamentoConflict,
    mergeAgendamentoData 
  } = useOfflineAgendamentos()
  
  const { 
    isOnline, 
    syncQueueCount, 
    conflictCount, 
    processSyncQueue,
    syncInProgress 
  } = useOfflineData()

  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [conflicts, setConflicts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [syncStatusFilter, setSyncStatusFilter] = useState<string>('all')
  const [showOfflineOnly, setShowOfflineOnly] = useState(false)

  // Load data on mount and when online status changes
  useEffect(() => {
    loadData()
  }, [isOnline])

  const loadData = async () => {
    setLoading(true)
    try {
      const [agendamentosData, conflictsData] = await Promise.all([
        getAgendamentos(),
        getAgendamentoConflicts()
      ])
      
      setAgendamentos(agendamentosData.slice(0, maxItems))
      setConflicts(conflictsData)
    } catch (error) {
      console.error('Failed to load offline data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      await processSyncQueue()
      await loadData() // Reload data after sync
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

  const handleResolveConflict = async (conflictId: string, resolution: 'client' | 'server' | 'merge') => {
    try {
      const conflict = conflicts.find(c => c.id === conflictId)
      if (!conflict) return

      let mergedData
      if (resolution === 'merge') {
        mergedData = mergeAgendamentoData(conflict.localData, conflict.serverData)
      }

      await resolveAgendamentoConflict(conflictId, resolution, mergedData)
      await loadData() // Reload data after resolution
    } catch (error) {
      console.error('Failed to resolve conflict:', error)
    }
  }

  // Filter agendamentos
  const filteredAgendamentos = agendamentos.filter(agendamento => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        agendamento.observacoes?.toLowerCase().includes(searchLower) ||
        agendamento.cliente?.nome?.toLowerCase().includes(searchLower) ||
        agendamento.sala?.nome?.toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter !== 'all' && agendamento.status !== statusFilter) {
      return false
    }

    // Sync status filter
    if (syncStatusFilter !== 'all') {
      const syncStatus = agendamento._offline?.status || 'synced'
      if (syncStatus !== syncStatusFilter) return false
    }

    // Offline only filter
    if (showOfflineOnly && !agendamento._offline) {
      return false
    }

    return true
  })

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'pendente': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'cancelado': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'conflict': return 'text-red-600 bg-red-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="w-3 h-3" />
      case 'pending': return <RefreshCw className="w-3 h-3 animate-spin" />
      case 'conflict': return <AlertTriangle className="w-3 h-3" />
      case 'error': return <AlertTriangle className="w-3 h-3" />
      default: return <CheckCircle className="w-3 h-3" />
    }
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Carregando dados offline...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Header with Sync Status */}
      {showSyncStatus && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {syncQueueCount > 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">
                    {syncQueueCount} pendente{syncQueueCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {conflictCount > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">
                    {conflictCount} conflito{conflictCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {isOnline && (syncQueueCount > 0 || conflictCount > 0) && (
              <button
                onClick={handleSync}
                disabled={syncInProgress}
                className={`
                  inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${syncInProgress
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
              >
                <RefreshCw className={`w-4 h-4 ${syncInProgress ? 'animate-spin' : ''}`} />
                {syncInProgress ? 'Sincronizando...' : 'Sincronizar'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conflicts Section */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
            Conflitos Detectados ({conflicts.length})
          </h3>
          
          <div className="space-y-3">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Agendamento {conflict.id}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Dados locais e do servidor diferem
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveConflict(conflict.id, 'client')}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Usar Local
                    </button>
                    <button
                      onClick={() => handleResolveConflict(conflict.id, 'server')}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Usar Servidor
                    </button>
                    <button
                      onClick={() => handleResolveConflict(conflict.id, 'merge')}
                      className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Mesclar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200">Dados Locais</h5>
                    <pre className="text-xs mt-1 text-blue-700 dark:text-blue-300 overflow-auto">
                      {JSON.stringify(conflict.localData, null, 2)}
                    </pre>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <h5 className="font-medium text-green-800 dark:text-green-200">Dados do Servidor</h5>
                    <pre className="text-xs mt-1 text-green-700 dark:text-green-300 overflow-auto">
                      {JSON.stringify(conflict.serverData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar agendamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os Status</option>
              <option value="confirmado">Confirmado</option>
              <option value="pendente">Pendente</option>
              <option value="cancelado">Cancelado</option>
            </select>

            {/* Sync Status Filter */}
            <select
              value={syncStatusFilter}
              onChange={(e) => setSyncStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os Sync</option>
              <option value="synced">Sincronizado</option>
              <option value="pending">Pendente</option>
              <option value="conflict">Conflito</option>
              <option value="error">Erro</option>
            </select>

            {/* Offline Only Toggle */}
            <button
              onClick={() => setShowOfflineOnly(!showOfflineOnly)}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${showOfflineOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {showOfflineOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Apenas Offline
            </button>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Agendamentos Offline
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {filteredAgendamentos.length} de {agendamentos.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAgendamentos.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {agendamentos.length === 0 
                  ? 'Não há dados offline salvos ainda.'
                  : 'Tente ajustar os filtros para ver mais resultados.'
                }
              </p>
            </div>
          ) : (
            filteredAgendamentos.map((agendamento, index) => {
              const { date, time } = formatDateTime(agendamento.dataHora)
              const syncStatus = agendamento._offline?.status || 'synced'
              const isOfflineCreated = agendamento.isOffline || agendamento.createdOffline

              return (
                <div key={agendamento.id || index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {date} às {time}
                          </span>
                        </div>

                        {isOfflineCreated && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                            Criado offline
                          </span>
                        )}

                        {/* Sync Status Badge */}
                        <div className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                          ${getSyncStatusColor(syncStatus)}
                        `}>
                          {getSyncStatusIcon(syncStatus)}
                          {syncStatus}
                        </div>
                      </div>

                      <div className="space-y-1 mb-2">
                        {agendamento.cliente && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {agendamento.cliente.nome || agendamento.clienteId}
                            </span>
                          </div>
                        )}

                        {agendamento.sala && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {agendamento.sala.nome || agendamento.salaId}
                            </span>
                          </div>
                        )}
                      </div>

                      {agendamento.observacoes && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {agendamento.observacoes}
                        </p>
                      )}

                      {/* Offline Metadata */}
                      {agendamento._offline && (
                        <div className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-700 rounded p-2">
                          <div className="flex items-center justify-between">
                            <span>
                              Versão: {agendamento._offline.version}
                              {agendamento._offline.lastSync && (
                                <span className="ml-2">
                                  Sync: {new Date(agendamento._offline.lastSync).toLocaleString('pt-BR')}
                                </span>
                              )}
                            </span>
                            {agendamento._offline.hasConflict && (
                              <span className="text-red-600 font-medium">
                                Conflito detectado
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${getStatusColor(agendamento.status)}
                      `}>
                        {agendamento.status}
                      </span>

                      {agendamento.duracao && (
                        <span className="text-xs text-gray-500">
                          {agendamento.duracao}min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}