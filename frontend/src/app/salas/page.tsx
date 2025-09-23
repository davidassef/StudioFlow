import dynamic from "next/dynamic"

const SalasPage = dynamic(() => import("@/components/pages/SalasPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Salas() {
  return <SalasPage />
}
