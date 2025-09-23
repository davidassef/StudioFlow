import dynamic from "next/dynamic"

const AdminRoomsPage = dynamic(() => import("@/components/pages/AdminRoomsPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function AdminRooms() {
  return <AdminRoomsPage />
}
