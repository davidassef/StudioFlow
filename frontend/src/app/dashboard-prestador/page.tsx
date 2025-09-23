import dynamic from "next/dynamic"

const DashboardPrestadorPage = dynamic(() => import("@/components/pages/DashboardPrestadorPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function DashboardPrestador() {
  return <DashboardPrestadorPage />
}
