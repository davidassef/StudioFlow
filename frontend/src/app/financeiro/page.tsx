import dynamic from "next/dynamic"

const FinanceiroPage = dynamic(() => import("@/components/pages/FinanceiroPage"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Financeiro() {
  return <FinanceiroPage />
}
