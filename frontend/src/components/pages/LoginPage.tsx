'use client'

import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingStates'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard'
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">StudioFlow</h1>
            <p className="text-gray-600">Entre na sua conta</p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <div>Formulário de login em desenvolvimento</div>
          </Suspense>
        </div>
      </div>
    </div>
  )
}