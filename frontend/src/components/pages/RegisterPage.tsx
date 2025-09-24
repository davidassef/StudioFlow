'use client'

import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingStates'
import { useAuthStore } from '@/stores/authStore'
import { StudioFlowLogo } from '@/components/ui/GoldText'

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/95 border border-amber-400/30 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <StudioFlowLogo className="text-3xl mb-2" />
            <p className="text-amber-200/80">Crie sua conta</p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <div className="text-amber-200/80">Formulário de registro em desenvolvimento</div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}