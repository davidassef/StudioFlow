'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import NotificationContainer from '@/components/ui/NotificationContainer'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      {children}
      <NotificationContainer />
    </AuthProvider>
  )
}