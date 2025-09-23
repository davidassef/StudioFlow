'use client'

import React, { useState, useEffect } from 'react'
import { useOfflineData } from '@/hooks/useOfflineData'
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom'
  showDetails?: boolean
  className?: string
}

export function OfflineIndicator({ 
  position = 'top', 
  showDetails = false,
  className = '' 
}: OfflineIndicatorProps) {
  const { 
    isOnline, 
    syncQueueCount, 
    conflictCount, 
    syncInProgress, 
    lastSyncTime,
    processSyncQueue 
  } = useOfflineData()

  const [showExpanded, setShowExpanded] = useState(false)
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(null)

  // Track when we go offline
  useEffect(() => {
    if (!isOnline && lastOnlineTime === null) {
      setLastOnlineTime(new Date())
    } else if (isOnline) {
      setLastOnlineTime(null)
    }
  }, [isOnline, lastOnlineTime])

  // Auto-hide expanded view after 5 seconds when online
  useEffect(() => {
    if (isOnline && showExpanded) {
      const timer = setTimeout(() => setShowExpanded(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, showExpanded])

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (syncInProgress) return 'bg-yellow-500'
    if (syncQueueCount > 0 || conflictCount > 0) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (syncInProgress) return 'Sincronizando...'
    if (conflictCount > 0) return `${conflictCount} conflito${conflictCount > 1 ? 's' : ''}`
    if (syncQueueCount > 0) return `${syncQueueCount} pendente${syncQueueCount > 1 ? 's' : ''}`
    return 'Online'
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />
    if (syncInProgress) return <RefreshCw className="w-4 h-4 animate-spin" />
    if (conflictCount > 0) return <AlertTriangle className="w-4 h-4" />
    if (syncQueueCount > 0) return <CloudOff className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    
    if (diffMins < 1) return 'agora mesmo'
    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    return date.toLocaleDateString()
  }

  const handleRetrySync = async () => {
    if (isOnline && !syncInProgress) {
      try {
        await processSyncQueue()
      } catch (error) {
        console.error('Manual sync failed:', error)
      }
    }
  }

  const positionClasses = position === 'top' 
    ? 'top-4 left-1/2 transform -translate-x-1/2' 
    : 'bottom-4 right-4'

  return (
    <div className={`fixed ${positionClasses} z-50 ${className}`}>
      {/* Compact Indicator */}
      <div 
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full shadow-lg cursor-pointer
          transition-all duration-300 backdrop-blur-sm border
          ${getStatusColor()} text-white
          ${showExpanded ? 'rounded-b-none' : ''}
          hover:shadow-xl
        `}
        onClick={() => setShowExpanded(!showExpanded)}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {(syncQueueCount > 0 || conflictCount > 0) && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        )}
      </div>

      {/* Expanded Details */}
      {(showExpanded || showDetails) && (
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg border border-t-0 p-4 min-w-80">
          <div className="space-y-3">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  {isOnline ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              {!isOnline && lastOnlineTime && (
                <span className="text-xs text-gray-500">
                  desde {formatTimeAgo(lastOnlineTime)}
                </span>
              )}
            </div>

            {/* Sync Status */}
            {isOnline && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Sincronização</span>
                </div>
                <div className="flex items-center gap-2">
                  {syncInProgress && (
                    <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                  )}
                  <span className="text-xs text-gray-500">
                    {lastSyncTime ? formatTimeAgo(lastSyncTime) : 'Nunca'}
                  </span>
                </div>
              </div>
            )}

            {/* Pending Operations */}
            {syncQueueCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-600">
                  {syncQueueCount} operação{syncQueueCount > 1 ? 'ões' : ''} pendente{syncQueueCount > 1 ? 's' : ''}
                </span>
                {isOnline && !syncInProgress && (
                  <button
                    onClick={handleRetrySync}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Sincronizar
                  </button>
                )}
              </div>
            )}

            {/* Conflicts */}
            {conflictCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    {conflictCount} conflito{conflictCount > 1 ? 's' : ''} detectado{conflictCount > 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Navigate to conflicts page
                    window.location.href = '/conflicts'
                  }}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Resolver
                </button>
              </div>
            )}

            {/* Offline Mode Info */}
            {!isOnline && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Modo Offline Ativo
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      Suas alterações serão sincronizadas quando a conexão for restaurada.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {isOnline && syncQueueCount === 0 && conflictCount === 0 && !syncInProgress && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    Todos os dados estão sincronizados
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for status bars
export function OfflineStatusBadge() {
  const { isOnline, syncQueueCount, conflictCount, syncInProgress } = useOfflineData()

  if (isOnline && syncQueueCount === 0 && conflictCount === 0 && !syncInProgress) {
    return null // Hide when everything is fine
  }

  return (
    <div className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
      ${!isOnline ? 'bg-red-100 text-red-800' : 
        syncInProgress ? 'bg-yellow-100 text-yellow-800' :
        (syncQueueCount > 0 || conflictCount > 0) ? 'bg-orange-100 text-orange-800' :
        'bg-green-100 text-green-800'}
    `}>
      {!isOnline ? (
        <>
          <WifiOff className="w-3 h-3" />
          Offline
        </>
      ) : syncInProgress ? (
        <>
          <RefreshCw className="w-3 h-3 animate-spin" />
          Sync
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3" />
          {syncQueueCount + conflictCount}
        </>
      )}
    </div>
  )
}