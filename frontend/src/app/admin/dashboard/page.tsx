import dynamic from "next/dynamic"

const AdminDashboardPage = dynamic(() => import("@/components/pages/AdminDashboardPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function AdminDashboard() {
  return <AdminDashboardPage />
}
