'use client'

import { useAuthStore } from '@/stores/authStore'

export default function DashboardPrestadorPage() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <div>Por favor, faça login para acessar esta página.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard do Prestador</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Página de dashboard do prestador em desenvolvimento.</p>
        {user && (
          <div className="mt-4">
            <p><strong>Usuário:</strong> {user.nome}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}