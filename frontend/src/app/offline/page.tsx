import dynamic from "next/dynamic"

const OfflinePage = dynamic(() => import("@/components/pages/OfflinePage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Offline() {
  return <OfflinePage />
}
