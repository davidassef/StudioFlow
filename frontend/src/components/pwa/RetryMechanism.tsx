'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw, AlertCircle, CheckCircle, X, Wifi, WifiOff } from 'lucide-react'
import { useOfflineData } from '@/hooks/useOfflineData'

interface RetryMechanismProps {
  onRetry: () => Promise<void>
  error?: Error | string | null
  maxRetries?: number
  retryDelay?: number
  showToast?: boolean
  className?: string
}

export function RetryMechanism({
  onRetry,
  error,
  maxRetries = 3,
  retryDelay = 1000,
  showToast = true,
  className = ''
}: RetryMechanismProps) {
  const { isOnline } = useOfflineData()
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [lastRetryTime, setLastRetryTime] = useState<Date | null>(null)
  const [nextRetryIn, setNextRetryIn] = useState<number | null>(null)

  // Auto-retry when coming back online
  useEffect(() => {
    if (isOnline && error && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        handleRetry()
      }, 2000) // Wait 2 seconds after coming online
      
      return () => clearTimeout(timer)
    }
  }, [isOnline, error, retryCount, maxRetries])

  // Countdown timer for next retry
  useEffect(() => {
    if (nextRetryIn && nextRetryIn > 0) {
      const timer = setTimeout(() => {
        setNextRetryIn(prev => prev ? prev - 1 : null)
      }, 1000)
      
      return () => clearTimeout(timer)
    } else if (nextRetryIn === 0) {
      setNextRetryIn(null)
      handleRetry()
    }
  }, [nextRetryIn])

  const handleRetry = useCallback(async () => {
    if (isRetrying || retryCount >= maxRetries) return

    setIsRetrying(true)
    setLastRetryTime(new Date())

    try {
      await onRetry()
      // Success - reset retry count
      setRetryCount(0)
    } catch (retryError) {
      // Failed - increment retry count
      setRetryCount(prev => prev + 1)
      
      // Schedule next retry with exponential backoff
      if (retryCount + 1 < maxRetries) {
        const delay = Math.min(retryDelay * Math.pow(2, retryCount), 30000) // Max 30 seconds
        setNextRetryIn(Math.floor(delay / 1000))
      }
    } finally {
      setIsRetrying(false)
    }
  }, [onRetry, isRetrying, retryCount, maxRetries, retryDelay])

  const handleManualRetry = () => {
    if (!isOnline) {
      // Show offline message
      return
    }
    
    setNextRetryIn(null)
    handleRetry()
  }

  const getErrorMessage = () => {
    if (typeof error === 'string') return error
    if (error instanceof Error) return error.message
    return 'Ocorreu um erro inesperado'
  }

  const canRetry = retryCount < maxRetries && !isRetrying
  const hasExceededRetries = retryCount >= maxRetries

  if (!error) return null

  return (
    <div className={`${className}`}>
      {/* Inline Retry Component */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Falha na Conexão
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {getErrorMessage()}
            </p>
            
            {/* Connection Status */}
            <div className="flex items-center gap-2 mt-2">
              {isOnline ? (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Wifi className="w-3 h-3" />
                  Online
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </div>
              )}
              
              {lastRetryTime && (
                <span className="text-xs text-gray-500">
                  Última tentativa: {lastRetryTime.toLocaleTimeString('pt-BR')}
                </span>
              )}
            </div>

            {/* Retry Information */}
            {retryCount > 0 && (
              <div className="mt-2 text-xs text-red-600">
                Tentativa {retryCount} de {maxRetries}
                {hasExceededRetries && ' - Máximo de tentativas atingido'}
              </div>
            )}
          </div>

          {/* Retry Button */}
          <div className="flex-shrink-0">
            {canRetry && (
              <button
                onClick={handleManualRetry}
                disabled={!isOnline || isRetrying || nextRetryIn !== null}
                className={`
                  inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded
                  transition-colors duration-200
                  ${isOnline && !isRetrying && nextRetryIn === null
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Tentando...' : 
                 nextRetryIn ? `Aguarde ${nextRetryIn}s` :
                 !isOnline ? 'Offline' : 'Tentar Novamente'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast-style retry notification
export function RetryToast({
  error,
  onRetry,
  onDismiss,
  maxRetries = 3,
  autoRetry = true
}: {
  error: Error | string | null
  onRetry: () => Promise<void>
  onDismiss: () => void
  maxRetries?: number
  autoRetry?: boolean
}) {
  const { isOnline } = useOfflineData()
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Auto-dismiss after successful retry
  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
      setIsVisible(false)
      setTimeout(onDismiss, 300) // Wait for animation
    } catch (retryError) {
      setRetryCount(prev => prev + 1)
    } finally {
      setIsRetrying(false)
    }
  }

  // Auto-retry when online
  useEffect(() => {
    if (autoRetry && isOnline && error && retryCount < maxRetries && !isRetrying) {
      const timer = setTimeout(handleRetry, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, error, retryCount, maxRetries, autoRetry, isRetrying])

  if (!error || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className={`
        bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Erro de Conexão
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {typeof error === 'string' ? error : error.message}
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleRetry}
                disabled={!isOnline || isRetrying}
                className={`
                  inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded
                  transition-colors duration-200
                  ${isOnline && !isRetrying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Tentando...' : !isOnline ? 'Offline' : 'Tentar Novamente'}
              </button>
              
              {retryCount > 0 && (
                <span className="text-xs text-gray-500">
                  {retryCount}/{maxRetries}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onDismiss, 300)
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing retry state
export function useRetryMechanism(
  operation: () => Promise<void>,
  options: {
    maxRetries?: number
    retryDelay?: number
    autoRetry?: boolean
  } = {}
) {
  const { maxRetries = 3, retryDelay = 1000, autoRetry = true } = options
  const { isOnline } = useOfflineData()
  
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const executeWithRetry = useCallback(async () => {
    try {
      setError(null)
      await operation()
      setRetryCount(0) // Reset on success
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      
      if (autoRetry && retryCount < maxRetries) {
        setIsRetrying(true)
        setTimeout(async () => {
          setRetryCount(prev => prev + 1)
          setIsRetrying(false)
          await executeWithRetry()
        }, retryDelay * Math.pow(2, retryCount))
      }
    }
  }, [operation, retryCount, maxRetries, retryDelay, autoRetry])

  const manualRetry = useCallback(async () => {
    if (isOnline && !isRetrying) {
      setRetryCount(0)
      await executeWithRetry()
    }
  }, [isOnline, isRetrying, executeWithRetry])

  return {
    error,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries && !isRetrying && isOnline,
    executeWithRetry,
    manualRetry,
    clearError: () => setError(null)
  }
}