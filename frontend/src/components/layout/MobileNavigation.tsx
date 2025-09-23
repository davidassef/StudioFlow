'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TouchButton } from '@/components/ui/TouchButton'
import {
  Home,
  Calendar,
  Plus,
  Search,
  User,
  Bell,
  Settings,
  Music,
} from 'lucide-react'

interface MobileNavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
}

const navigationItems: MobileNavItem[] = [
  {
    href: '/dashboard',
    icon: Home,
    label: 'Início',
  },
  {
    href: '/agendamentos',
    icon: Calendar,
    label: 'Agenda',
  },
  {
    href: '/novo-agendamento',
    icon: Plus,
    label: 'Novo',
  },
  {
    href: '/buscar',
    icon: Search,
    label: 'Buscar',
  },
  {
    href: '/perfil',
    icon: User,
    label: 'Perfil',
  },
]

interface MobileNavigationProps {
  className?: string
  notificationCount?: number
}

export function MobileNavigation({ className, notificationCount = 0 }: MobileNavigationProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border",
        "safe-area-pb", // Custom class for safe area padding
        "md:hidden", // Hide on desktop
        className
      )}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)', // iOS safe area
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <TouchButton
                variant="ghost"
                size="touch"
                className={cn(
                  "flex flex-col items-center justify-center gap-1 h-16 w-full rounded-lg transition-all duration-200",
                  "hover:bg-accent/50 active:bg-accent/70",
                  isActive && "bg-accent text-accent-foreground"
                )}
                hapticFeedback={true}
                touchRipple={true}
              >
                <div className="relative">
                  <Icon 
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                  {item.label === 'Novo' && (
                    <div className="absolute -inset-1 bg-primary/20 rounded-full animate-pulse" />
                  )}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span 
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </TouchButton>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Floating Action Button for primary actions
interface FloatingActionButtonProps {
  onClick?: () => void
  icon?: React.ComponentType<{ className?: string }>
  label?: string
  className?: string
}

export function FloatingActionButton({ 
  onClick, 
  icon: Icon = Plus, 
  label = "Novo Agendamento",
  className 
}: FloatingActionButtonProps) {
  return (
    <TouchButton
      onClick={onClick}
      size="touch"
      className={cn(
        "fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "md:hidden", // Hide on desktop
        className
      )}
      hapticFeedback={true}
      touchRipple={true}
      title={label}
      style={{
        marginBottom: 'env(safe-area-inset-bottom)', // iOS safe area
      }}
    >
      <Icon className="h-6 w-6" />
    </TouchButton>
  )
}

// Quick Actions Bar for common tasks
interface QuickAction {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  color?: 'default' | 'primary' | 'secondary' | 'destructive'
}

interface QuickActionsBarProps {
  actions: QuickAction[]
  className?: string
}

export function QuickActionsBar({ actions, className }: QuickActionsBarProps) {
  return (
    <div
      className={cn(
        "flex gap-2 p-4 bg-card/95 backdrop-blur-sm border-t border-border",
        "md:hidden", // Hide on desktop
        className
      )}
    >
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <TouchButton
            key={action.id}
            onClick={action.onClick}
            variant={action.color === 'primary' ? 'default' : 'outline'}
            size="touch"
            className="flex-1 flex flex-col items-center gap-2 h-16"
            hapticFeedback={true}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </TouchButton>
        )
      })}
    </div>
  )
}