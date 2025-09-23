'use client'

import { useState } from 'react'
import { useServiceWorker, usePWAInstall } from '@/hooks/useServiceWorker'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  RefreshCw, 
  Download, 
  Bell, 
  BellOff, 
  Wifi, 
  WifiOff,
  Smartphone,
  Monitor,
  Settings
} from 'lucide-react'

export default function PWATestPanel() {
  const [isVisible, setIsVisible] = useState(false)
  
  const {
    isSupported: swSupported,
    isRegistered,
    isControlling,
    error: swError,
    register,
    update,
    postMessage
  } = useServiceWorker()

  const {
    isInstallable,
    isInstalled,
    install
  } = usePWAInstall()

  const {
    isSupported: pushSupported,
    permission,
    isSubscribed,
    error: pushError,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification
  } = usePushNotifications()

  const [isOnline, setIsOnline] = useState(true)

  // Initialize online status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50"
        size="sm"
        variant="outline"
      >
        <Settings className="h-4 w-4 mr-2" />
        PWA Test
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">PWA Test Panel</CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
            >
              ×
            </Button>
          </div>
          <CardDescription>
            Teste as funcionalidades PWA do StudioFlow
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status da Conexão:</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </div>

          {/* Service Worker Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Service Worker</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Suportado:</span>
                <Badge variant={swSupported ? "default" : "secondary"}>
                  {swSupported ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Registrado:</span>
                <Badge variant={isRegistered ? "default" : "secondary"}>
                  {isRegistered ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Controlando:</span>
                <Badge variant={isControlling ? "default" : "secondary"}>
                  {isControlling ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
            
            {swError && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Erro: {swError}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button size="sm" onClick={register} disabled={isRegistered}>
                Registrar SW
              </Button>
              <Button size="sm" onClick={update} variant="outline">
                <RefreshCw className="h-3 w-3 mr-1" />
                Atualizar
              </Button>
            </div>
          </div>

          {/* PWA Installation */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Instalação PWA</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Instalável:</span>
                <Badge variant={isInstallable ? "default" : "secondary"}>
                  {isInstallable ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Instalado:</span>
                <Badge variant={isInstalled ? "default" : "secondary"}>
                  {isInstalled ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
            
            <Button 
              size="sm" 
              onClick={install} 
              disabled={!isInstallable || isInstalled}
              className="w-full"
            >
              <Download className="h-3 w-3 mr-1" />
              Instalar App
            </Button>
          </div>

          {/* Push Notifications */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Push Notifications</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Suportado:</span>
                <Badge variant={pushSupported ? "default" : "secondary"}>
                  {pushSupported ? "Sim" : "Não"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Permissão:</span>
                <Badge variant={
                  permission === 'granted' ? "default" : 
                  permission === 'denied' ? "destructive" : "secondary"
                }>
                  {permission}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Inscrito:</span>
                <Badge variant={isSubscribed ? "default" : "secondary"}>
                  {isSubscribed ? "Sim" : "Não"}
                </Badge>
              </div>
            </div>
            
            {pushError && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                Erro: {pushError}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={requestPermission}
                disabled={permission === 'granted'}
              >
                <Bell className="h-3 w-3 mr-1" />
                Permitir
              </Button>
              <Button 
                size="sm" 
                onClick={isSubscribed ? unsubscribe : subscribe}
                variant="outline"
              >
                {isSubscribed ? (
                  <>
                    <BellOff className="h-3 w-3 mr-1" />
                    Desinscrever
                  </>
                ) : (
                  <>
                    <Bell className="h-3 w-3 mr-1" />
                    Inscrever
                  </>
                )}
              </Button>
            </div>
            
            <Button 
              size="sm" 
              onClick={sendTestNotification}
              disabled={permission !== 'granted'}
              className="w-full"
              variant="outline"
            >
              Enviar Teste
            </Button>
          </div>

          {/* Cache Management */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Cache Management</h4>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => {
                  caches.keys().then(names => {
                    console.log('Cache names:', names)
                    alert(`Caches: ${names.join(', ')}`)
                  })
                }}
                variant="outline"
              >
                Listar Caches
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  caches.keys().then(names => {
                    return Promise.all(names.map(name => caches.delete(name)))
                  }).then(() => {
                    alert('Todos os caches foram limpos!')
                    window.location.reload()
                  })
                }}
                variant="destructive"
              >
                Limpar Cache
              </Button>
            </div>
          </div>

          {/* Device Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Informações do Dispositivo</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>User Agent:</span>
                <span className="text-right max-w-48 truncate">
                  {navigator.userAgent.split(' ')[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Display Mode:</span>
                <Badge>
                  {window.matchMedia('(display-mode: standalone)').matches ? (
                    <>
                      <Smartphone className="h-3 w-3 mr-1" />
                      Standalone
                    </>
                  ) : (
                    <>
                      <Monitor className="h-3 w-3 mr-1" />
                      Browser
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}