import dynamic from "next/dynamic"

const ClientesPage = dynamic(() => import("@/components/pages/ClientesPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Clientes() {
  return <ClientesPage />
}
