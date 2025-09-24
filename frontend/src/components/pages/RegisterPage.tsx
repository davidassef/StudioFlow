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
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <StudioFlowLogo className="text-3xl mb-2" />
            <p className="text-slate-300">Crie sua conta</p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <div>Formulário de registro em desenvolvimento</div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}