'use client'

export default function Error500Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">500 - Erro Interno do Servidor</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Ocorreu um erro interno no servidor.</p>
      </div>
    </div>
  )
}