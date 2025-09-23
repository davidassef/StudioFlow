import dynamic from 'next/dynamic'

const ConfiguracoesPage = dynamic(() => import('@/components/pages/ConfiguracoesPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Configuracoes() {
  return <ConfiguracoesPage />
}