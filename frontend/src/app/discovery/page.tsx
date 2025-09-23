import dynamic from "next/dynamic"

const DiscoveryPage = dynamic(() => import("@/components/pages/DiscoveryPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Discovery() {
  return <DiscoveryPage />
}
