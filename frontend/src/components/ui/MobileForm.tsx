'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { TouchButton } from './TouchButton'
import { BottomSheet, FormBottomSheet } from './BottomSheet'

// Enhanced Input with mobile optimizations
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ComponentType<{ className?: string }>
  rightIcon?: React.ComponentType<{ className?: string }>
  onRightIconClick?: () => void
  touchOptimized?: boolean
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    leftIcon: LeftIcon, 
    rightIcon: RightIcon, 
    onRightIconClick,
    touchOptimized = true,
    ...props 
  }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground block">
            {label}
          </label>
        )}
        
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <LeftIcon className="h-5 w-5" />
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Mobile optimizations
              touchOptimized && [
                "h-12 px-4 py-3", // Larger touch target
                "text-base", // Prevent zoom on iOS
                "transition-all duration-200",
                "focus:border-primary focus:shadow-lg focus:shadow-primary/10",
              ],
              LeftIcon && "pl-10",
              RightIcon && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
          
          {RightIcon && (
            <TouchButton
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={onRightIconClick}
            >
              <RightIcon className="h-4 w-4" />
            </TouchButton>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
MobileInput.displayName = "MobileInput"

// Enhanced Textarea with mobile optimizations
interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  touchOptimized?: boolean
  autoResize?: boolean
}

export const MobileTextarea = forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    touchOptimized = true,
    autoResize = false,
    ...props 
  }, ref) => {
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.target as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      }
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground block">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={cn(
            "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background",
            "placeholder:text-muted-foreground resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Mobile optimizations
            touchOptimized && [
              "min-h-[96px] px-4 py-3", // Larger touch target
              "text-base", // Prevent zoom on iOS
              "transition-all duration-200",
              "focus:border-primary focus:shadow-lg focus:shadow-primary/10",
            ],
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          onInput={handleInput}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
MobileTextarea.displayName = "MobileTextarea"

// Enhanced Select with mobile optimizations
interface MobileSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
  touchOptimized?: boolean
}

export const MobileSelect = forwardRef<HTMLSelectElement, MobileSelectProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    options,
    placeholder,
    touchOptimized = true,
    ...props 
  }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground block">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={cn(
            "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Mobile optimizations
            touchOptimized && [
              "h-12 px-4 py-3", // Larger touch target
              "text-base", // Prevent zoom on iOS
              "transition-all duration-200",
              "focus:border-primary focus:shadow-lg focus:shadow-primary/10",
            ],
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)
MobileSelect.displayName = "MobileSelect"

// Mobile Form Container
interface MobileFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  title?: string
  description?: string
  onSubmit?: (e: React.FormEvent) => void
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  showAsBottomSheet?: boolean
  bottomSheetProps?: any
}

export function MobileForm({
  children,
  title,
  description,
  onSubmit,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  onCancel,
  isSubmitting = false,
  showAsBottomSheet = false,
  bottomSheetProps,
  className,
  ...props
}: MobileFormProps) {
  const formContent = (
    <form
      onSubmit={onSubmit}
      className={cn(
        "space-y-6",
        !showAsBottomSheet && "p-4 md:p-6",
        className
      )}
      {...props}
    >
      {(title || description) && !showAsBottomSheet && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
      
      {(onSubmit || onCancel) && !showAsBottomSheet && (
        <div className="flex gap-3 pt-4 border-t border-border">
          {onCancel && (
            <TouchButton
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              {cancelLabel}
            </TouchButton>
          )}
          {onSubmit && (
            <TouchButton
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : submitLabel}
            </TouchButton>
          )}
        </div>
      )}
    </form>
  )

  if (showAsBottomSheet) {
    return (
      <FormBottomSheet
        title={title}
        description={description}
        onSubmit={onSubmit}
        submitLabel={submitLabel}
        cancelLabel={cancelLabel}
        isSubmitting={isSubmitting}
        {...bottomSheetProps}
      >
        <div className="space-y-4">
          {children}
        </div>
      </FormBottomSheet>
    )
  }

  return formContent
}

// Form Field Group for better organization
interface FormFieldGroupProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormFieldGroup({ title, description, children, className }: FormFieldGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}