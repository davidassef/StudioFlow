import dynamic from "next/dynamic"

const RecuperarSenhaConfirmarPage = dynamic(() => import("@/components/pages/RecuperarSenhaConfirmarPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function RecuperarSenhaConfirmar() {
  return <RecuperarSenhaConfirmarPage />
}
