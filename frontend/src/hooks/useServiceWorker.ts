'use client'

import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isInstalling: boolean
  isWaiting: boolean
  isControlling: boolean
  registration: ServiceWorkerRegistration | null
  error: string | null
}

interface ServiceWorkerActions {
  register: () => Promise<void>
  unregister: () => Promise<void>
  update: () => Promise<void>
  skipWaiting: () => void
  postMessage: (message: any) => void
}

export function useServiceWorker(): ServiceWorkerState & ServiceWorkerActions {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isControlling: false,
    registration: null,
    error: null
  })

  useEffect(() => {
    // Check if service workers are supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      setState(prev => ({ ...prev, isSupported: true }))
      
      // Check if already registered
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          setState(prev => ({
            ...prev,
            isRegistered: true,
            registration,
            isControlling: !!navigator.serviceWorker.controller
          }))
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              setState(prev => ({ ...prev, isInstalling: true }))
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  setState(prev => ({
                    ...prev,
                    isInstalling: false,
                    isWaiting: true
                  }))
                }
              })
            }
          })
        }
      })
      
      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState(prev => ({
          ...prev,
          isControlling: !!navigator.serviceWorker.controller
        }))
      })
    }
  }, [])

  const register = async (): Promise<void> => {
    if (!state.isSupported) {
      throw new Error('Service Workers not supported')
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      setState(prev => ({
        ...prev,
        isRegistered: true,
        registration,
        error: null
      }))

      console.log('Service Worker registered successfully:', registration)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        error: errorMessage
      }))
      console.error('Service Worker registration failed:', error)
      throw error
    }
  }

  const unregister = async (): Promise<void> => {
    if (state.registration) {
      const success = await state.registration.unregister()
      if (success) {
        setState(prev => ({
          ...prev,
          isRegistered: false,
          registration: null,
          isControlling: false
        }))
        console.log('Service Worker unregistered successfully')
      }
    }
  }

  const update = async (): Promise<void> => {
    if (state.registration) {
      await state.registration.update()
      console.log('Service Worker update check completed')
    }
  }

  const skipWaiting = (): void => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      setState(prev => ({ ...prev, isWaiting: false }))
    }
  }

  const postMessage = (message: any): void => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message)
    }
  }

  return {
    ...state,
    register,
    unregister,
    update,
    skipWaiting,
    postMessage
  }
}

// Hook for PWA installation
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      return true
    }

    return false
  }

  return {
    isInstallable,
    isInstalled,
    install
  }
}