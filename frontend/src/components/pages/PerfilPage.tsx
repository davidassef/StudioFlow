'use client'

import { useAuthStore } from '@/stores/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingStates'

export default function PerfilPage() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <p className="text-gray-900">{user?.nome || 'Não informado'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900">{user?.email || 'Não informado'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de conta</label>
              <p className="text-gray-900">{user?.user_type || 'Não informado'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}