'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X, Minus } from 'lucide-react'
import { TouchButton } from './TouchButton'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  snapPoints?: number[] // Percentage heights: [25, 50, 90]
  defaultSnapPoint?: number
  showHandle?: boolean
  showCloseButton?: boolean
  preventClose?: boolean
  onSnapPointChange?: (snapPoint: number) => void
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
  snapPoints = [90],
  defaultSnapPoint = snapPoints[0],
  showHandle = true,
  showCloseButton = true,
  preventClose = false,
  onSnapPointChange,
}: BottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(defaultSnapPoint)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const [mounted, setMounted] = useState(false)

  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true)
    setDragStartY(clientY)
    setDragCurrentY(clientY)
  }, [])

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return
    setDragCurrentY(clientY)
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return

    const dragDistance = dragCurrentY - dragStartY
    const threshold = 100

    if (dragDistance > threshold) {
      // Dragged down significantly
      const currentIndex = snapPoints.indexOf(currentSnapPoint)
      if (currentIndex > 0) {
        // Snap to lower point
        const newSnapPoint = snapPoints[currentIndex - 1]
        setCurrentSnapPoint(newSnapPoint)
        onSnapPointChange?.(newSnapPoint)
      } else if (!preventClose) {
        // Close if at lowest point
        onClose()
      }
    } else if (dragDistance < -threshold) {
      // Dragged up significantly
      const currentIndex = snapPoints.indexOf(currentSnapPoint)
      if (currentIndex < snapPoints.length - 1) {
        // Snap to higher point
        const newSnapPoint = snapPoints[currentIndex + 1]
        setCurrentSnapPoint(newSnapPoint)
        onSnapPointChange?.(newSnapPoint)
      }
    }

    setIsDragging(false)
    setDragStartY(0)
    setDragCurrentY(0)
  }, [isDragging, dragCurrentY, dragStartY, snapPoints, currentSnapPoint, preventClose, onClose, onSnapPointChange])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY)
  }, [handleDragStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY)
  }, [handleDragMove])

  const handleTouchEnd = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleDragStart(e.clientY)
  }, [handleDragStart])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientY)
  }, [handleDragMove])

  const handleMouseUp = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose) {
      onClose()
    }
  }, [onClose, preventClose])

  const dragOffset = isDragging ? Math.max(0, dragCurrentY - dragStartY) : 0
  const sheetHeight = currentSnapPoint
  const translateY = isDragging ? dragOffset : 0

  if (!mounted) return null

  const sheet = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center",
        "md:items-center md:justify-center", // Center on desktop
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleBackdropClick}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "relative w-full bg-background border-t border-border rounded-t-xl shadow-xl",
          "md:max-w-md md:rounded-xl md:border", // Desktop styling
          "transition-transform duration-300 ease-out",
          className
        )}
        style={{
          height: `${sheetHeight}vh`,
          transform: `translateY(${isOpen ? translateY : 100}%)`,
          maxHeight: '90vh',
        }}
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing md:hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <TouchButton
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </TouchButton>
            )}
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)', // iOS safe area
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(sheet, document.body)
}

// Hook for bottom sheet state management
export function useBottomSheet(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}

// Preset bottom sheets for common use cases
interface FormBottomSheetProps extends Omit<BottomSheetProps, 'snapPoints' | 'defaultSnapPoint'> {
  onSubmit?: () => void
  submitLabel?: string
  cancelLabel?: string
  isSubmitting?: boolean
}

export function FormBottomSheet({
  children,
  onSubmit,
  onClose,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  isSubmitting = false,
  ...props
}: FormBottomSheetProps) {
  return (
    <BottomSheet
      {...props}
      onClose={onClose}
      snapPoints={[70, 90]}
      defaultSnapPoint={70}
    >
      <div className="space-y-6">
        {children}
        
        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <TouchButton
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            {cancelLabel}
          </TouchButton>
          <TouchButton
            onClick={onSubmit}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : submitLabel}
          </TouchButton>
        </div>
      </div>
    </BottomSheet>
  )
}