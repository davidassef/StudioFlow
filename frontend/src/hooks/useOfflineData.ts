'use client'

import { useState, useEffect, useCallback } from 'react'
import { offlineStorage, OfflineData, SyncQueueItem } from '@/lib/offlineStorage'

interface OfflineDataState {
  isOnline: boolean
  isInitialized: boolean
  syncQueueCount: number
  conflictCount: number
  lastSyncTime: Date | null
  syncInProgress: boolean
  error: string | null
  dataIntegrityStatus: 'unknown' | 'valid' | 'issues' | 'checking'
}

interface OfflineDataActions {
  storeData: (type: OfflineData['type'], id: string, data: any) => Promise<void>
  getData: (type: OfflineData['type'], id?: string) => Promise<OfflineData[]>
  deleteData: (type: OfflineData['type'], id: string) => Promise<void>
  addToSyncQueue: (action: SyncQueueItem['action'], resource: string, data: any, options?: {
    priority?: SyncQueueItem['priority']
    dependencies?: string[]
  }) => Promise<void>
  processSyncQueue: () => Promise<void>
  processSyncQueueBatch: (batchSize?: number) => Promise<{
    processed: number
    successful: number
    failed: number
    conflicts: number
  }>
  getConflicts: () => Promise<OfflineData[]>
  resolveConflict: (type: OfflineData['type'], id: string, resolution: 'client' | 'server' | 'merge', mergedData?: any) => Promise<void>
  validateDataIntegrity: () => Promise<{ valid: boolean; issues: string[]; repaired: number }>
  optimizeStorage: () => Promise<{ itemsRemoved: number; spaceFreed: number }>
  getDataSyncStatus: () => Promise<{
    totalItems: number
    syncedItems: number
    pendingItems: number
    conflictItems: number
    errorItems: number
    lastSyncTime: Date | null
  }>
  clearAllData: () => Promise<void>
  getStorageStats: () => Promise<{ dataCount: number; syncQueueCount: number; estimatedSize: number }>
}

export function useOfflineData(): OfflineDataState & OfflineDataActions {
  const [state, setState] = useState<OfflineDataState>({
    isOnline: true,
    isInitialized: false,
    syncQueueCount: 0,
    conflictCount: 0,
    lastSyncTime: null,
    syncInProgress: false,
    error: null,
    dataIntegrityStatus: 'unknown'
  })

  // Initialize offline storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      offlineStorage.init()
        .then(() => {
          setState(prev => ({ ...prev, isInitialized: true }))
          updateSyncQueueCount()
        })
        .catch(error => {
          setState(prev => ({ 
            ...prev, 
            error: error.message,
            isInitialized: false 
          }))
        })

      // Monitor online/offline status
      const handleOnline = () => {
        setState(prev => ({ ...prev, isOnline: true }))
        // Auto-sync when coming back online
        processSyncQueue()
      }
      
      const handleOffline = () => {
        setState(prev => ({ ...prev, isOnline: false }))
      }

      // Set initial online status
      setState(prev => ({ ...prev, isOnline: navigator.onLine }))

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const updateSyncQueueCount = useCallback(async () => {
    try {
      const queue = await offlineStorage.getSyncQueue()
      const conflicts = await offlineStorage.getConflicts()
      setState(prev => ({ 
        ...prev, 
        syncQueueCount: queue.length,
        conflictCount: conflicts.length
      }))
    } catch (error) {
      console.error('Failed to update sync queue count:', error)
    }
  }, [])

  const updateDataIntegrityStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, dataIntegrityStatus: 'checking' }))
      const result = await offlineStorage.validateDataIntegrity()
      setState(prev => ({ 
        ...prev, 
        dataIntegrityStatus: result.valid ? 'valid' : 'issues'
      }))
      
      if (result.repaired > 0) {
        console.log(`🔧 Data integrity check: ${result.repaired} items repaired`)
      }
    } catch (error) {
      setState(prev => ({ ...prev, dataIntegrityStatus: 'issues' }))
      console.error('Data integrity check failed:', error)
    }
  }, [])

  const storeData = useCallback(async (type: OfflineData['type'], id: string, data: any): Promise<void> => {
    try {
      await offlineStorage.storeData(type, id, data)
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to store data'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const getData = useCallback(async (type: OfflineData['type'], id?: string): Promise<OfflineData[]> => {
    try {
      const data = await offlineStorage.getData(type, id)
      setState(prev => ({ ...prev, error: null }))
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get data'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const deleteData = useCallback(async (type: OfflineData['type'], id: string): Promise<void> => {
    try {
      await offlineStorage.deleteData(type, id)
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete data'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const addToSyncQueue = useCallback(async (
    action: SyncQueueItem['action'], 
    resource: string, 
    data: any,
    options?: {
      priority?: SyncQueueItem['priority']
      dependencies?: string[]
    }
  ): Promise<void> => {
    try {
      await offlineStorage.addToSyncQueue(action, resource, data, options)
      await updateSyncQueueCount()
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to sync queue'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [updateSyncQueueCount])

  const processSyncQueue = useCallback(async (): Promise<void> => {
    if (!state.isOnline) {
      console.log('⚠️ Cannot sync while offline')
      return
    }

    if (state.syncInProgress) {
      console.log('🔄 Sync already in progress')
      return
    }

    try {
      setState(prev => ({ ...prev, syncInProgress: true }))
      
      const result = await offlineStorage.processSyncQueueBatch(10)
      console.log(`🔄 Sync batch completed: ${result.processed} processed, ${result.successful} successful, ${result.failed} failed, ${result.conflicts} conflicts`)

      await updateSyncQueueCount()
      setState(prev => ({ 
        ...prev, 
        lastSyncTime: new Date(),
        error: null,
        syncInProgress: false
      }))

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        syncInProgress: false
      }))
      console.error('Sync queue processing failed:', error)
    }
  }, [state.isOnline, state.syncInProgress, updateSyncQueueCount])

  const processSyncQueueBatch = useCallback(async (batchSize: number = 5) => {
    if (!state.isOnline) {
      throw new Error('Cannot sync while offline')
    }

    try {
      setState(prev => ({ ...prev, syncInProgress: true }))
      const result = await offlineStorage.processSyncQueueBatch(batchSize)
      await updateSyncQueueCount()
      setState(prev => ({ ...prev, syncInProgress: false }))
      return result
    } catch (error) {
      setState(prev => ({ ...prev, syncInProgress: false }))
      throw error
    }
  }, [state.isOnline, updateSyncQueueCount])

  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      await offlineStorage.clearAllData()
      await updateSyncQueueCount()
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear data'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [updateSyncQueueCount])

  const getStorageStats = useCallback(async () => {
    try {
      const stats = await offlineStorage.getStorageStats()
      setState(prev => ({ ...prev, error: null }))
      return stats
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get storage stats'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const getConflicts = useCallback(async () => {
    try {
      const conflicts = await offlineStorage.getConflicts()
      setState(prev => ({ ...prev, error: null }))
      return conflicts
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get conflicts'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  const resolveConflict = useCallback(async (
    type: OfflineData['type'], 
    id: string, 
    resolution: 'client' | 'server' | 'merge', 
    mergedData?: any
  ) => {
    try {
      await offlineStorage.resolveConflict(type, id, resolution, mergedData)
      await updateSyncQueueCount()
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resolve conflict'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [updateSyncQueueCount])

  const validateDataIntegrity = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, dataIntegrityStatus: 'checking' }))
      const result = await offlineStorage.validateDataIntegrity()
      setState(prev => ({ 
        ...prev, 
        dataIntegrityStatus: result.valid ? 'valid' : 'issues',
        error: null
      }))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate data integrity'
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        dataIntegrityStatus: 'issues'
      }))
      throw error
    }
  }, [])

  const optimizeStorage = useCallback(async () => {
    try {
      const result = await offlineStorage.optimizeStorage()
      await updateSyncQueueCount()
      setState(prev => ({ ...prev, error: null }))
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to optimize storage'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [updateSyncQueueCount])

  const getDataSyncStatus = useCallback(async () => {
    try {
      const status = await offlineStorage.getDataSyncStatus()
      setState(prev => ({ ...prev, error: null }))
      return status
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get sync status'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  // Initialize data integrity check on startup
  useEffect(() => {
    if (state.isInitialized) {
      updateDataIntegrityStatus()
    }
  }, [state.isInitialized, updateDataIntegrityStatus])

  return {
    ...state,
    storeData,
    getData,
    deleteData,
    addToSyncQueue,
    processSyncQueue,
    processSyncQueueBatch,
    getConflicts,
    resolveConflict,
    validateDataIntegrity,
    optimizeStorage,
    getDataSyncStatus,
    clearAllData,
    getStorageStats
  }
}

// Hook específico para agendamentos offline
export function useOfflineAgendamentos() {
  const { 
    storeData, 
    getData, 
    deleteData, 
    addToSyncQueue, 
    getConflicts,
    resolveConflict,
    isOnline 
  } = useOfflineData()

  const storeAgendamento = useCallback(async (agendamento: any) => {
    await storeData('agendamento', agendamento.id, agendamento)
  }, [storeData])

  const getAgendamentos = useCallback(async (id?: string) => {
    const data = await getData('agendamento', id)
    return data.map(item => ({
      ...item.data,
      _offline: {
        status: item.status,
        lastSync: item.lastSync,
        version: item.version,
        hasConflict: item.status === 'conflict'
      }
    }))
  }, [getData])

  const getAgendamentoConflicts = useCallback(async () => {
    const conflicts = await getConflicts()
    return conflicts
      .filter(item => item.type === 'agendamento')
      .map(item => ({
        id: item.id.split('_')[1],
        localData: item.data,
        serverData: item.conflictData,
        lastModified: item.lastModified,
        serverVersion: item.serverVersion
      }))
  }, [getConflicts])

  const createAgendamentoOffline = useCallback(async (agendamento: any) => {
    // Store locally first
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const agendamentoWithTempId = { 
      ...agendamento, 
      id: tempId, 
      isOffline: true,
      createdOffline: true,
      offlineTimestamp: Date.now()
    }
    
    await storeData('agendamento', tempId, agendamentoWithTempId)
    
    // Add to sync queue with high priority for new bookings
    await addToSyncQueue('create', 'agendamentos', agendamento, {
      priority: 'high'
    })

    return agendamentoWithTempId
  }, [storeData, addToSyncQueue])

  const updateAgendamentoOffline = useCallback(async (id: string, updates: any) => {
    // Get current data
    const currentData = await getData('agendamento', id)
    if (currentData.length === 0) {
      throw new Error('Agendamento not found in offline storage')
    }

    const current = currentData[0]
    const updatedAgendamento = { 
      ...current.data, 
      ...updates,
      lastModifiedOffline: Date.now()
    }
    
    // Store updated data locally with pending status
    await storeData('agendamento', id, updatedAgendamento)
    
    // Add to sync queue with normal priority
    await addToSyncQueue('update', `agendamentos/${id}`, updatedAgendamento, {
      priority: 'normal'
    })

    return updatedAgendamento
  }, [getData, storeData, addToSyncQueue])

  const deleteAgendamentoOffline = useCallback(async (id: string) => {
    // Get current data to preserve for sync
    const currentData = await getData('agendamento', id)
    const originalData = currentData.length > 0 ? currentData[0].data : null
    
    // Mark as deleted locally
    await deleteData('agendamento', id)
    
    // Add to sync queue with high priority for deletions
    await addToSyncQueue('delete', `agendamentos/${id}`, { id }, {
      priority: 'high'
    })
  }, [getData, deleteData, addToSyncQueue])

  const resolveAgendamentoConflict = useCallback(async (
    id: string, 
    resolution: 'client' | 'server' | 'merge',
    mergedData?: any
  ) => {
    await resolveConflict('agendamento', id, resolution, mergedData)
  }, [resolveConflict])

  const mergeAgendamentoData = useCallback((localData: any, serverData: any): any => {
    // Smart merge logic for agendamentos
    return {
      ...serverData, // Start with server data as base
      // Preserve local changes for specific fields
      observacoes: localData.observacoes || serverData.observacoes,
      status: localData.status === 'cancelado' ? localData.status : serverData.status,
      // Preserve the most recent timestamp
      updatedAt: Math.max(
        new Date(localData.updatedAt || 0).getTime(),
        new Date(serverData.updatedAt || 0).getTime()
      ),
      // Mark as merged
      _mergedOffline: true,
      _mergeTimestamp: Date.now()
    }
  }, [])

  return {
    storeAgendamento,
    getAgendamentos,
    getAgendamentoConflicts,
    createAgendamentoOffline,
    updateAgendamentoOffline,
    deleteAgendamentoOffline,
    resolveAgendamentoConflict,
    mergeAgendamentoData,
    isOnline
  }
}

// Hook específico para salas offline
export function useOfflineSalas() {
  const { storeData, getData, deleteData, addToSyncQueue, isOnline } = useOfflineData()

  const storeSala = useCallback(async (sala: any) => {
    await storeData('sala', sala.id, sala)
  }, [storeData])

  const getSalas = useCallback(async (id?: string) => {
    const data = await getData('sala', id)
    return data.map(item => item.data)
  }, [getData])

  const createSalaOffline = useCallback(async (sala: any) => {
    const tempId = `temp_${Date.now()}`
    const salaWithTempId = { ...sala, id: tempId, isOffline: true }
    
    await storeData('sala', tempId, salaWithTempId)
    await addToSyncQueue('create', 'salas', sala)

    return salaWithTempId
  }, [storeData, addToSyncQueue])

  const updateSalaOffline = useCallback(async (id: string, updates: any) => {
    const currentData = await getData('sala', id)
    if (currentData.length === 0) {
      throw new Error('Sala not found in offline storage')
    }

    const updatedSala = { ...currentData[0].data, ...updates }
    await storeData('sala', id, updatedSala)
    await addToSyncQueue('update', `salas/${id}`, updatedSala)

    return updatedSala
  }, [getData, storeData, addToSyncQueue])

  return {
    storeSala,
    getSalas,
    createSalaOffline,
    updateSalaOffline,
    isOnline
  }
}