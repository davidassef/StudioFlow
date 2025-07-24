'use client'

import { Suspense, useState, lazy } from 'react'

// Lazy load modals for better performance - usando React.lazy para melhor controle
const LoginModal = lazy(() => import('./LoginModal'))
const RegisterModal = lazy(() => import('./RegisterModal'))

// Enhanced loading fallback component
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl w-full max-w-md p-8 border border-slate-700">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-green-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-orange-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Carregando modal...
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Preparando interface de autenticação
          </p>
        </div>
      </div>
    </div>
  </div>
)

interface AuthModalManagerProps {
  isOpen: boolean
  onClose: () => void
  initialModal: 'login' | 'register'
}

export default function AuthModalManager({ isOpen, onClose, initialModal }: AuthModalManagerProps) {
  const [currentModal, setCurrentModal] = useState<'login' | 'register'>(initialModal)

  if (!isOpen) return null

  const handleSwitchToRegister = () => {
    setCurrentModal('register')
  }

  const handleSwitchToLogin = () => {
    setCurrentModal('login')
  }

  const handleClose = () => {
    setCurrentModal(initialModal) // Reset to initial modal
    onClose()
  }

  // Renderiza apenas o modal atual com Suspense individual
  return (
    <>
      {currentModal === 'login' && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <LoginModal
            isOpen={isOpen}
            onClose={handleClose}
            onSwitchToRegister={handleSwitchToRegister}
          />
        </Suspense>
      )}
      {currentModal === 'register' && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <RegisterModal
            isOpen={isOpen}
            onClose={handleClose}
            onSwitchToLogin={handleSwitchToLogin}
          />
        </Suspense>
      )}
    </>
  )
}