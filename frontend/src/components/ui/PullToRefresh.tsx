'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { RefreshCw, ArrowDown } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  refreshThreshold?: number
  className?: string
  disabled?: boolean
}

export function PullToRefresh({
  onRefresh,
  children,
  refreshThreshold = 80,
  className,
  disabled = false,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return
    
    const container = containerRef.current
    if (!container) return

    // Only allow pull-to-refresh when at the top of the container
    if (container.scrollTop > 0) return

    startY.current = e.touches[0].clientY
    isDragging.current = true
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || disabled || isRefreshing) return

    currentY.current = e.touches[0].clientY
    const distance = Math.max(0, currentY.current - startY.current)
    
    // Apply resistance to the pull
    const resistance = 0.5
    const adjustedDistance = distance * resistance

    setPullDistance(adjustedDistance)
    setCanRefresh(adjustedDistance >= refreshThreshold)

    // Prevent default scrolling when pulling down
    if (distance > 0) {
      e.preventDefault()
    }
  }, [disabled, isRefreshing, refreshThreshold])

  const handleTouchEnd = useCallback(async () => {
    if (!isDragging.current || disabled) return

    isDragging.current = false

    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true)
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }

      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
      }
    }

    // Reset state
    setPullDistance(0)
    setCanRefresh(false)
  }, [canRefresh, disabled, isRefreshing, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const refreshIndicatorHeight = Math.min(pullDistance, refreshThreshold)
  const refreshProgress = Math.min(pullDistance / refreshThreshold, 1)

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-auto h-full",
        "md:overflow-y-auto", // Normal scrolling on desktop
        className
      )}
      style={{
        transform: `translateY(${isRefreshing ? refreshThreshold : pullDistance}px)`,
        transition: isDragging.current ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {/* Refresh Indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center",
          "bg-background/95 backdrop-blur-sm border-b border-border",
          "transition-opacity duration-200",
          "md:hidden" // Hide on desktop
        )}
        style={{
          height: `${refreshIndicatorHeight}px`,
          transform: `translateY(-${refreshThreshold}px)`,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          {isRefreshing ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Atualizando...</span>
            </>
          ) : canRefresh ? (
            <>
              <ArrowDown className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Solte para atualizar</span>
            </>
          ) : (
            <>
              <ArrowDown 
                className="h-5 w-5 transition-transform duration-200" 
                style={{ transform: `rotate(${refreshProgress * 180}deg)` }}
              />
              <span className="text-sm font-medium">Puxe para atualizar</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-full">
        {children}
      </div>
    </div>
  )
}

// Hook for using pull-to-refresh functionality
export function usePullToRefresh(refreshFn: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await refreshFn()
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshFn, isRefreshing])

  return {
    isRefreshing,
    handleRefresh,
  }
}