import dynamic from "next/dynamic"

const PerfilEstudioPage = dynamic(() => import("@/components/pages/PerfilEstudioPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function PerfilEstudio() {
  return <PerfilEstudioPage />
}
