'use client'

import { useState, useEffect, useCallback } from 'react'
import { pushNotificationManager, NotificationPreferences, NotificationPayload } from '@/lib/pushNotificationManager'

interface PushNotificationState {
  isSupported: boolean
  permission: NotificationPermission
  subscription: PushSubscription | null
  isSubscribed: boolean
  preferences: NotificationPreferences
  isInitialized: boolean
  error: string | null
}

interface PushNotificationActions {
  requestPermission: () => Promise<NotificationPermission>
  requestPermissionWithUI: () => Promise<{ permission: NotificationPermission; userInteracted: boolean }>
  subscribe: () => Promise<PushSubscription | null>
  unsubscribe: () => Promise<boolean>
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>
  showLocalNotification: (payload: NotificationPayload) => void
  sendTestNotification: () => void
  sendTestPushNotification: () => Promise<void>
  refreshState: () => Promise<void>
}

export function usePushNotifications(): PushNotificationState & PushNotificationActions {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    subscription: null,
    isSubscribed: false,
    preferences: pushNotificationManager.getDefaultPreferences(),
    isInitialized: false,
    error: null
  })

  // Initialize push notification manager
  useEffect(() => {
    const initializeManager = async () => {
      try {
        await pushNotificationManager.initialize()
        await refreshState()
        setState(prev => ({ ...prev, isInitialized: true, error: null }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Initialization failed'
        setState(prev => ({ ...prev, error: errorMessage, isInitialized: false }))
      }
    }

    initializeManager()
  }, [])

  const refreshState = useCallback(async () => {
    try {
      const isSupported = pushNotificationManager.isSupported()
      const permission = pushNotificationManager.getPermissionStatus()
      const subscription = pushNotificationManager.getSubscription()
      const isSubscribed = pushNotificationManager.isSubscribed()
      const preferences = await pushNotificationManager.loadPreferences()

      setState(prev => ({
        ...prev,
        isSupported,
        permission,
        subscription,
        isSubscribed,
        preferences,
        error: null
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh state'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    try {
      const permission = await pushNotificationManager.requestPermission()
      await refreshState()
      return permission
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Permission request failed'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [refreshState])

  const requestPermissionWithUI = useCallback(async () => {
    try {
      const result = await pushNotificationManager.requestPermissionWithUI()
      await refreshState()
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Permission request failed'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [refreshState])

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    try {
      const subscription = await pushNotificationManager.subscribe()
      await refreshState()
      return subscription
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription failed'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [refreshState])

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      const success = await pushNotificationManager.unsubscribe()
      await refreshState()
      return success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unsubscribe failed'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [refreshState])

  const updatePreferences = useCallback(async (preferences: Partial<NotificationPreferences>): Promise<void> => {
    try {
      await pushNotificationManager.savePreferences(preferences)
      await refreshState()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [refreshState])

  const showLocalNotification = useCallback((payload: NotificationPayload): void => {
    try {
      pushNotificationManager.showLocalNotification(payload)
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to show notification'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  const sendTestNotification = useCallback((): void => {
    try {
      pushNotificationManager.sendTestNotification()
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send test notification'
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [])

  const sendTestPushNotification = useCallback(async (): Promise<void> => {
    try {
      await pushNotificationManager.sendTestPushNotification()
      setState(prev => ({ ...prev, error: null }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send test push notification'
      setState(prev => ({ ...prev, error: errorMessage }))
      throw error
    }
  }, [])

  return {
    ...state,
    requestPermission,
    requestPermissionWithUI,
    subscribe,
    unsubscribe,
    updatePreferences,
    showLocalNotification,
    sendTestNotification,
    sendTestPushNotification,
    refreshState
  }
}