import dynamic from "next/dynamic"

const AgendamentosPage = dynamic(() => import("@/components/pages/AgendamentosPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Agendamentos() {
  return <AgendamentosPage />
}
