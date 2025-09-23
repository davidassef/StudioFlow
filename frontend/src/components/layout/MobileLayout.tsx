'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { MobileNavigation, FloatingActionButton } from './MobileNavigation'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '../AuthModal'
import { Plus, Menu, X } from 'lucide-react'
import { TouchButton } from '@/components/ui/TouchButton'

interface MobileLayoutProps {
  children: ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  showMobileNav?: boolean
  showFAB?: boolean
  onFABClick?: () => void
  fabIcon?: React.ComponentType<{ className?: string }>
  fabLabel?: string
  className?: string
}

export function MobileLayout({
  children,
  user,
  showMobileNav = true,
  showFAB = true,
  onFABClick,
  fabIcon = Plus,
  fabLabel = "Novo Agendamento",
  className,
}: MobileLayoutProps) {
  const { showAuthModal, authAction, hideAuthModal } = useAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // Detect virtual keyboard on mobile
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight
      const windowHeight = window.innerHeight
      const threshold = 150 // pixels

      setIsKeyboardVisible(windowHeight - viewportHeight > threshold)
    }

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize)
      return () => window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false)

  return (
    <div className={cn("flex h-screen bg-background overflow-hidden", className)}>
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 md:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Menu</h2>
          <TouchButton
            variant="ghost"
            size="icon"
            onClick={closeMobileSidebar}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </TouchButton>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar onItemClick={closeMobileSidebar} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Enhanced Header with Mobile Menu */}
        <div className="flex-shrink-0">
          <Header 
            user={user}
            onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
            showMobileMenu={true}
          />
        </div>

        {/* Page Content */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto smooth-scroll",
            // Add bottom padding when mobile nav is visible and keyboard is not
            showMobileNav && !isKeyboardVisible && "pb-20 md:pb-0",
            // Mobile-specific padding
            "mobile-padding md:p-6"
          )}
          style={{
            paddingBottom: showMobileNav && !isKeyboardVisible 
              ? `calc(5rem + env(safe-area-inset-bottom))` 
              : 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {showMobileNav && !isKeyboardVisible && (
        <MobileNavigation className="md:hidden" />
      )}

      {/* Floating Action Button */}
      {showFAB && !isKeyboardVisible && (
        <FloatingActionButton
          onClick={onFABClick}
          icon={fabIcon}
          label={fabLabel}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={hideAuthModal}
        action={authAction || ''}
      />
    </div>
  )
}

// Enhanced Header with Mobile Menu Support
interface EnhancedHeaderProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onMobileMenuClick?: () => void
  showMobileMenu?: boolean
}

function EnhancedHeader({ user, onMobileMenuClick, showMobileMenu = true }: EnhancedHeaderProps) {
  return (
    <header 
      className="flex h-16 items-center justify-between border-b bg-card/95 backdrop-blur-sm px-4 md:px-6"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Mobile Menu Button */}
      {showMobileMenu && (
        <div className="flex items-center space-x-4 lg:hidden">
          <TouchButton
            variant="ghost"
            size="icon"
            onClick={onMobileMenuClick}
            className="h-10 w-10"
          >
            <Menu className="h-5 w-5" />
          </TouchButton>
        </div>
      )}

      {/* Desktop Title */}
      <div className="hidden lg:block">
        <h1 className="text-xl font-semibold text-foreground">StudioFlow</h1>
      </div>

      {/* Mobile Title */}
      <div className="flex-1 text-center lg:hidden">
        <h1 className="text-lg font-semibold text-foreground">StudioFlow</h1>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        {/* User Avatar/Menu */}
        <TouchButton
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
        >
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </TouchButton>
      </div>
    </header>
  )
}

// Hook for mobile layout state
export function useMobileLayout() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setOrientation(height > width ? 'portrait' : 'landscape')
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    orientation,
  }
}