import dynamic from "next/dynamic"

const CadastroEstudioPage = dynamic(() => import("@/components/pages/CadastroEstudioPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function CadastroEstudio() {
  return <CadastroEstudioPage />
}
