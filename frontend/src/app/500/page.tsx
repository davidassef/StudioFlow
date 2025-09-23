import dynamic from "next/dynamic"

const Error500Page = dynamic(() => import("@/components/pages/Error500Page"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Carregando...</div>
})

export default function Error500() {
  return <Error500Page />
}
