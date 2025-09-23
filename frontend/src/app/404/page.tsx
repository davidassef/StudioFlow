import dynamic from "next/dynamic"

const Error404Page = dynamic(() => import("@/components/pages/Error404Page"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Error404() {
  return <Error404Page />
}
