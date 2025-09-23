import dynamic from "next/dynamic"

const FavoritosPage = dynamic(() => import("@/components/pages/FavoritosPage"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>
})

export default function Favoritos() {
  return <FavoritosPage />
}