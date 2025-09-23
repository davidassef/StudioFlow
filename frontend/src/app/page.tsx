import dynamic from 'next/dynamic'

// Dynamic import to avoid prerendering issues with Zustand stores
const HomePage = dynamic(() => import('@/components/HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Carregando StudioFlow...</div>
    </div>
  )
})

export default function Page() {
  return <HomePage />
}
