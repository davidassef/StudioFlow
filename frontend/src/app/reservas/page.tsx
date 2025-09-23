import dynamic from "next/dynamic"

const ReservasPage = dynamic(() => import("@/components/pages/ReservasPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Reservas() {
  return <ReservasPage />
}
