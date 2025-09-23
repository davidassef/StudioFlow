'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const touchButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline active:underline",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px]", // 44px minimum touch target
        sm: "h-9 rounded-md px-3 min-h-[44px]",
        lg: "h-11 rounded-md px-8 min-h-[44px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]", // Ensure minimum touch target
        touch: "h-12 px-6 py-3 min-h-[48px]", // Extra large for mobile
      },
      touchRipple: {
        true: "touch-ripple",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      touchRipple: true,
    },
  }
)

export interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  asChild?: boolean
  hapticFeedback?: boolean
  touchRipple?: boolean
  minTouchTarget?: number
}

const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    hapticFeedback = true,
    touchRipple = true,
    minTouchTarget = 44,
    onClick,
    onTouchStart,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])
    const rippleId = React.useRef(0)

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback for supported devices
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10) // Short vibration
      }

      // Create ripple effect
      if (touchRipple) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = rippleId.current++

        setRipples(prev => [...prev, { id, x, y }])

        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== id))
        }, 600)
      }

      onClick?.(e)
    }, [hapticFeedback, touchRipple, onClick])

    const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
      // Enhanced touch feedback
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(5) // Very short vibration on touch start
      }

      onTouchStart?.(e)
    }, [hapticFeedback, onTouchStart])

    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          touchButtonVariants({ variant, size, touchRipple, className }),
          // Ensure minimum touch target
          minTouchTarget && {
            minHeight: `${minTouchTarget}px`,
            minWidth: size === 'icon' ? `${minTouchTarget}px` : 'auto'
          }
        )}
        ref={ref}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        {...props}
      >
        {props.children}
        
        {/* Ripple effects */}
        {touchRipple && ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute pointer-events-none rounded-full bg-white/20 animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              animationDuration: '600ms',
            }}
          />
        ))}
      </Comp>
    )
  }
)
TouchButton.displayName = "TouchButton"

export { TouchButton, touchButtonVariants }