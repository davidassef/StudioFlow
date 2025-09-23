'use client'

import { useEffect, useState } from 'react'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Download, Wifi, WifiOff, Bell } from 'lucide-react'

export default function ServiceWorkerManager() {
  const {
    isSupported,
    isRegistered,
    isWaiting,
    isControlling,
    error,
    register,
    update,
    skipWaiting
  } = useServiceWorker()

  const [isOnline, setIsOnline] = useState(true)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    // Show update prompt when new version is waiting
    if (isWaiting) {
      setShowUpdatePrompt(true)
    }
  }, [isWaiting])

  useEffect(() => {
    // Auto-register service worker if supported and not registered
    if (isSupported && !isRegistered && !error) {
      register().catch(console.error)
    }
  }, [isSupported, isRegistered, error, register])

  const handleUpdate = async () => {
    try {
      await update()
      if (isWaiting) {
        skipWaiting()
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update service worker:', error)
    }
  }

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false)
  }

  // Don't render if service workers are not supported
  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Online/Offline Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isOnline 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            Offline
          </>
        )}
      </div>

      {/* Service Worker Status */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Service Worker Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Registered:</span>
              <span className={isRegistered ? 'text-green-600' : 'text-red-600'}>
                {isRegistered ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Controlling:</span>
              <span className={isControlling ? 'text-green-600' : 'text-red-600'}>
                {isControlling ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Update Available:</span>
              <span className={isWaiting ? 'text-orange-600' : 'text-gray-600'}>
                {isWaiting ? 'Yes' : 'No'}
              </span>
            </div>
            {error && (
              <div className="text-red-600 text-xs mt-2">
                Error: {error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <Card className="w-80 shadow-lg border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
              <Download className="h-4 w-4" />
              Nova Versão Disponível
            </CardTitle>
            <CardDescription className="text-blue-600">
              Uma nova versão do StudioFlow está disponível. Atualize para obter as últimas funcionalidades.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleUpdate}
              className="flex-1"
            >
              Atualizar Agora
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDismissUpdate}
            >
              Depois
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Component for PWA installation prompt
export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    const handleAppInstalled = () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA installed')
    }

    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <Card className="fixed bottom-4 left-4 w-80 shadow-lg border-green-200 bg-green-50 z-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-green-800">
          <Download className="h-4 w-4" />
          Instalar StudioFlow
        </CardTitle>
        <CardDescription className="text-green-600">
          Instale o StudioFlow no seu dispositivo para acesso rápido e funcionalidades offline.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button 
          size="sm" 
          onClick={handleInstall}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Instalar App
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleDismiss}
        >
          Não Agora
        </Button>
      </CardContent>
    </Card>
  )
}