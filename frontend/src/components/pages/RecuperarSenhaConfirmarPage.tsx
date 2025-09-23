'use client'

import { useAuthStore } from '@/stores/authStore'

export default function RecuperarSenhaConfirmarPage() {
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Confirmar Recuperação de Senha</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Página de confirmação de recuperação de senha em desenvolvimento.</p>
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