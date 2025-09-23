'use client'

export default function Error404Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">404 - Página Não Encontrada</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">A página que você está procurando não foi encontrada.</p>
      </div>
    </div>
  )
}