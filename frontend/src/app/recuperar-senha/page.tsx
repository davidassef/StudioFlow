import dynamic from "next/dynamic"

const RecuperarSenhaPage = dynamic(() => import("@/components/pages/RecuperarSenhaPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function RecuperarSenha() {
  return <RecuperarSenhaPage />
}
