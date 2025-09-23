'use client'

import { useAuthStore } from '@/stores/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingStates'

export default function FeedPage() {
  const { isAuthenticated } = useAuthStore()

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Feed</h1>

          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Seu feed de atividades está vazio.</p>
            <p className="text-gray-500 mt-2">Comece explorando estúdios e fazendo reservas!</p>
          </div>
        </div>
      </div>
    </div>
  )
}