import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import './globals.css'
import dynamic from 'next/dynamic'

const ClientLayout = dynamic(() => import('@/components/ClientLayout'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})
// import ServiceWorkerManager, { PWAInstallPrompt } from '@/components/pwa/ServiceWorkerManager'
// import PWATestPanel from '@/components/pwa/PWATestPanel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StudioFlow',
  description: 'Sistema completo para gestão de estúdios musicais',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StudioFlow',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'StudioFlow',
    title: 'StudioFlow - Gestão de Estúdios Musicais',
    description: 'Sistema completo para gestão de estúdios musicais',
  },
  twitter: {
    card: 'summary',
    title: 'StudioFlow - Gestão de Estúdios Musicais',
    description: 'Sistema completo para gestão de estúdios musicais',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StudioFlow" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
        {/* <ServiceWorkerManager />
        <PWAInstallPrompt /> */}
        {/* <PWATestPanel /> */}
      </body>
    </html>
  )
}