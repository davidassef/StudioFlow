import dynamic from "next/dynamic"

const CadastroClientePage = dynamic(() => import("@/components/pages/CadastroClientePage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function CadastroCliente() {
  return <CadastroClientePage />
}
