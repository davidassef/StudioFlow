'use client'

import React, { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SwipeGestureProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  swipeThreshold?: number
  velocityThreshold?: number
  className?: string
  disabled?: boolean
}

export function SwipeGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  velocityThreshold = 0.3,
  className,
  disabled = false,
}: SwipeGestureProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const startTime = useRef(0)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    startX.current = touch.clientX
    startY.current = touch.clientY
    startTime.current = Date.now()
    isDragging.current = true
  }, [disabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || disabled) return

    // Prevent default scrolling for horizontal swipes
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - startX.current)
    const deltaY = Math.abs(touch.clientY - startY.current)

    // If horizontal movement is greater than vertical, prevent default
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault()
    }
  }, [disabled])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDragging.current || disabled) return

    const touch = e.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY
    const endTime = Date.now()

    const deltaX = endX - startX.current
    const deltaY = endY - startY.current
    const deltaTime = endTime - startTime.current

    const distanceX = Math.abs(deltaX)
    const distanceY = Math.abs(deltaY)
    const velocityX = distanceX / deltaTime
    const velocityY = distanceY / deltaTime

    isDragging.current = false

    // Determine swipe direction
    if (distanceX > distanceY) {
      // Horizontal swipe
      if (distanceX > swipeThreshold || velocityX > velocityThreshold) {
        if (deltaX > 0) {
          // Swipe right
          onSwipeRight?.()
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(10)
          }
        } else {
          // Swipe left
          onSwipeLeft?.()
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(10)
          }
        }
      }
    } else {
      // Vertical swipe
      if (distanceY > swipeThreshold || velocityY > velocityThreshold) {
        if (deltaY > 0) {
          // Swipe down
          onSwipeDown?.()
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(10)
          }
        } else {
          // Swipe up
          onSwipeUp?.()
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(10)
          }
        }
      }
    }
  }, [disabled, swipeThreshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <div
      ref={containerRef}
      className={cn("touch-pan-y", className)}
      style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but handle horizontal swipes
    >
      {children}
    </div>
  )
}

// Enhanced Calendar with Swipe Navigation
interface SwipeCalendarProps {
  children: React.ReactNode
  onPreviousMonth?: () => void
  onNextMonth?: () => void
  onPreviousWeek?: () => void
  onNextWeek?: () => void
  className?: string
  disabled?: boolean
}

export function SwipeCalendar({
  children,
  onPreviousMonth,
  onNextMonth,
  onPreviousWeek,
  onNextWeek,
  className,
  disabled = false,
}: SwipeCalendarProps) {
  return (
    <SwipeGesture
      onSwipeLeft={onNextMonth || onNextWeek}
      onSwipeRight={onPreviousMonth || onPreviousWeek}
      className={cn("select-none", className)}
      disabled={disabled}
      swipeThreshold={60}
      velocityThreshold={0.4}
    >
      {children}
    </SwipeGesture>
  )
}

// Hook for swipe gestures
export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  velocityThreshold = 0.3,
}: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  swipeThreshold?: number
  velocityThreshold?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let startX = 0
    let startY = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY
      const endTime = Date.now()

      const deltaX = endX - startX
      const deltaY = endY - startY
      const deltaTime = endTime - startTime

      const distanceX = Math.abs(deltaX)
      const distanceY = Math.abs(deltaY)
      const velocityX = distanceX / deltaTime
      const velocityY = distanceY / deltaTime

      if (distanceX > distanceY) {
        if (distanceX > swipeThreshold || velocityX > velocityThreshold) {
          if (deltaX > 0) {
            onSwipeRight?.()
          } else {
            onSwipeLeft?.()
          }
        }
      } else {
        if (distanceY > swipeThreshold || velocityY > velocityThreshold) {
          if (deltaY > 0) {
            onSwipeDown?.()
          } else {
            onSwipeUp?.()
          }
        }
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, swipeThreshold, velocityThreshold])

  return ref
}