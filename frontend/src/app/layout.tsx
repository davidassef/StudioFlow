import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import NotificationContainer from '@/components/ui/NotificationContainer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudioFlow',
  description: 'Sistema de agendamento para estúdios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <NotificationContainer />
        </AuthProvider>
      </body>
    </html>
  )
}